<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 頭像區域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登錄表單區域 -->
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0px" class="login_form">
          <!-- 用戶名 -->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <!-- 密碼 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
          </el-form-item>
          <!-- 按鈕 -->
          <el-form-item>
              <div class="btns">
                <el-button type="primary"  @click="loginValidate">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
              </div>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  data () {
    return {
      // 這是登錄表單的數據綁定對象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表單的驗證規則對象
      loginFormRules: {
        // 驗證用戶名
        username: [
          { required: true, message: '请输入登錄名稱', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // 驗證密碼
        password: [
          { required: true, message: '请输入密碼', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 點擊重置按鈕，重置登錄表單
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 點擊登錄按鈕，驗證表單數據
    loginValidate () {
      this.$refs.loginFormRef.validate(async valid => {
        // 如果表单域验证成功，valid为true
        if (!valid) return
        const { data: res } = await this.$axios.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          ElMessage.warning({
            message: '登录失败',
            type: 'warning'
          })
          return
        }
        ElMessage.success({
          message: '登陆成功！',
          type: 'success'
        })
        // 將登錄成功之後的token保存到客戶端的sessionStorage中
        // 項目中除了登錄之外的其它API接口必須在登錄之後才能訪問
        // token只應該在當前網頁打開期間生效，所以將token保存在sessionStorage中。（相比而言localstorage是持久的保存機制，在此不適用）
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height:100%;
}

.login_box{
  width: 450px;
  height: 300px;
  background-color:#fff;
  border-radius: 3px;
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);

  .avatar_box{
    height: 130px;
    width: 130px;
    border:1px solid #eee;
    border-radius: 50%;
    padding:10px;
    box-shadow:0 0 10px #ddd;
    position: absolute;
    left:50%;
    transform:translate(-50%, -50%);

    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color:#eee;
    }
  }
}

.login_form{
  position:absolute;
  bottom:0;
  width: 100%;
  padding:0 20px;
  box-sizing: border-box;
}

.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
