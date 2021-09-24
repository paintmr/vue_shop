<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card class="box-card">
    <el-table :data="rightsList" border stripe style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="authName" label="权限名称"/>
      <el-table-column prop="path" label="路径"/>
      <el-table-column prop="level" label="权限等级">
        <!-- v-slot="scope"中的scope可以取任意的名字 -->
        <template v-slot="scope">
          {{scope.row}}
          <el-tag :type="rightsLevelColor[scope.row.level]">{{rightsLevelCha[scope.row.level]}}</el-tag>
          <el-button @click="testChangeScope(scope.row)">点击</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rightsList: [],
      rightsLevelColor: {
        0: '',
        1: 'success',
        2: 'danger'
      },
      rightsLevelCha: {
        0: '一级',
        1: '二级',
        2: '三级'
      }
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$axios.get('rights/list')
      if (res.meta.status !== 200) return this.$ElMessage.error(res.meta.msg)
      this.rightsList = res.data
    },
    testChangeScope (eachRow) {
      eachRow.test = 'test'
    }
  }
}
</script>

<style lang="less" scoped>

</style>
