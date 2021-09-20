<template>
  <div>
    <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <template #append>
                <el-button icon="el-icon-search" @click="getUserList"></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户列表区域 -->
        <el-table :data="userlist" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="username" label="用户名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="手机号码"> </el-table-column>
          <el-table-column prop="role_name" label="用户权限"> </el-table-column>
          <el-table-column label="状态">
            <template v-slot="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" :btnId="scope.row.id"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="Top Left 设置权限"
                placement="top-start"
                :enterable="false"
              >
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 8, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        v-model="addDialogVisible"
        width="50%"
      >
        <!-- 对话框内容主体区域 -->
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="80px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        <!-- 对话框底部区域 -->
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 显示或隐藏添加用户对话框
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名为3-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名为6-15个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$axios.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$ElMessage.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newPageSize) {
      console.log(`每页 ${newPageSize} 条`)
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPageNum) {
      console.log(`当前页: ${newPageNum}`)
      this.queryInfo.pagenum = newPageNum
      this.getUserList()
    },
    // 监听switch开关状态的改变
    async userStateChanged (userinfo) {
      const { data: res } = await this.$axios.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 如果进入到这里，说明数据库里面状态没有被改变，而此时页面上的状态已经变了，所以得取反改回去
        userinfo.mg_state = !userinfo.mg_state
        return this.$ElMessage.error('更新用户状态失败！')
      }
      this.$ElMessage.success('更新用户状态成功！')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
