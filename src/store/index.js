import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const defaultGrid = {
  setting : {
    minWidth : 70,
    maxWidth : 0,
    headerWidth : '',
    columnWidth : {},
  },
  header : [],
  elements : []
};
export default new Vuex.Store({
  state: {
    grid : {}
  },
  mutations: {
    createGrid : function(s,name){
      s.grid[name] = defaultGrid;
    },
    normalizeSetting : function(s,data){
      s.grid[data.name].setting = {
        ...s.grid[data.name].setting,
        ...data.data.setting
      }
    },
    normalizeHeader : function(s, data){
      const headerElement = {
        name : 'defaultName',
        width : 70,
        sort : 100,
        show : true,
        child : []
      };
      let headerResult = {};
      for(let key in data.data.header){
        headerResult[key] = {
          ...headerElement,
          ...data.data.header[key]
        }
      }
      s.grid[data.name].header = headerResult;
    },
    sortableHeader : function(s, name){
      let sortable = [],
          includeHeader = Object.keys(s.grid[name].header),
          getSort = function (header,key){
            let arr = [];
            header[key].child.forEach(el => {
              let child = header[el], elements = [];
              if(child.child.length){
                elements = getSort(header,el);
              }
              arr.push({...child, child : elements, key : el})
            })
            return arr.sort(function(a,b){return a.sort - b.sort});
          };

      for(let key in s.grid[name].header){
        if(s.grid[name].header[key].child.length){
          includeHeader = includeHeader.filter(x => !s.grid[name].header[key].child.includes(x));
        }
      }

      includeHeader.forEach(key => {
        let el = s.grid[name].header[key],
            elements = [];
        if(el.child.length)
          elements = getSort(s.grid[name].header,key);

        sortable.push({...el, child : elements, key : key});
      })
      sortable = sortable.sort(function(a,b){return a.sort - b.sort});

      s.grid[name].includeHeader = includeHeader;
      s.grid[name].sortableHeader = sortable;
    },
    keyHeader : function(s,name){
      let sortable = s.grid[name].sortableHeader,
          keyHeader = [],
          childKey = function(arr){
            let res = [];
            arr.forEach(el => {
              if(el.child.length){
                res.push(el.key);
                res = res.concat(childKey(el.child));
              }else
                res.push(el.key);
            });
            return res;
          };
      sortable.forEach( el => {
        if(el.child.length){
          keyHeader.push(el.key);
          keyHeader = keyHeader.concat(childKey(el.child));
        }else
          keyHeader.push(el.key);
      });

      s.grid[name].keyHeader = keyHeader;
    },
    countWidthHeader : function(s,name){
      let headerWidth = s.grid[name].setting.minWidth + 'px ';
      let maxWidth = 0;
      s.grid[name].keyHeader.forEach(key => {
        headerWidth += + s.grid[name].header[key].width + 'px ';
        maxWidth += +s.grid[name].header[key].width;
      })
      s.grid[name].setting.headerWidth = headerWidth;
      s.grid[name].setting.maxWidth = maxWidth;
    },
    updateWidthHeader : function(s,data){
      s.grid[data.name].header[data.key].width = data.width;
    },
    normalizeElement : function(s, data){
      s.grid[data.name].elements = data.data.elements;
    },
    countWidthColumn : function(s,name){
      function getChildWidth(grid,key){
        let w = 0;
        grid.header[key].child.forEach(el => {
          if(grid.header[el].child.length)
            w +=  +grid.header[el].width + getChildWidth(grid,el);
          else
            w += grid.header[el].width;
        });
        return w;
      }

      function getWidthSubColumn(grid,key){
        let str = grid.header[key].width + 'px ';
        grid.header[key].child.forEach(el => {
          if (grid.header[el].child.length)
            str += +grid.header[el].width + getChildWidth(grid,el) + 'px ';
          else
            str += grid.header[el].width + 'px ';
        })
        return str;
      }

      let grid = s.grid[name], str = grid.setting.minWidth + 'px ';
      grid.keyHeader.forEach(key => {
        if(grid.includeHeader.includes(key)) {
          if (grid.header[key].child.length)
            str += +grid.header[key].width + getChildWidth(grid,key) + 'px ';
          else
            str += grid.header[key].width + 'px ';
        }
      })
      s.grid[name].setting.columnWidth = {
        row : str
      };

      for(let key in s.grid[name].header){
        if (s.grid[name].header[key].child.length) {
          s.grid[name].setting.columnWidth[key] = getWidthSubColumn(s.grid[name],key);
        }
      }
    },
    /*

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
    sortableHeaderReset : function(s, sortable){
      let sort = 0;
      s.grid.setting.sortableHeader = sortable.map(el => {
        sort += 10;
        s.grid.header[el.key].sort = sort;
        el.sort = sort;
        return el;
      });
    },


    setColumnWidth : function(s,data){
      s.grid.header[data.key].width = data.width;
    },*/
  },
  actions: {
    createGrid : function({commit},data){
      commit('createGrid',data.name);
      commit('normalizeSetting',data);
      commit('normalizeHeader',data);
      commit('normalizeElement',data);
      commit('sortableHeader',data.name);
      commit('keyHeader',data.name);
      commit('countWidthHeader',data.name);
      commit('countWidthColumn',data.name);
    },
    resize : function({commit},data){
      commit('updateWidthHeader',data);
      commit('countWidthHeader',data.name);
    },
/*    setGrid : async function({commit},grid){
      await
      await commit('includeHeader');
      await commit('sortableHeader');
      await commit('countWidthHeader');
      await commit('countWidthColumn');
    },
    setColumnWidth : async function({commit},data){
      await commit('countWidthColumn');
    },
    sortableHeaderReset : async function({commit},data){
      await commit('sortableHeaderReset',data);
    }*/

  },
  getters : {
    keyHeader     : s => name => s.grid[name].keyHeader,
    includeHeader : s => name => s.grid[name].includeHeader,
    header        : s => name => s.grid[name].header,
    setting       : s => name => s.grid[name].setting,
    elements      : s => name => s.grid[name].elements,
/*    grid : s => s.grid,
    gridHeader : s => s.grid.header,
    gridSetting : s => s.grid.setting,
    columnWidth : s => s.grid.setting.columnWidth,
    includeHeader : s => s.grid.setting.includeHeader,
    sortableHeader : s => s.grid.setting.sortableHeader,*/
  }
})
