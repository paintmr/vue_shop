<template>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图区域 -->
  <el-card class="box-card">

    <!-- 按钮 -->
    <el-button type="primary" @click="showAddGoodsCatDialog">添加分类</el-button>

    <!-- 表格 -->
    <el-table :data="goodsCateList" border style="width: 100%" row-key="cat_id">
      <el-table-column label="分类名称" prop="cat_name" />
      <el-table-column label="是否有效" prop="cat_deleted">
        <template v-slot="scope">
          <el-icon v-if="scope.row.cat_deleted === false" style="color: skyblue">
            <success-filled />
          </el-icon>
          <el-icon v-else>
            <circle-close-filled />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="层级" prop="cat_level">
        <template v-slot="scope">
          <el-tag :type="goodsCateLevelColor[scope.row.cat_level]" size="mini">{{goodsCateLevelCha[scope.row.cat_level]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditGoodsCatDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoodsCate(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </el-card>

  <!-- 添加分类的对话框 -->
  <el-dialog
    v-model="addGoodsCateVisible"
    title="添加商品分类"
    width="50%"
    @close="addDialogClosed"
  >
    <!-- 对话框主体 -->
    <el-form
      :model="addGoodsCateForm"
      :rules="goodsCateFormRules"
      ref="addGoodsCateFormRef"
      label-width="80px"
      status-icon
    >
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addGoodsCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <!-- element plus及联选择器 -->
        <!-- options指定数据源。v-model把选中的值双向绑定到data数据中。这里的v-model必须是数组。只要选择了某个值，就会触发@change函数，并且可以在函数中得到选择的值。clearable有清空的按钮。 -->
        <el-cascader
          v-model="selectedGoodsParentCatId"
          :options="goodsParentCateList"
          :props="cascaderProps"
          @change="goodsParentCateChanged"
          style="width: 100%"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 对话框底部 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="goodsCateVisible = false">取消</el-button>
        <el-button type="primary" @click="addGoodsCate"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 编辑商品分类的对话框 -->
  <el-dialog
    v-model="editGoodsCateVisible"
    title="编辑商品分类"
    width="50%"
    @close="editDialogClosed"
  >
    <!-- 对话框主体 -->
    <el-form
      :model="addGoodsCateForm"
      :rules="goodsCateFormRules"
      ref="editGoodsCateFormRef"
      label-width="80px"
      status-icon
    >
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addGoodsCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <!-- element plus及联选择器 -->
        <!-- options指定数据源。v-model把选中的值双向绑定到data数据中。这里的v-model必须是数组。只要选择了某个值，就会触发@change函数，并且可以在函数中得到选择的值。clearable有清空的按钮。 -->
        <el-cascader
          v-model="selectedGoodsParentCatId"
          :options="goodsParentCateList"
          :props="cascaderProps"
          @change="goodsParentCateChanged"
          style="width: 100%"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 对话框底部 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editGoodsCateVisible = false">取消</el-button>
        <el-button type="primary" @click="editGoodsCate"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

</template>

<script>
export default {
  data () {
    return {
      // 获取商品列表的参数对象
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      goodsCateList: [],
      // 获取到的总商品分类条数
      total: 0,
      // 根据数据显示对应层级的tag
      goodsCateLevelColor: {
        0: '',
        1: 'success',
        2: 'danger'
      },
      goodsCateLevelCha: {
        0: '一级',
        1: '二级',
        2: '三级'
      },
      // 是否显示添加商品对话框
      addGoodsCateVisible: false,
      // 添加商品分类的表单数据
      addGoodsCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 将要添加的分类的等级。0、1、2分别代表一级二级三级分类
        cat_level: 0
      },
      // 添加表单的验证规则对象
      goodsCateFormRules: {
        cat_name: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
          { min: 1, max: 30, message: '用户名为1-30个字符', trigger: 'blur' }
        ]
      },
      // 所有父级分类（一二级商品分类）
      goodsParentCateList: [],
      // 配选中的父级商品分类id
      selectedGoodsParentCatId: [],
      // 及联选择器的配置对象。expandTrigger设置hover是鼠标覆上去就显示子菜单。value是选中的值，lable是看到的值。checkStrictly可以选中任意一级的选项
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 是否显示编辑商品分类对话框
      editGoodsCateVisible: false
    }
  },
  created () {
    this.getGoodsCateList()
  },
  methods: {
    async getGoodsCateList () {
      const { data: res } = await this.$axios.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$ElMessage.error(res.meta.msg)
      this.goodsCateList = res.data.result
      // console.log(this.goodsCateList)
      this.total = res.data.total
      // console.log(this.total)
    },
    // 监听pagesize改变的事件
    handleSizeChange (newPageSize) {
      console.log(`${newPageSize} items per page`)
      this.queryInfo.pagesize = newPageSize
      this.getGoodsCateList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPageNum) {
      console.log(`current page: ${newPageNum}`)
      this.queryInfo.pagenum = newPageNum
      this.getGoodsCateList()
    },
    // 展示添加商品分类的对话框
    showAddGoodsCatDialog () {
      this.addGoodsCateVisible = true
      this.getGoodsParentCateList()
    },
    // 获取父级分类的列表（即所有一二级分类）
    async getGoodsParentCateList () {
      const { data: res } = await this.$axios.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$ElMessage.error(res.meta.msg)
      this.goodsParentCateList = res.data
      // console.log(res.data)
    },
    // 监听级联选择器的变化
    goodsParentCateChanged (value) {
      // this.selectedGoodsParentCatId = value。value是element plus自带的，自动传入的参数
      // 如果this.selectedGoodsParentCatId为null，证明刚刚清空了选择，此时如果直接进入if (this.selectedGoodsParentCatId.length > 0）这个流程判断会报错，因为null没有length，所以先要判断this.selectedGoodsParentCatId是否为null
      // console.log(this.selectedGoodsParentCatId)
      if (this.selectedGoodsParentCatId !== null) {
        // 如果this.selectedGoodsParentCatId中的length大于0，证明选中了父级分类；反之，就没有选择任何父级分类
        if (this.selectedGoodsParentCatId.length > 0) {
          this.addGoodsCateForm.cat_pid = this.selectedGoodsParentCatId[this.selectedGoodsParentCatId.length - 1]
          this.addGoodsCateForm.cat_level = this.selectedGoodsParentCatId.length
        } else {
          this.addGoodsCateForm.cat_pid = 0
          this.addGoodsCateForm.cat_level = 0
        }
      } else {
        this.addGoodsCateForm.cat_pid = 0
        this.addGoodsCateForm.cat_level = 0
      }
    },
    addDialogClosed () {
      this.$refs.addGoodsCateFormRef.resetFields()
      this.selectedGoodsParentCatId = []
      this.addGoodsCateForm.cat_level = 0
      this.addGoodsCateForm.cat_pid = 0
    },
    addGoodsCate () {
      // console.log(this.addGoodsCateForm)
      // 预校验通过后才能把数据提交到数据库
      // console.log(this.addGoodsCateForm)
      this.$refs.addGoodsCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('categories', this.addGoodsCateForm)
        if (res.meta.status !== 201) {
          return this.$ElMessage.error(res.meta.msg)
        }
        this.$ElMessage.success('添加商品分类成功')
        // 隐藏添加商品分类的对话框
        this.addGoodsCateVisible = false
        // 重新获取商品分类列表数据
        this.getGoodsCateList()
      })
    },
    // 打开编辑对话框
    async showEditGoodsCatDialog (goodsCat) {
      // 根据id获取分类名称
      const { data: res } = await this.$axios.get('categories/' + goodsCat.cat_id)
      if (res.meta.status !== 200) {
        return this.$ElMessage.error(res.meta.msg)
      }
      // console.log(res.data)
      this.addGoodsCateForm = res.data
      this.editGoodsCateVisible = true
      // 获取所有的分类数据
      this.getGoodsParentCateList()
      // 获取商品分类上级的信息(一级和二级)
      // 获取当前被编辑商品分类的所有父级商品分类信息
      if (res.data.cat_level === 0) {
        this.selectedGoodsParentCatId = [0]
      } else if (res.data.cat_level === 1) {
        this.selectedGoodsParentCatId = [res.data.cat_pid]
      } else if (res.data.cat_level === 2) {
        this.$axios.get('categories/' + res.data.cat_pid).then((res) => {
          // console.log(res.data)
          this.selectedGoodsParentCatId = [res.data.data.cat_pid, res.data.data.cat_id]
          // console.log(this.selectedGoodsParentCatId)
        })
      }
    },
    editDialogClosed () {
      this.$refs.editGoodsCateFormRef.resetFields()
      this.selectedGoodsParentCatId = []
      this.addGoodsCateForm.cat_level = 0
      this.addGoodsCateForm.cat_pid = 0
    },
    // 提交编辑的内容
    editGoodsCate () {
      this.$refs.editGoodsCateFormRef.validate(async valid => {
        if (!valid) return
        // console.log(this.addGoodsCateForm)
        const { data: res } = await this.$axios.put('categories/' + this.addGoodsCateForm.cat_id, this.addGoodsCateForm)
        if (res.meta.status !== 200) {
          return this.$ElMessage.error(res.meta.msg)
        }
        this.$ElMessage.success('编辑用户成功')
        // 隐藏添加用户的对话框
        this.editGoodsCateVisible = false
        // 重新获取用户列表数据
        this.getGoodsCateList()
      })
    },
    // 删除商品分类
    deleteGoodsCate (goodsCat) {
      this.$ElMessageBox.confirm('是否删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete('categories/' + goodsCat.cat_id)
          if (res.meta.status !== 200) {
            return this.$ElMessage.error(res.meta.msg)
          }
          this.$ElMessage({
            type: 'success',
            message: '删除成功!'
          })
          // 重新获取商品分类列表数据
          this.getGoodsCateList()
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
