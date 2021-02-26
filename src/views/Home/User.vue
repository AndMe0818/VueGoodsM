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
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
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
            <el-switch
              v-model="slotprop.row.mg_state"
              @change="userStateChange(slotprop.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 修改 -->
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            content="修改"
            placement="top"
          >
            <el-button type="primary" icon="el-icon-edit" size="mini" />
          </el-tooltip>
          <!-- 删除 -->
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            content="删除"
            placement="top"
          >
            <el-button type="danger" icon="el-icon-delete" size="mini" />
          </el-tooltip>
          <!-- 分配角色 -->
          <el-tooltip
            :enterable="false"
            class="item"
            effect="dark"
            content="分配角色"
            placement="top"
          >
            <el-button type="warning" icon="el-icon-setting" size="mini" />
          </el-tooltip>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
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
        // 当前页数
        pagenum: 1,
        // 每页数据个数
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
    // 监听pagesize 改变事件
    handleSizeChange(newSize) {
      console.log(newSize)
      console.log('pagesize改变')
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码
    handleCurrentChange(newPage) {
      console.log(newPage)
      console.log('页码改变')
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 状态改变
    userStateChange(userinfo) {
      console.log(userinfo)
      this.$http({
        method: 'put',
        url: `/users/${userinfo.id}/state/${userinfo.mg_state}`,
      }).then((res) => {
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error(res.meta.msg)
        }
        return this.$message.success(res.meta.msg)
        console.log(res)
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
.el-pagination {
  margin-top: 15px;
}
</style>