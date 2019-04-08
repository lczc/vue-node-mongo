<style lang="scss" scoped>
div {
  text-align: center;
  width: 500px;
  margin: 0 auto;
}
</style>
<template>
  <el-aside style="background-color: rgb(238, 241, 246)" width="200px">
    <el-header>多粉星球组工作记录</el-header>
    <el-menu :default-openeds="['1', '3']">
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">工作日志</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'template',
      src: require('@/assets/img/demo/demo.jpg'),
      input: ''
    }
  },
  computed: {},
  created() {},
  mounted() {
    // this.$store.dispatch('demo/getDemo').then(res => {})
    // let dd = 'sdfd'
  },
  methods: {
    test() {}
  }
}
</script>
