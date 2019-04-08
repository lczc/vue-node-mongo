<template>
  <el-aside style="background-color: rgb(238, 241, 246)" width="200px">
    <el-header></el-header>
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
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
