<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button @click="addRoleVisible = true" type="primary"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" />
        <!-- 索引列 -->
        <el-table-column type="index" label="#" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleDesc" label="角色描述" />
        <el-table-column label="操作">
          <template v-slot="scoped">
            <el-button
              @click="editRole(scoped.row.id)"
              type="primary"
              icon="el-icon-edit"
              >编辑</el-button
            >

            <el-button
              @click="removeRole(scoped.row.id)"
              type="danger"
              icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              @click="assigningRoles"
              type="warning"
              icon="el-icon-search"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹框处 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewRole"> 确 定 </el-button>
      </span>
    </el-dialog>
    <!-- 修改角色弹框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleVisible"
      width="50%"
      @close="editRoleDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editRoleForm"
        :rules="addRoleRules"
        ref="editRoleRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 所有角色的列表数据
      roleList: [],
      //  添加角色 提示框
      addRoleVisible: false,
      // 添加角色 数据对象
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      //   显示编辑数据
      editRoleVisible: false,
      editRoleForm: {
        roleName: '',
        roleDesc: '',
        roleid: '',
      },
      addRoleRules: {
        roleName: [],
        roleDesc: [],
      },
    }
  },
  created() {
    this.getRolesLit()
  },
  methods: {
    //   获取所有角色的列表
    getRolesLit() {
      this.$http({ url: '/roles' }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }

        this.roleList = res.data
        console.log(this.roleList)
        return this.$message.success('获取角色列表成功')
      })
    },
    // 添加 新角色
    addNewRole() {
      console.log(this.addRoleForm)
      this.$http({
        method: 'post',
        url: '/roles',
        data: this.addRoleForm,
      }).then((res) => {
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addRoleVisible = false
        this.getRolesLit()
      })
    },
    // 关闭提示框后
    addRoleDialogClosed() {
      this.$refs.addRoleRef.resetFields()
    },
    // 编辑 角色
    editRole(id) {
      this.$http({ url: '/roles/' + id }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('未查询到该角色')
        }
        const { roleDesc, roleId, roleName } = res.data
        this.editRoleForm = { roleDesc, roleId, roleName }
        this.editRoleVisible = true
      })
    },
    // 提交修改
    editRoleInfo() {
      // 本地校验
      this.$refs.editRoleRef.validate((valid) => {
        if (!valid) return this.$message.error('请输入正确格式的角色信息')
        this.$http({
          url: '/roles/' + this.editRoleForm.roleId,
          method: 'put',
          data: this.editRoleForm,
        }).then((res) => {
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error('修改失败')
          this.editRoleVisible = false
          this.getRolesLit()
          this.$message.success('修改角色成功')
        })
      })
    },
    // 编辑对话框关闭
    editRoleDialogClosed() {
      this.$refs.editRoleRef.resetFields()
    },
    removeRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(()=>{
        //   用户点击确定 删除
        this.$http({url:'/roles/'+id,method:'delete'}).then(res=>{
            console.log(res);
            if(res.meta.status !==200) return this.$message.error('删除失败')
            this.$message.success('删除用户成功')
            this.getRolesLit()
        })
      }).catch(()=>{
          this.$message.info('已取消删除')
      })

    },
    assigningRoles() {},
  },
}
</script>
<style scoped>
</style>