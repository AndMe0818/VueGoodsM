<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar-box">
        <img src="../../assets/img/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      // 双向绑定表单对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    resetLoginForm() {
      this.$refs.loginForm.resetFields();
    },
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return;
        // 调用网络请求
        this.$http({
          method: "post",
          url: "/login",
          params: this.loginForm,
        }).then((res) => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.warning("登录失败请检查后登录");
          }
          this.$message.success("登陆成功");
          // 1.登录成功后 服务器返回了一个token  保存在客户端的sessionstoryage中
                // 1.1 项目中除了登录意外的其他api接口 都必须在登录之后才能访问
                // 1.2 token 只又在当前网站打开期间才生效，所以才储存在 sessionstorage中
          // 2.通过路由拦截完成
          window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home')
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #42678d;
}
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;

  background-color: #fff;
}
.avatar-box {
  position: absolute;
  // top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 130px;
  width: 130px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login-form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0 10px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style> 

