<template>
  <div class="login-register">
    <div class="register" v-show="!isShow">
      <!-- label-position="left" label-width="80px" -->
      <el-form class="user-input" ref="form">
        <h2 class="title">登录</h2>
        <div class="password-input">
          <el-input class="username" placeholder="请输入账号" v-model="registerUserName"></el-input>
        </div>
        <div class="password-input">
          <el-input class="password" placeholder="请输入密码" show-password v-model="registerPassword"></el-input>
        </div>
        <div class="register-btn">
          <el-button @click="submit" type="primary">立即登录</el-button>
        </div>
        <div class="prompt-box">
          没有账号？
          <span @click="cutLogin" class="clickable" style="cursor:pointer">注册</span>
          <a class="right clickable">忘记密码</a>
        </div>
      </el-form>
    </div>
    <div class="register" v-show="isShow">
      <h2 class="title">注册</h2>
      <el-form>
        <div class="user-input">
          <el-input placeholder="请输入用户名" v-model="registerUserName"></el-input>
        </div>
        <div class="password-input">
          <el-input placeholder="请输入密码" show-password v-model="registerPassword"></el-input>
        </div>
        <div class="password-input">
          <el-input placeholder="请确认密码" show-password v-model="affirmPassword"></el-input>
        </div>
        <div class="register-btn">
          <el-button @click="registerUser" type="primary">注册</el-button>
        </div>
      </el-form>
      <div class="own-login">
        <span @click="cutLogin" style="cursor:pointer">已有账号</span>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { Message } from 'element-ui'
export default {
  props: {},
  name: 'Login',
  data() {
    return {
      registerUserName: '',
      registerPassword: '',
      affirmPassword: '',
      user: '',
      isShow: false,
      value7: '',
      value: ''
    }
  },
  computed: {},
  created() {},
  mounted() {
    // this.userRegister()
  },
  watch: {},
  methods: {
    cutLogin() {
      this.isShow = !this.isShow
    },
    async submit() {
      let data = {
        registerUserName: this.registerUserName,
        registerPassword: md5(this.registerPassword)
      }
      let res = await this.$api.userLogin(data)
      if (res.data.success) {
        Message.success({
          message: '登录成功'
        })
        this.$store.commit('unionManageToolStore/userInfo', res.data.data)
        this.$router.push('home')
      }
    },
    /* 注册 */
    /* 注册用户 */
    async registerUser() {
      /* 校验密码 */
      if (!this.registerPassword && !this.affirmPassword) {
        alert('请输入密码')
      } else if (!Object.is(this.registerPassword, this.affirmPassword)) {
        alert('密码不一致')
      }
      let data = {
        registerUserName: this.registerUserName,
        registerPassword: md5(this.registerPassword)
      }
      let res = await this.$api.userRegister(data)
      if (res.data && res.data.success) {
        Message.success({
          message: '注册成功'
        })
        this.$store.commit('unionManageToolStore/userInfo', res.data.data)
        this.submit()
      }
    }
  },
  components: {}
}
</script>

