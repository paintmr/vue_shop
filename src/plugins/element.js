import { ElMessage, ElMessageBox, ElButton, ElForm, ElFormItem, ElInput, ElContainer, ElHeader, ElAside, ElMain, ElMenu, ElMenuItem, ElSubmenu, ElBreadcrumb, ElBreadcrumbItem, ElCard, ElCol, ElRow, ElTableColumn, ElTable, ElSwitch, ElTooltip, ElPagination, ElDialog, ElTag, ElIcon, ElTree, ElOption, ElSelect } from 'element-plus'
import { CaretRight } from '@element-plus/icons'

export default (app) => {
  // 全局配置Elmessage和ElmessageBox，这样每个组件可以直接用
  app.config.globalProperties.$ElMessage = ElMessage
  app.config.globalProperties.$ElMessageBox = ElMessageBox
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElAside)
  app.use(ElMain)
  app.use(ElMenu)
  app.use(ElMenuItem)
  app.use(ElSubmenu)
  app.use(ElBreadcrumb)
  app.use(ElBreadcrumbItem)
  app.use(ElCard)
  app.use(ElCol)
  app.use(ElRow)
  app.use(ElTableColumn)
  app.use(ElTable)
  app.use(ElSwitch)
  app.use(ElTooltip)
  app.use(ElPagination)
  app.use(ElDialog)
  app.use(ElTag)
  app.use(ElIcon)
  app.use(ElTree)
  app.use(ElOption)
  app.use(ElSelect)
  app.component('caret-right', CaretRight)
}
