import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI  from 'element-ui'
import store from './store';
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/reset.css'
import common from './api/common'
import http from './server/axios'   //axios实例化后引入取名http
import configUrl from './config'
Vue.config.productionTip = false

Vue.prototype.http = http;   //放入全局
Vue.prototype.uplodUrl = configUrl.baseUrl;
Vue.use(ElementUI)
Vue.use(common)
Vue.use(router)

const getBasics = async (to, next) => {
  try {
    console.log(localStorage.getItem('userinfo'))
    const res = await axios(``)
    if (res.data.state !== '0') {
      ElementUI.MessageBox.alert(res.data.msg, {
        title: '错误信息',
        customClass: 'forbidden',
        showConfirmButton: false
      })
    }
    if (res.data.msg === 'success') {
      store.state.info = res.data.data
      next()
    }
  } catch (e) {
    Common.handleError(e, store._vm)
  }
}
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
