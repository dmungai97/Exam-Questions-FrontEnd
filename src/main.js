import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import UniqueId from 'vue-unique-id';
import i18n from './i18n';
import VueSignalR from '@latelier/vue-signalr';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(UniqueId);
Vue.use(VueSignalR, '/allocationHub');

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
