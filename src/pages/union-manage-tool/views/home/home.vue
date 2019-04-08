<template>
  <el-container style="height: 100%; border: 1px solid #eee;">
    <asiderMenu></asiderMenu>
    <el-container>
      <div style="width:100%;">
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown @command="handleCommand">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{type: 'edit'}">编辑</el-dropdown-item>
              <el-dropdown-item :command="{type: 'quit'}">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span style="font-weight:bold">{{ userInfo.username }}</span>
        </el-header>
        <span></span>
        <el-container class="search-box">
          <el-button @click="addDiary" type="success">新增工作记录</el-button>
          <div class="flex-start">
            <el-select class="search-inp" placeholder="请选择" v-model="userName">
              <el-option label="全部" value="全部"></el-option>
              <el-option :key="item._id" :label="item.username" :value="item._id" v-for="item in dialogData.userlist"></el-option>
            </el-select>
            <el-button @click="search" type="primary">搜索</el-button>
          </div>
        </el-container>
        <el-main style="min-height:600px">
          <el-table :data="diaryList" @filter-change="filterChange" center>
            <el-table-column label="版本号" prop="version" width="80"></el-table-column>
            <el-table-column label="项目名称" prop="projectName" width="120"></el-table-column>
            <el-table-column label="工作内容" prop="detail" width="160"></el-table-column>
            <el-table-column label="开始时间" prop="createTime" width="160">
              <template slot-scope="scope">{{ scope.row.createTime | date }}</template>
            </el-table-column>
            <el-table-column label="计划完成时间" prop="planTime" width="160">
              <template slot-scope="scope">{{ scope.row.planTime | date }}</template>
            </el-table-column>
            <el-table-column label="结束时间" prop="endTime" width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.endTime">{{ scope.row.endTime | date }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="项目周期" prop="useDay" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.useDay">{{ scope.row.useDay | costDay }}天</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="负责人" prop="username" width="120"></el-table-column>
            <el-table-column label="发布者" prop="createUserName" width="120"></el-table-column>
            <el-table-column label="状态" prop="status">
              <template slot-scope="scope" width="80">
                <el-button round size="mini" type="primary" v-if="scope.row.status==1">进行中</el-button>
                <el-button round size="mini" type="success" v-if="scope.row.status==2">已完成</el-button>
                <el-button round size="mini" type="danger" v-if="scope.row.status==3">项目超时</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="220" prop="action">
              <template slot-scope="scope">
                <el-popover :content="scope.row.desc" placement="bottom" style="margin-right:10px" title="备注" trigger="click" width="200">
                  <el-button size="mini" slot="reference" type="primary">查看</el-button>
                </el-popover>
                <el-button @click="handleEdit(scope.row._id)" size="mini" type="info" v-show="scope.row.userid==userInfo._id">编辑</el-button>
                <el-button @click="handleFinish(scope.row._id)" size="mini" type="success" v-if="scope.row.status==1" v-show="scope.row.userid==userInfo._id">完成</el-button>
                <el-button @click="handleDelete(scope.row._id,scope.$index)" size="mini" type="danger" v-show="scope.row.userid==userInfo._id">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-pagination :total="total" @current-change="changePage" background class="pagination" layout="prev, pager, next"></el-pagination>
      </div>
    </el-container>
    <!-- 编辑个人信息 -->
    <el-dialog :visible.sync="editDialogFormVisible" title="修改个人资料" width="30%">
      <!-- :model="form" -->
      <el-form label-position="left" label-width="100px">
        <el-form-item label="昵称">
          <el-input v-model="updateUserName"></el-input>
        </el-form-item>
        <el-form-item label="输入新密码">
          <el-input show-password v-model="updatePassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input show-password v-model="affirmUpdatePassword"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer flex-end">
        <el-button @click="confirmOperation" type="primary">确 定</el-button>
        <el-button @click="cancelOperation">取 消</el-button>
      </div>
    </el-dialog>
    <postDiary :dialog-data="dialogData" @closeDialog="closeDialog" ref="postDialog"></postDiary>
  </el-container>
</template>
<script>
import postDiary from '@/components/post-diary/postDiary'
import asiderMenu from '@/components/asiderMenu/asiderMenu'
import md5 from 'js-md5'
export default {
  components: {
    postDiary,
    asiderMenu
  },
  inject: ['reload'],
  data() {
    return {
      diaryList: [],
      timeRange: '',
      userName: '',
      page: 1,
      dialogData: {
        showDialog: false,
        userlist: []
      },
      total: 0,
      editDialogFormVisible: false,
      updateUserName: '',
      updatePassword: '',
      affirmUpdatePassword: '',
      createTime: '',
      endTime: '',
      searchKeyWord: ''
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters['unionManageToolStore/userInfo']
    }
  },
  mounted() {
    if (!this.userInfo) {
      this.$router.push({ path: 'login' })
    }
    this.getDiaryList()
  },
  methods: {
    /* 首次进入页面拿到日志表 */
    async getDiaryList() {
      let data = {
        page: this.page
      }
      let res = await this.$api.getDiaryList(data)
      if (res.data && res.data.success) {
        this.diaryList = res.data.data.data
        this.total = res.data.data.total
        this.dialogData.userlist = res.data.data.userlist
      }
    },
    closeDialog() {
      this.dialogData.showDialog = false
    },
    addDiary() {
      this.dialogData.showDialog = true
    },
    /* 搜索用户 */
    filterChange(filters) {
      this.page = 1
      this.getDiaryList()
    },
    async search() {
      if (this.userName === '全部') {
        this.getDiaryList()
        return
      }
      let page = this.page
      let data = {
        page,
        userid: this.userName
      }
      let res = await this.$api.getSearchList(data)
      if (res.data.success) {
        this.diaryList = res.data.data.data
        this.total = res.data.data.total
        this.page = 1
      }
    },
    /* 编辑个人信息 */
    handleCommand(command) {
      if (command.type === 'edit') {
        this.editDialogFormVisible = true
        this.updateUserName = this.userInfo.username
      } else if (command.type === 'quit') {
        this.$store.commit('unionManageToolStore/userInfo', '')
        this.$router.push('login')
      }
    },
    // 编辑项目内容
    async handleEdit(id) {
      this.dialogData.showDialog = true
      this.dialogData.editid = id
      let res = await this.$api.getEditDiaryInfo({ id: id })
      res.data.data.editid = id
      this.$refs.postDialog.getEditDiaryInfo(res.data.data)
    },
    cancelOperation() {
      this.editDialogFormVisible = false
    },
    async confirmOperation() {
      if (!this.updatePassword && !this.affirmUpdatePassword) {
        alert('请输入密码')
      } else if (!Object.is(this.updatePassword, this.affirmUpdatePassword)) {
        alert('密码不一致')
      }
      let _id = this.$store.getters['unionManageToolStore/userInfo']._id
      let data = {
        updateUserName: this.updateUserName,
        updatePassword: md5(this.updatePassword),
        _id: _id
      }
      let res = await this.$api.updateUserMessage(data)
      if (res.data && res.data.success) {
        this.editDialogFormVisible = false
        this.$message({
          type: 'success',
          message: '修改成功!请重新登录'
        })
        this.$store.commit('unionManageToolStore/userInfo', '')
        this.$router.push('login')
      } else {
        alert('修改失败')
      }
    },
    async handleFinish(id) {
      this.$confirm('确认已完成本次工作任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let data = { id: id }
          let res = await this.$api.finishDiary(data)
          if (res) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.reload()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    async handleDelete(id, index) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let res = await this.$api.deleteDiary({ id: id })
          this.reload()
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 切换列表
    changePage(val) {
      this.page = val
      if (this.userName) {
        this.search()
      } else {
        this.getDiaryList()
      }
    }
  }
}
</script>
<style>
#el-container-box {
  flex-direction: column;
  justify-content: flex-start;
}
.pagination {
  padding-bottom: 80px;
}
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 100px 30px 20px;
  min-height: 60px;
}
.search-inp {
  width: 300px;
  margin: 0 30px;
}
.el-pagination {
  display: flex;
  justify-content: center;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
