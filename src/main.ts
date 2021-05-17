import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import SocketHandler from './plugins/socketHandler'

Vue.config.productionTip = false
Vue.prototype.$socket = new SocketHandler()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
