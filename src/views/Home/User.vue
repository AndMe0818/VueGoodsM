<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱地址" />
        <el-table-column prop="mobile" label="电话号码" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="slotprop">
            <el-switch v-model="slotprop.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
    }
  },
  created() {
    console.log(this.queryInfo)
    this.getUserList()
  },

  methods: {
    getUserList() {
      this.$http({ url: '/users', params: this.queryInfo }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败')
        }
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
  },
}
</script>
<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 15px;
}
</style>