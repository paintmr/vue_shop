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
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row.id)"></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="设置权限"
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
        @close="addDialogClosed"
      >
        <!-- 对话框内容主体区域 -->
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="80px"
            status-icon
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
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户"
        v-model="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
        status-icon
      >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 符合规则的邮箱
        return callback()
      }
      callback(new Error('请输入符合规则的邮箱'))
    }
    // 验证手机号码的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 符合规则的手机号码
        return callback()
      }
      callback(new Error('请输入符合规则的手机号码'))
    }
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
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 显示或隐藏修改用户对话框
      editDialogVisible: false,
      // 根据id查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
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
      if (res.meta.status !== 200) return this.$ElMessage.error(res.meta.msg)
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
        return this.$ElMessage.error(res.meta.msg)
      }
      this.$ElMessage.success('更新用户状态成功！')
    },
    // 当添加用户对话框关闭，清空数据，重置表单
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$axios.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$ElMessage.error(res.meta.msg)
        }
        this.$ElMessage.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$axios.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$ElMessage.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 当编辑用户对话框关闭，清空数据，重置表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 提交编辑内容
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.put('users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) {
          return this.$ElMessage.error(res.meta.msg)
        }
        this.$ElMessage.success('编辑用户成功')
        // 隐藏添加用户的对话框
        this.editDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示删除提示框，询问用户是否删除
    showDeleteDialog (id) {
      this.$ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$ElMessage.error(res.meta.msg)
          }
          this.$ElMessage({
            type: 'success',
            message: '删除成功!'
          })
          // 重新获取用户列表数据
          this.getUserList()
        })
        .catch(() => {
          this.$ElMessage({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
