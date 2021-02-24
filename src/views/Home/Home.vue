<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../../assets/img/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width=" isToggle ?  '64px' : '200px' ">
        <!-- 折叠展开区 -->
        <div class="toggle-button" @click="toogleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          :collapse ="isToggle"
          :collapse-transition ="false"
          :unique-opened="true"
          background-color="#353d55"
          text-color="#fff"
          active-text-color="#ffd04b"
          v-if="menulist"
        >
          <!-- 1级菜单区 -->
          <el-submenu
            :index="item.id + ''"
            v-for="(item, index) in menulist"
            :key="index"
          >
            <!-- 1级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 2级菜单 -->
            <el-menu-item
              :index="children.id + ''"
              v-for="(children, indez) in item.children"
              :key="indez"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ children.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menulist: [], //组件菜单数据
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao', 
      },
      isToggle:false,
    }
  },
  created() {
    this.getMenuList()
  },
  mounted() {},
  methods: {
    // 退出
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取 menu列表
    getMenuList() {
      this.$http({ url: '/menus' }).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data
      })
    },
    // 折叠收起菜单
    toogleCollapse(){
      this.isToggle = !this.isToggle
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #3e4f5a;
  display: flex;

  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding-left: 0;
  > div {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    img {
      height: 60px;
      background-color: rgb(71, 83, 107);
      border-radius: 50%;
      border: 1px solid #6b60b0;
      vertical-align: middle;
      margin-right: 20px;
    }
  }
}
.el-aside {
  background-color: #353d55;
  .el-menu{
    border: none;
   }
}
.iconfont{
  margin-right: 10px ;
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button{
  background-color:#525f86;
  color: #fff;
  text-align: center;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>