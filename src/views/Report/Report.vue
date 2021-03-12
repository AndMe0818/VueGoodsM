<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 2,为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入 echarts
import * as echarts from 'echarts'
// 导入工具函数 合并对象
import {mergeObjectFnc} from '../../utils/utils'
export default {
  components: {},
  data() {
    return {
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
      reportData: {},
    }
  },
  created() {},
  mounted() {
    //   mounted 页面的 dom 元素 渲染完毕
    //  3， 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 4.   指定图表的配置项和数据

    // 5.展示数据
    // 使用刚指定的配置项和数据显示图表。
    this.$http({ url: '/reports/type/1' }).then((res) => {
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取报表数据失败')
      }
      this.reportData = res.data

      myChart.setOption(mergeObjectFnc(res.data,this.options))
    })
  },
  methods: {},
}
</script>
<style scoped>
</style>