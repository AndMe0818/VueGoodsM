<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" />
      <!--步骤条区  -->
      <el-steps
        align-center
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 步骤区域完结 -->

      <!-- tab栏区域 -->
      <el-form
        label-position="top"
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="100px"
      >
        <!-- tab 区域 -->
        <el-tabs
          @tab-click="tabClicked"
          :before-leave="beforeTabLeave"
          v-model="activeIndex"
          tab-position="left"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 表单 input 区域 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :props="cateProps"
                v-model="addForm.goods_cat"
                :options="catelist"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片要上传的后台地址  upload -->
            <el-upload
              :action="upLoadUrl"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handelSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
              v-model="addForm.goods_introduce"
              ref="myQuillEditor"
            />
            <!-- 添加商品 -->
            <el-button @click="add" type="primary" class="btnAdd"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览弹框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImage" />
    </el-dialog>
  </div>
</template>

<script>
import { deepCloneFnc } from '../../utils/utils.js'
export default {
  // 引入工具函数

  components: {},
  data() {
    return {
      // 步骤条激活控件
      activeIndex: '0',
      //   添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品详情 富文本
        goods_introduce: '',
        // 参数列表
        attrs: [],
      },
      //   表单数据对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      //   商品分类列表
      catelist: [],
      // 级联选择器的配置对象
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 动态参数列表
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 上传图片地址
      upLoadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 预览图片路径
      previewPath: '',
      // 预览图片弹框控制
      previewVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
    getToken() {
      return { Authorization: window.sessionStorage.getItem('token') }
    },
  },
  methods: {
    // 获取商品分类列表
    getCateList() {
      this.$http({ url: '/categories' }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.catelist = res.data
      })
    },
    // 级联选择器变化 选择了商品分类后 触发事件
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 当标签切换时
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // tabclicked tab点击事件
    tabClicked() {
      console.log(this.activeIndex)
      // 当访问的是 动态参数面板
      if (this.activeIndex === '1') {
        this.$http({
          url: '/categories/' + this.cateId + '/attributes',
          params: { sel: 'many' },
        }).then((res) => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('获取参数列表失败')
          }
          res.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? '' : item.attr_vals.split(',')
          })
          this.manyTableData = res.data
        })
      } else if (this.activeIndex === '2') {
        this.$http({
          url: '/categories/' + this.cateId + '/attributes',
          params: { sel: 'only' },
        }).then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取参数列表失败')
          }
          this.onlyTableData = res.data
          console.log(this.onlyTableData)
        })
      }
    },
    // 移除图片时触发
    handleRemove(file) {
      //   1.获取将要删除的零食路径
      const filePath = file.response.data.tmp_path
      //  2.从pics数组中找到这个图片对应索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath)
      // 3.调用 数组 splice 方法 把图片信息对象重 pics数组中删除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 处理预览图片的函数
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 上传成功后触发
    handelSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 点击上传商品
    add() {
      // console.log(this.addForm)
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的业务逻辑
        // 调用 封装函数

        const form = deepCloneFnc(this.addForm)
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(','),
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)
        console.log(this.addForm)
        // 发起请求 添加商品
        // 商品名称 必须唯一
        this.$http({ url: '/goods', method: 'post', data: form }).then(
          (res) => {
            console.log(res)
            if(res.meta.status !==201){
              return this.$message.error('添加商品失败')
            }
            this.$message.success('添加商品成功')
            this.$router.push('/goods')
          }
        )
      })
    },
  },
}
</script>
<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImage {
  width: 100%;
}
.btnAdd {
  margin-top: 10px;
}
</style>