<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        border
        :expand-type="false"
        :selection-type="false"
        show-index
        index-text="#"
      >
        <!-- 是否有效模板 -->
        <template v-slot:isok="scoped">
          <i
            v-if="scoped.row.cat_deleted === false"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="slot">
          <el-button
            @click="showEditCateDialog(slot.row)"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            @click="removeCate(slot.row.cat_id)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            @change="parentCateChanged"
            :props="cascaderProps"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出  编辑对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 数据列表
      catelist: [],
      //   默认请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //  总数
      total: 0,
      //   为表格 定义列参数
      columns: [
        {
          //列表标题
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 使用 表示当前列使用模板
          type: 'template',
          // 表示当前列的模板名称
          template: 'isok',
        },
        {
          label: '排序',
          // 使用 表示当前列使用模板
          type: 'template',
          // 表示当前列的模板名称
          template: 'order',
        },
        {
          label: '操作',
          // 使用 表示当前列使用模板
          type: 'template',
          // 表示当前列的模板名称
          template: 'opt',
        },
      ],
      // 控制添加分类对话框显示
      addCateDialogVisible: false,
      // 添加分类表单数据对象
      addCateForm: {
        // 父级分类id
        cat_pid: 0,
        // 分类名称
        cat_name: '',
        // 分类层级 默认1级分类
        cat_level: 0,
      },
      // 验证表单规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器 配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 被选中项 父级分类id
      selectedKeys: [],
      // 编辑 分类 数据对象
      editCateForm: {},
      // 编辑提示框 弹出
      editCateDialogVisible: false,
      // 编辑 表单 验证
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
    console.log(this.list)
  },
  methods: {
    // 获取列表
    getCateList() {
      this.$http({ url: '/categories', params: this.queryInfo }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.catelist = res.data.result
        this.total = res.data.total
      })
    },
    // 监听 pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听页码发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮 添加分类
    showAddCateDialog() {
      // 先获取赋值分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级列表数据
    getParentCateList() {
      this.$http({ url: '/categories', params: { type: 2 } }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('请求父级分类列表失败')
        }
        this.parentCateList = res.data
      })
    },
    // 点击选择
    parentCateChanged() {
      console.log(this.selectedKeys)
      //当 有选择后 selectedKeys 有长度
      if (this.selectedKeys.length > 0) {
        // 父级分类id 赋值
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        //为当前  分类等级 赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类id
        this.addCateForm.cat_pid = 0
        // 当前分类等级
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定 添加
    addCate() {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate((vaild) => {
        if (!vaild) return
        this.$http({
          url: '/categories',
          method: 'post',
          data: this.addCateForm,
        }).then((res) => {
          console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功')
          this.getCateList()
          this.addCateDialogVisible = false
        })
      })
    },
    // 监听对话框的 关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 点击编辑 按钮 弹出对话框
    showEditCateDialog(item) {
      this.editCateForm = item
      this.editCateDialogVisible = true
    },
    // 点击编辑中的确定 提交
    editCate() {
      console.log(this.editCateForm)
      this.$http({
        url: '/categories/' + this.editCateForm.cat_id,
        method: 'put',
        data: { cat_name: this.editCateForm.cat_name },
      }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    // 监听 编辑对话框关闭事件
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    removeCate(id) {
      this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({ url: '/categories/' + id, method: 'delete' }).then(
            (res) => {
              if (res.meta.status !== 200) {
                return this.$message.error('取消失败')
              }
              this.$message.success('删除成功')
              this.getCateList()
            }
          )
        })
        .catch(() => {
          this.$message('取消删除')
        })
    },
  },
}
</script>
<style scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>