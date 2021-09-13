import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
// 導入全局樣式表
import './assets/css/global.css'

const app = createApp(App)
installElementPlus(app)
app.use(router).mount('#app')
