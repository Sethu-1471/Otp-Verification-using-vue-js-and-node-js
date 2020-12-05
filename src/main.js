import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import VueToastify from "vue-toastify";

Vue.use(VueToastify);
Vue.config.productionTip = false
Vue.prototype.$hostname = (Vue.config.productionTip) ? 'https://hostname' : 'http://localhost:3500';

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
