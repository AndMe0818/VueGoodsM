<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        :closable="false"
        title="注意：只允许为三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的选择框 -->
          <el-cascader
            :props="cateProps"
            v-model="selectedKeys"
            :options="cateList"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!--tab 页签区域  -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table border stripe :data="manyTabData">
            <!-- 展开-->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  @close="handleClose(index, scope.row)"
                  :closable="true"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入框 标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name" />
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 编辑 -->
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <!-- 删除 -->
                <el-button
                  @click="removeParams(scope.row.attr_id)"
                  type="anger"
                  size="mini"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性页签 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态属性按钮 -->
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >

          <!--静态参数表格 -->
          <el-table border :data="onlyTabData">
            <!-- 展开-->
            <el-table-column type="expand">
              <!-- 展开-->
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag
                    @close="handleClose(index, scope.row)"
                    :closable="true"
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="index"
                  >
                    {{ item }}
                  </el-tag>
                  <!-- 输入框 标签 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInputRef"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name" />
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button
                  @click="removeParams(scope.row.attr_id)"
                  type="anger"
                  size="mini"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数 弹出框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addParams" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改参数 弹出框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 修改参数表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button @click="editParams" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 商品分类列表数据对象
      cateList: [],
      // 选择框的配置对象
      cateProps: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name',
      },
      // 级联选择框选中项
      selectedKeys: [],
      //   tab 标签页 的名称
      activeName: 'many',
      //   动态参数数据
      manyTabData: [],
      //   静态属性的数据
      onlyTabData: [],
      //   弹出框
      addDialogVisible: false,
      //   添加参数表单数据对象
      addForm: {
        attr_name: '',
      },
      //   表单验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      //  edit 对话框弹出控件
      editDialogVisible: false,
      // 修改表单数据对象
      editForm: {},
      // 编辑表单 的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    //   控制按钮是否无效
    isBtnDisabled() {
      // 如果 没有选择3级 则说明需要被禁用
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取id
    cateId() {
      // 如果选中 三级 则返回最后一项 即为其 id
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // tab 页签 的名称
    titleText() {
      if (this.activeName === 'many') {
        return '动态属性'
      }
      return '静态属性'
    },
  },
  methods: {
    //   获取所有的商品分类列表
    getCateList() {
      this.$http({ url: '/categories' }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类列表失败')
        }
        this.cateList = res.data
      })
    },
    // 级联选择框 选中项变化时触发
    handleChange() {
      this.getParamsData()
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTabData = []
        this.onlyTabData = []
      }
    },
    // tab 页签 点击事件处理函数
    handleClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数 数据
    getParamsData() {
      // 如果选中的不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        return
      }
      //   没有返回 即 选中三级
      this.$http({
        url: '/categories/' + this.cateId + '/attributes',
        params: {
          sel: this.activeName,
        },
      }).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败')
        }

        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          // 控制文本框的显示与隐藏
          /*
            将文本框的显示隐藏，文本框内容的属性绑定在数据对象上
          */
          item.inputVisible = false
          item.value = ''
        })
        console.log(res.data)
        if (this.activeName === 'many') {
          this.manyTabData = res.data
        } else {
          this.onlyTabData = res.data
        }
      })
    },
    // 添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交表单
    addParams() {
      this.$refs.addFormRef.validate((vaild) => {
        if (!vaild) return
        this.$http({
          url: '/categories/' + this.cateId + '/attributes',
          method: 'post',
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          },
        }).then((res) => {
          console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error('添加参数失败')
          }
          this.$message.success('添加参数成功')
          this.getParamsData()
          this.addDialogVisible = false
        })
      })
    },
    // 点击按钮 展示修改对话框
    showEditDialog(attr_id) {
      //  查询当前参数的信息
      this.$http({
        url: 'categories/' + this.cateId + '/attributes/' + attr_id,
        params: { attr_sel: this.activeName },
      }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数信息失败')
        }
        this.editForm = res.data
      })
      this.editDialogVisible = true
    },
    // 编辑框 关闭触发
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定 提交修改
    editParams() {
      this.$refs.editFormRef.validate((vaild) => {
        if (!vaild) return
        this.$http({
          url:
            '/categories/' +
            this.cateId +
            '/attributes/' +
            this.editForm.attr_id,
          method: 'put',
          data: {
            attr_name: this.editForm.attr_name,
            attr_sel: this.editForm.attr_sel,
          },
        }).then((res) => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('修改参数失败')
          }
          this.$message.success('修改参数成功')
          this.getParamsData()
          this.editDialogVisible = false
        })
      })
    },
    // 删除按钮 根据 id删除对应的参数项
    removeParams(attr_id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        // 点击确定删除
        .then(() => {
          this.$http({
            url: 'categories/' + this.cateId + '/attributes/' + attr_id,
            method: 'delete',
          }).then((res) => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getParamsData()
          })
        })
        // 点击取消删除
        .catch(() => {
          this.$message('取消删除')
        })
    },
    // 网络请求 提交修改属性
    saveAttrVals(row) {
      // 发起请求保存 数据
      this.$http({
        url: 'categories/' + this.cateId + '/attributes/' + row.attr_id,
        method: 'put',
        data: {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(','),
        },
      }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
      })
    },

    // 点击 +标签 显示输入框
    showInput(row) {
      row.inputVisible = true
      //  让文本框 自动获得焦点
      // $nextTick() 当页面上的元素重新渲染后 才执行
      this.$nextTick(() => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },
    // 文本框 失去焦点 或 按下enter键
    handleInputConfirm(row) {
      // 如果用户没有输入内容
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //  如果用户输入了内容
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 点击 删除 tag
    //  i为k绑定参数  row 为行参数
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
  },
}
</script>

<style  lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
</style> 