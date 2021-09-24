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
          <p>{{scope.row}}</p>
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
        <template>
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rolesList: []
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
