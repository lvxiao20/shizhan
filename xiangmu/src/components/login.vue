<template>
  <div class="login_con">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :label-position="labelPosition"
        :model="formLabelAlign"
        :rules="rules"
        ref="ruleForm"
      >
        <!-- 用户名 -->
        <el-form-item prop="name">
          <el-input
            v-model="formLabelAlign.name"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入你的名称"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="region">
          <el-input
            v-model="formLabelAlign.region"
            prefix-icon="iconfont icon-suo"
            placeholder="请输入你的密码"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <div class="denglu">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
          <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "admin",
        region: "123456",
        type: "",
       
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "blur",
          },
        ],
        region: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 登录
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            showClose: true,
            message: `恭喜你，亲爱的${this.formLabelAlign.name}登陆成功`,
            type: "success",
          });
          this.axios
            .post("http://127.0.0.1:8888/api/private/v1/login", {
              username: "admin",
              password: "123456",
            })
            .then((res) => {
              console.log(res.data);
              window.sessionStorage.setItem('token',res.data.data.token)
              this.$router.push('/home')
            });
        } else {
          console.log("登录失败");
          this.$message({
            showClose: true,
            message: "错了哦,仔细检查一下",
            type: "error",
          });

          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login_con {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  .denglu {
    display: flex;
    justify-content: flex-end;
  }
}
.el-form {
  position: absolute;
  bottom: 10px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>