<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 頭像區域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登錄表單區域 -->
        <el-form label-width="0px" class="login_form">
          <!-- 用戶名 -->
          <el-form-item>
            <el-input prefix-icon="el-icon-search"></el-input>
          </el-form-item>
          <!-- 密碼 -->
          <el-form-item>
            <el-input prefix-icon="el-icon-search"></el-input>
          </el-form-item>
          <!-- 按鈕 -->
          <el-form-item>
              <div class="btns">
                <el-button type="primary">登錄</el-button>
                <el-button type="info">重置</el-button>
              </div>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
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
