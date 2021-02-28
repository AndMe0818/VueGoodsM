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
      <!-- 搜索框 区域 -->
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
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
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
        <!-- 操作栏 -->
        <el-table-column label="操作">
          <template v-slot="slotscope">
            <!-- 修改 -->
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="修改"
              placement="top"
            >
              <el-button
                @click="showEditDialog(slotscope.row.id)"
                type="primary"
                icon="el-icon-edit"
                size="mini"
              />
            </el-tooltip>
            <!-- 删除 -->
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                @click="removeUserByID(slotscope.row.id)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              />
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
          </template>
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
      <!--添加用户的 弹出提示框 -->
      <el-dialog
        title="添加用户"
        @close="addDialogClosed"
        :visible.sync="addDialogVisible"
        width="50%"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser"> 确 定 </el-button>
        </span>
      </el-dialog>
      <!-- 修改用户的 弹出提示框 -->
      <el-dialog
        title="修改用户"
        @close="editDialogClosed"
        :visible.sync="editDialogVisible"
        width="50%"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo"> 确 定 </el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        // 合法手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 用户数据列表的 参数对象
      queryInfo: {
        // 根据query查询
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页数据个数
        pagesize: 2,
      },
      //存储 获取到的用户对象
      userList: [],
      // 用户总数据
      total: 0,
      // 添加用户的对话提示框的显示或隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户 表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '用户名长度在 3 到 5 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 修改用户 表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 用户编辑对话框 显影参数
      editDialogVisible: false,
      // 用户编辑 表单参数
      editForm: {},
    }
  },
  created() {
    // console.log(this.queryInfo)
    this.getUserList()
  },

  methods: {
    // 获取用户数据列表
    getUserList() {
      this.$http({ url: '/users', params: this.queryInfo }).then((res) => {
        // console.log(res)
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
      // console.log(userinfo)
      this.$http({
        method: 'put',
        url: `/users/${userinfo.id}/state/${userinfo.mg_state}`,
      }).then((res) => {
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error(res.meta.msg)
        }
        return this.$message.success(res.meta.msg)
      })
    },
    // 监听 添加用户对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate((vaild) => {
        if (!vaild) return
        //  预验证成功 发起网络请求
        this.$http({
          method: 'post',
          url: 'users',
          data: this.addForm,
        }).then((res) => {
          if (res.mata.status !== 201) {
            this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户失败')
          this.addDialogVisible = false
          // 重新获取用户列表数据
          this.getUserList()
        })
      })
    },
    // 展示编辑用户对话框
    showEditDialog(id) {
      this.$http({ url: '/users/' + id }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失败')
        }
        this.editForm = res.data
        // console.log(this.editForm)
        this.editDialogVisible = true
      })
    },
    // 关闭用户编辑框
    editDialogClosed() {
      this.$refs.editFormRef.clearValidate()
    },
    // 提交 修改用户表单
    editUserInfo() {
      this.$refs.editFormRef.validate((vaild) => {
        if (!vaild) return this.$message.error('请输入正确格式信息')
        this.$http({
          method: 'put',
          url: '/users/' + this.editForm.id,
          data: {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          },
        }).then((res) => {
          
          if (res.meta.status !== 200) {
            return this.$message.error('更新用户信息失败')
          }
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新数据
          this.getUserList()
          this.$message.success('修改用户信息成功')
        })
      })
    },
    // 删除操作

    removeUserByID(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          // 捕捉到 用户点击 确定删除  res为 confirm
          this.$http({ method: 'delete', url: '/users/' + id }).then((res) => {
            console.log(res)
            if(res.meta.status !==200){
              return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            this.getUserList()
            
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
          
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