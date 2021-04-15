import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    grid : {
      setting : {
        minWidth : 70,
        maxWidth : 0,
        headerWidth : '',
        columnWidth : {},
      }
    },
  },
  mutations: {
    normalizeSetting : function(s,grid){
      s.grid.setting = {
        ...s.grid.setting,
        ...grid.setting
      }
    },
    normalizeHeader : function(s, grid){
      const headerElement = {
        name : 'defaultName',
        width : 70,
        sort : 100,
        show : true,
        child : []
      };
      let headerResult = {};
      for(let key in grid.header){
        headerResult[key] = {
          ...headerElement,
          ...grid.header[key]
        }
      }
      s.grid.header = headerResult;
    },
    normalizeElement : function(s, grid){
      s.grid.elements = grid.elements;
    },
    includeHeader : function(s){
      let includeHeader = Object.keys(s.grid.header);
      for(let key in s.grid.header){
        if(s.grid.header[key].child.length){
          includeHeader = includeHeader.filter(x => !s.grid.header[key].child.includes(x));
        }
      }
      s.grid.setting.includeHeader = includeHeader;
    },
    sortableHeader : function(s){
      function getSort(s,key){
        let arr = [];
        s.grid.header[key].child.forEach(el => {
          let child = s.grid.header[el], elements = [];
          if(child.child.length){
            elements = getSort(s,el);
          }
          arr.push({sort : child.sort, name : child.name, key : el, elements : elements})
        })
        return arr.sort(function(a,b){return a.sort - b.sort});
      }
      let sortable = [];
      s.grid.setting.includeHeader.forEach(key => {
        let el = s.grid.header[key], elements = [];
        if(el.child.length)
          elements = getSort(s,key);

        sortable.push({sort : el.sort, name : el.name, key : key, elements : elements});
      })
      sortable = sortable.sort(function(a,b){return a.sort - b.sort});

      s.grid.setting.sortableHeader = sortable;
    },
    countWidthHeader : function(s){
      let headerWidth = s.grid.setting.minWidth + 'px ';
      let maxWidth = 0;
      for(let key in s.grid.header){
        headerWidth += + s.grid.header[key].width + 'px ';
        maxWidth += +s.grid.header[key].width;
      }
      s.grid.setting.headerWidth = headerWidth;
      s.grid.setting.maxWidth = maxWidth;
    },
    countWidthColumn : function(s){
      function getChildWidth(s,key){
        let w = 0;
        s.grid.header[key].child.forEach(el => {
          if(s.grid.header[el].child.length)
            w +=  +s.grid.header[el].width + getChildWidth(s,el);
          else
            w += s.grid.header[el].width;
        });
        return w;
      }

      function getWidthSubColumn(s,key){
        let str = s.grid.header[key].width + 'px ';
        s.grid.header[key].child.forEach(el => {
          if (s.grid.header[el].child.length)
            str += +s.grid.header[el].width + getChildWidth(s,el) + 'px ';
          else
            str += s.grid.header[el].width + 'px ';
        })
        return str;
      }

      let str = s.grid.setting.minWidth + 'px ';
      for(let key in s.grid.header){
        if(s.grid.setting.includeHeader.includes(key)) {
          if (s.grid.header[key].child.length)
            str += +s.grid.header[key].width + getChildWidth(s,key) + 'px ';
          else
            str += s.grid.header[key].width + 'px ';
        }
      }
      s.grid.setting.columnWidth = {
        row : str
      };

      for(let key in s.grid.header){
        if (s.grid.header[key].child.length) {
          s.grid.setting.columnWidth[key] = getWidthSubColumn(s,key);
        }
      }
    },
    setColumnWidth : function(s,data){
      s.grid.header[data.key].width = data.width;
    },
  },
  actions: {
    setGrid : async function({commit},grid){
      await commit('normalizeSetting',grid);
      await commit('normalizeHeader',grid);
      await commit('normalizeElement',grid);
      await commit('includeHeader');
      await commit('sortableHeader');
      await commit('countWidthHeader');
      await commit('countWidthColumn');
    },
    setColumnWidth : async function({commit},data){
      await commit('countWidthColumn');
    },
    resize : async function({commit},data){
      await commit('setColumnWidth',data);
      await commit('countWidthHeader');
    }

  },
  getters : {
    grid : s => s.grid,
    gridHeader : s => s.grid.header,
    gridSetting : s => s.grid.setting,
    columnWidth : s => s.grid.setting.columnWidth,
    includeHeader : s => s.grid.setting.includeHeader,
    sortableHeader : s => s.grid.setting.sortableHeader,
  }
})
