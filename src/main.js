import Vue from 'vue';
import App from './App.vue';
import store from './store';
import { Plugin } from 'vue-fragment';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/ru-RU';
import PortalVue from 'portal-vue';
import vClickOutside from 'v-click-outside';




Vue.config.productionTip = false;

Vue.use(vClickOutside);
Vue.use(PortalVue);
Vue.use(Plugin);
Vue.use(ElementUI, {locale});


new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
