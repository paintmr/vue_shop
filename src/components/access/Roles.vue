<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card class="box-card">

    <el-button type="primary">添加角色</el-button>

    <el-table :data="rolesList" border stripe style="width: 100%">
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-row :class="['bdbottom', i1===0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
            <!-- 第一级权限 -->
            <el-col :span="5">
              <el-tag closable disable-transitions @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
              <el-icon><caret-right /></el-icon>
            </el-col>
            <!-- 第二级权限 -->
            <el-col :span="19">
              <el-row :class="[i2===(item1.children.length-1) ? '' : 'bdbottom', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                <el-col :span="5">
                  <el-tag type="success" closable disable-transitions @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                  <el-icon><caret-right /></el-icon>
                </el-col>
                <!-- 第三级权限 -->
                <el-col :span="19">
                  <el-col :class="[i3===(item2.children.length-1) ? '' : 'bdbottom']" v-for="(item3, i3) in item2.children" :key="item3.id">
                    <el-tag type="danger" closable disable-transitions @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"/>
      <el-table-column prop="roleDesc" label="角色描述"/>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 分配权限对话框 -->
  <el-dialog
    v-model="setRightsDialogVisible"
    title="给用户添加权限"
    width="50%"
    @close="setRightDialogClosed"
  >
    <el-tree :data="rightListTree" :props="setRightsDefaultProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setRights"
          >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      // 分配权限对话框显示或隐藏
      setRightsDialogVisible: false,
      // 树形结构的所有权限
      rightListTree: [],
      // 树形结构中每一层显示的内容（label）以及层级关系（children）
      setRightsDefaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的权限节点ID值
      defKeys: [],
      // 当前设置权限的角色id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$ElMessage.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 根据id删除对应的权限
    removeRightById (role, rightId) {
      // 弹框提示用户是否要删除
      this.$ElMessageBox.confirm(
        '是否删除该权限?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
          if (res.meta.status !== 200) {
            return this.$ElMessage.error(res.meta.msg)
          }
          this.$ElMessage({
            type: 'success',
            message: '成功删除权限'
          })
          // 不要直接调用下面的这个函数来重新获取用户权限列表数据，因为会导致页面刷新，权限处于初始的折叠状态
          // this.getRolesList()
          // 但根据导师讲的这行代码，页面还是会全部重新刷新
          // scope.row作为role传进这个函数，改变role确实可以改变scope.row
          role.children = res.data
        })
        .catch(() => {
          this.$ElMessage({
            type: 'info',
            message: '取消删除权限'
          })
        })
    },
    // 根据用户id分配权限
    async showSetRightsDialog (role) {
      // 获取所有权限的数据
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) return this.$ElMessage.error(res.meta.msg)
      this.rightListTree = res.data
      // 找出当前角色身上已有的三级权限ID
      this.getLeafKeys(role, this.defKeys)
      // 显示分配权限对话框
      this.setRightsDialogVisible = true
      // 保存当前角色的id
      this.roleId = role.id
    },
    // 通过递归的形式，获取角色下所有三级权限的ID，并保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    async setRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post('roles/' + this.roleId + '/rights', { rids: idStr })
      if (res.meta.status !== 200) return this.$ElMessage.error(res.meta.msg)
      this.$ElMessage.success('设置权限成功')
      // 隐藏添加用户的对话框
      this.setRightsDialogVisible = false
      // 重新获取用户列表数据
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
