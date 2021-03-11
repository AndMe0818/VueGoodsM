<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 顶部搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-table :data="orderList" border stripe>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="order_number" label="订单编号" />
          <el-table-column prop="order_price" label="订单价格" width="150" />
          <el-table-column prop="order_pay" label="是否付款" width="110">
            <template v-slot="scoped">
              <el-tag v-if="scoped.row.pay_status === '1'" type="success"
                >已付款</el-tag
              >
              <el-tag v-else type="danger">未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" width="110" />
          <el-table-column prop="create_time" label="下单时间">
            <template v-slot="scoped">
              {{ scoped.row.create_time | dateFormat }}
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showBox"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                icon="el-icon-location"
                @click="showProgressBox"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      @close="addressDialogClose"
      width="50%"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流精度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      @close="progressDialogClosed"
    >
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../../utils/citydata.js'

export default {
  components: {},
  data() {
    return {
      // 请求订单列表参数对象
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
      },
      // 数据总数
      total: 0,
      // 订单参数存放
      orderList: [],
      // 修改地址对话框
      addressVisible: false,
      // 修改地址的 表单对象
      addressForm: {
        address1: [],
        address2: '',
      },
      // 验证规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市县区', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      // 城市数据
      cityData,
      // 定位 物流定位对话框 控制
      progressVisible: false,
      // 定位数据对象
      progressInfo: [],
    }
  },
  created() {
    this.getorderList()
  },
  methods: {
    // 获取商品列表
    getorderList() {
      this.$http({ url: '/orders', params: this.queryInfo }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取订单列表失败')
        }
        this.total = res.data.total
        this.orderList = res.data.goods
      })
    },
    // 展示数发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getorderList()
    },
    // 页码发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getorderList()
    },
    // 点击 修改订单地址
    showBox() {
      this.addressVisible = true
    },
    handleChange() {},
    // 对话框关闭 清空数据
    addressDialogClose() {
      this.$refs.addressFormRef.resetFields()
    },
    // 点击定位展示物流进度
    showProgressBox() {
      this.progressVisible = true
      this.$http('https://biz.trace.ickd.cn/auto/777031139159068').then(
        (res) => {
          console.log(res)
          this.progressInfo = res.data
          console.log(this.progressInfo)
        }
      )
    },
    // 定位对话框 关闭
    progressDialogClosed() {},
  },
}
</script>
<style scoped>
.el-cascader {
  width: 100%;
}
</style>