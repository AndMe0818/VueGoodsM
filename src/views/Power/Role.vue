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
        <el-table-column type="expand">
          <template v-slot="scoped">
            <el-row
              :class="['bdbottom', 'vcenter', i1 == 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scoped.row.children"
              :key="i1"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scoped.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <!-- for循环渲染 二级权限 -->
                <el-row
                  :class="['bdbottom', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="i2"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scoped.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                      @close="removeRightById(scoped.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleDesc" label="角色描述" />
        <!-- 操作列 -->
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
              @click="showSetRightDialong(scoped.row)"
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
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配角色权限"
      @closed="setRightDialogClosed"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        default-expand-all
        :default-checked-keys="defkeys"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button @click="allotRights" type="primary">确 定</el-button>
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
      // 分配角色权限 对话框
      setRightDialogVisible: false,
      // 所以权限的数据
      rightsList: [],
      // 树形控件
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认勾选中的节点数组
      defkeys: [],
      // 当前所操控的 角色 id
      roleId: '',
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
    // 删除角色
    removeRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          //   用户点击确定 删除
          this.$http({ url: '/roles/' + id, method: 'delete' }).then((res) => {
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除用户成功')
            this.getRolesLit()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },

    // 根据id删除权限
    removeRightById(role, rightid) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          // 确定删除
          this.$http({
            method: 'delete',
            url: '/roles/' + role.id + '/rights/' + rightid,
          }).then((res) => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$$message.error('删除角色权限失败')
            }
            role.children = res.data
            this.$message.success('删除权限成功')
          })
        })
        .catch(() => {
          return this.$message('取消删除')
        })
    },
    // 展示分配权限的对话框
    showSetRightDialong(role) {
      this.roleId = role.id
      // 获取角色  所有 权限数据
      this.$http({ url: '/rights/tree' }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败')
        }
        this.rightsList = res.data
      })
      this.setRightDialogVisible = true
      this.getLeafKeys(role, this.defkeys)
    },
    // 获取到角色 所拥有的权限
    /*通过递归的形式 获取角色所拥有的所有三级权限 */
    getLeafKeys(node, arr) {
      // 如果当前 node节点 不包含children属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限的关闭事件
    setRightDialogClosed() {
      this.defkeys = []
    },
    // 点击为角色分配权限
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      console.log(keys)
      const idStr = keys.join(',')
      this.$http({
        url: '/roles/' + this.roleId + '/rights',
        method: 'post',
        data: { rids: idStr },
      }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功')
        this.getRolesLit()
        this.setRightDialogVisible = false
      })
    },
  },
}
</script>
<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>