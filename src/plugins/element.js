import { ElButton, ElForm, ElFormItem, ElInput, ElContainer, ElHeader, ElAside, ElMain, ElMenu, ElMenuItem, ElSubmenu, ElBreadcrumb, ElBreadcrumbItem, ElCard, ElCol, ElRow } from 'element-plus'

export default (app) => {
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
}
