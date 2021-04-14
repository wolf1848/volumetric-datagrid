import Vue from 'vue'
import App from './App.vue'
import store from './store'
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui-css/semantic.min.css';
import { Plugin } from 'vue-fragment'
import PortalVue from 'portal-vue'
import VModal from 'vue-js-modal/dist/index.nocss.js'
import 'vue-js-modal/dist/styles.css'


Vue.config.productionTip = false;

Vue.use(SuiVue);
Vue.use(Plugin);
Vue.use(PortalVue);
Vue.use(VModal, { dynamicDefault: { draggable: true, resizable: true } })

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
