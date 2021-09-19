import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
// 導入全局樣式表
import './assets/css/global.css'
// 引入message组件
import { ElMessage } from 'element-plus'

// 引入axios
import axios from 'axios'
const app = createApp(App)

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在axios发请求之前，先给有权限的请求挂载token
axios.interceptors.request.use(config => {
  // 为请求头对象添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 全局配置axios，这样每个组件可以直接用
app.config.globalProperties.$axios = axios

// 全局配置Elmessage，这样每个组件可以直接用
app.config.globalProperties.$ElMessage = ElMessage

installElementPlus(app)
app.use(router).mount('#app')
