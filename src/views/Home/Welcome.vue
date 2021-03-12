<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎使用管理系统</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-calendar v-model="value"></el-calendar>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  create() {},
  methods: {},
}
</script>
<style scoped>
.el-calendar{
  width: 70%;
  margin: 0 auto;
}
</style>