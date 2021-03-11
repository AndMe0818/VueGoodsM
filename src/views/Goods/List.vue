<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 顶部搜索区 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            clearable
            @clear="getGoodsList"
            placeholder="请输入内容"
            v-model="queryInfo.query"
          >
            <el-button
              @click="getGoodsList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 搜索按钮 -->
        <el-col :span="4">
          <el-button @click="goAddPage" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" />
        <el-table-column label="商品价格" prop="goods_price" width="95px" />
        <el-table-column label="商品重量" prop="goods_weight" width="90px" />
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" />
            <el-button
              @click="removeById(scope.row.goods_id)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
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
      // 数据对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //   商品列表数据
      goodsList: [],
      //   总数
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //   根据分页获取商品列表
    getGoodsList() {
      this.$http({ url: '/goods', params: this.queryInfo }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败')
        }
        this.$message.success('获取商品列表成功')
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    // 触发 分页函数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    //当前页码发生变化
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 删除
    removeById(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        // 点击确认
        .then(() => {
          this.$http({ url: '/goods/' + id, method: 'delete' }).then((res) => {
            console.log(res)
            if(res.meta.status !==200){
              return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
          })
        })

        .catch(() => {
          this.$message('取消删除')
        })
    },
    // 点击添加 跳转 
    goAddPage(){
      this.$router.push('/goods/add')
    },
  },
}
</script>
<style scoped>
</style>