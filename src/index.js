import Vue from 'vue';
import store from './store';
import { Plugin } from 'vue-fragment';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/ru-RU';
import PortalVue from 'portal-vue';
import vClickOutside from 'v-click-outside';


import Grid from '../src/components/grid/grid'
import Row from '../src/components/grid/row'
import Sortable from '../src/components/grid/sortable'
import Column from '../src/components/grid/column'
import Filterable from '../src/components/grid/filterable/filterable'
import Date from '../src/components/grid/filterable/date'
import List from '../src/components/grid/filterable/list'
import Number from '../src/components/grid/filterable/number'
import SearchList from '../src/components/grid/filterable/searchlist'

const components = [
  Grid,
  Row,
  Sortable,
  Column,
  Filterable,
  Date,
  List,
  Number,
  SearchList
];

const install = function(Vue, opts = {}) {

  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(vClickOutside);
  Vue.use(PortalVue);
  Vue.use(Plugin);
  Vue.use(ElementUI, {locale});

  Vue.prototype.$grid = (new Vue({store})).$store

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Grid,
  Row,
  Sortable,
  Column,
  Filterable,
  Date,
  List,
  Number,
  SearchList
};
