<template>
  <el-dialog :visible.sync="dialogData.showDialog" @close="closeDialog" @close-on-click-modal="false" @show-close="false" class="dialog" title="新增记录">
    <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm" label-width="120px" ref="ruleForm">
      <div class="flex-start">
        <el-form-item label="工作内容" prop="detail">
          <el-input v-model="ruleForm.detail"></el-input>
        </el-form-item>
        <el-form-item label="所属项目" prop="projectName" required>
          <el-select placeholder="请选择所属项目" v-model="ruleForm.projectName">
            <el-option label="商家后台" value="商家后台"></el-option>
            <el-option label="管理后台" value="管理后台"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="flex-start">
        <el-form-item label="版本号" prop="version">
          <el-input v-model="ruleForm.version"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="userid" required>
          <el-select placeholder="请选择负责人" v-model="ruleForm.userid">
            <el-option :key="index" :label="item.username" :value="item._id" v-for="(item,index) in dialogData.userlist"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="时间规划" prop="date">
        <el-date-picker
          :default-time="['8:30:00', '18:00:00']"
          align="right"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="datetimerange"
          v-model="ruleForm.date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="个人备注" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm('ruleForm')" type="primary">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>


<script>
export default {
  props: { dialogData: Object },
  inject: ['reload'],
  data() {
    return {
      ruleForm: {
        userid: '',
        detail: '',
        desc: '',
        version: '',
        endTime: '',
        projectName: '',
        date: ''
      },
      rules: {
        detail: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        date: [
          {
            type: 'array',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ],
        userid: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ],
        projectName: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    userinfo() {
      return this.$store.getters['unionManageToolStore/userInfo']
    }
  },
  methods: {
    // 点击关闭模态框
    closeDialog() {
      this.dialogData.showDialog = false
      this.$emit('closeDialog')
      this.$refs['ruleForm'].resetFields()
    },
    // 提交表单
    async submitForm(formName) {
      let _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.createName = this.userinfo.name
          this.ruleForm.userid = this.ruleForm.userid
          this.ruleForm.createId = this.userinfo._id
          this.ruleForm.createTime = this.ruleForm.date[0].getTime() / 1000
          this.ruleForm.planTime = this.ruleForm.date[1].getTime() / 1000
          if (_this.ruleForm.editid) {
            // 编辑任务
            _this.$api.editDiary(this.ruleForm).then(res => {
              _this.dialogData.showDialog = false
              _this.reload()
            })
          } else {
            // 新增任务
            _this.$api.postDiary(this.ruleForm).then(res => {
              _this.dialogData.showDialog = false
              _this.reload()
            })
          }
        } else {
          return false
        }
      })
    },
    // 获取编辑数据信息
    getEditDiaryInfo(data) {
      this.ruleForm.detail = data.detail
      this.ruleForm.desc = data.desc
      this.ruleForm.version = data.version
      this.ruleForm.projectName = data.projectName
      this.ruleForm.editid = data.editid
    },
    // 重置数据
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
