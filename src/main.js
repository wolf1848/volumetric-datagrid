import Vue from 'vue'
import App from './App.vue'
import store from './store'
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui-css/semantic.min.css';
import { Plugin } from 'vue-fragment'
import PortalVue from 'portal-vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.config.productionTip = false;

Vue.use(SuiVue);
Vue.use(Plugin);
Vue.use(PortalVue);
Vue.use(ElementUI);

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
