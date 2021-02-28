<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="authName" label="权限名称" />
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="level" label="权限等级">
            <template v-slot="scoped">
                <el-tag v-if="scoped.row.level==='0'" >一级</el-tag>
                <el-tag v-if="scoped.row.level==='1'" type="success">二级</el-tag>
                <el-tag v-if="scoped.row.level==='2'" type="warning">三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      rightList: [],
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    getRightList() {
      this.$http({ url: '/rights/list' }).then((res) => {
        console.log(res)
        this.rightList = res.data
      })
    },
  },
}
</script>
<style lang="lass" scoped>
</style>