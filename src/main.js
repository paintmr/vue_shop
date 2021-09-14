import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
// 導入全局樣式表
import './assets/css/global.css'

// 引入axios
import axios from 'axios'
const app = createApp(App)

// 全局配置axios，这样每个组件可以直接用
app.config.globalProperties.$axios = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

installElementPlus(app)
app.use(router).mount('#app')
