<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card></el-card>

    <!-- 按钮 -->
    <el-button></el-button>

    <!-- el - row布局 -->
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

    <!-- 弹出框 -->
    <el-dialog
      title="弹出框"
      :visible.sync="DialogVisible"
      width="50%"
      @close="DialogClosed"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- form -->
    <el-form
      :model="Form"
      :rules="FormRules"
      ref="FormRef"
      label-width="100px"
    >
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input></el-input>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table>
      <el-table-column type="index"></el-table-column>
      <el-table-column label=""></el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>
<style scoped>
</style>