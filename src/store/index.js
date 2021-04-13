import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    grid : {
      setting : {
        minWidth : 70
      }
    },
  },
  mutations: {
    setGrid : function(s,grid){
      const headerElement = {
        name : 'defaultName',
        width : 70,
        child : []
      };
      s.grid.setting = {
        ...s.grid.setting,
        ...grid.setting
      }

      let headerResult = {},
          headerWidth = s.grid.setting.minWidth + 'px ',
          includeHeader = Object.keys(grid.header);

      for(let key in grid.header){
        headerResult[key] = {
          ...headerElement,
          ...grid.header[key]
        }
        headerWidth += +headerResult[key].width + 'px ';
        if(headerResult[key].child.length){
          includeHeader = includeHeader.filter(x => !grid.header[key].child.includes(x));
        }
      }
      s.grid.header = headerResult;
      s.grid.setting.headerWidth = headerWidth;
      s.grid.setting.includeHeader = includeHeader;
      s.grid.elements = grid.elements;

      console.log(headerWidth)
    }
  },
  actions: {
  },
  getters : {
    grid : s => s.grid,
    gridHeader : s => s.grid.header,
    gridSetting : s => s.grid.setting,
  }
})
