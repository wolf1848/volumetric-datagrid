import Vue from 'vue'

const defaultGrid = {
    //Фильтр по полям
    filter : {

    },
    pagination : {
        show : 'full',//top//bottom//none
        defaultSize : 10,
        sizes : [10,20,50],
        layout : ['jumper', 'prev', 'pager', 'next', 'sizes', 'total'],
        total : 400,
        page : 1,
        changeSize : function(value){
            console.log(`${value} items per page`);
        },
        changePage : function(value){
            console.log(`current page: ${value}`);
        }
    },
    // Контекстное меню применяемое к каждому ряду таблицы
    context : {
        row : null, // Ряд применения контекста
        menu : [] // Функции контекстного меню
    },
    // Настройки таблицы
    setting : {
        minWidth : 70, // Минимальная ширина при ресайзе колонки
        headerWidth : '', // Высота для настройки липучей шапки , возможно устарело
        columnWidth : {}, // Расчитываемый объект ширины колонок
    },
    header : {}, // Шапка таблицы
    elements : [] // Элементы
};
export default {
    namespaced: true,
    state: {
        grid : {}
    },
    mutations: {
        createGrid : function(s,name){
            Vue.set(s.grid, name, defaultGrid);
        },
        normalizeContext : function(s,data){
            s.grid[data.name].context.menu = data.data.context;
        },
        normalizePagination : function(s,data){
            s.grid[data.name].pagination = {
                ...s.grid[data.name].pagination,
                ...data.data.pagination
            }
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
        normalizeFilter : function(s, data){
            const filter = {
                number : {
                    change : [
                        {
                            value: '=',
                            label: 'Точно'
                        },
                        {
                            value: '><',
                            label: 'Диапазон'
                        },
                        {
                            value: '>',
                            label: 'Больше чем'
                        },
                        {
                            value: '<',
                            label: 'Меньше чем'
                        }
                    ],
                    operation : '=',
                    min : '',
                    max : ''
                }
            };
            let gridFilter = [];
            for(let key in data.filter){
                gridFilter.push({
                    ...filter[data.filter[key].type],
                    ...data.filter[key],
                    key : key
                });
            }

            Vue.set(s.grid[name], 'filter', gridFilter);
        },
        virtualHeader : function(s, name){
            let tree = {},
                header = s.grid[name].header,
                root = Object.keys(header),
                list = [],
                listWidth = s.grid[name].setting.minWidth + 'px ',
                scrollWidth = s.grid[name].setting.minWidth,
                treeWidth = {
                    root : s.grid[name].setting.minWidth + 'px '
                };

            for(let key in header){
                if(header[key].child.length){
                    tree[key] = header[key].child;
                    root = root.filter(x => !header[key].child.includes(x));
                }
            }

            tree.root = root;

            for(let key in tree){
                tree[key] = tree[key].sort(function(a,b){
                    return header[a].sort - header[b].sort;
                })
            }

            let sortableTree = {};
            for(let key in tree){
                sortableTree[key] = tree[key];
            }

            let exclude = [];
            for(let key in header){
                if(!header[key].show)
                    exclude.push(key);
            }

            for(let key in tree){
                tree[key] = tree[key].filter(x => !exclude.includes(x));
            }


            list = (function lists(data){
                let arr = [];
                data.forEach(el => {
                    arr.push(el);
                    if(el in tree){
                        arr = arr.concat(lists(tree[el]));
                    }
                });
                return arr;
            })(tree.root);


            list.forEach(key => {
                listWidth += + header[key].width + 'px ';
                scrollWidth += +header[key].width;
            });


            function getNumber(key,tree,header){
                let w = 0;
                if(key in tree) {
                    tree[key].forEach(el => {

                        w += +header[el].width;

                        if (el in tree)
                            w += +getNumber(el, tree, header);

                    });
                }
                return w;
            }
            function getString(key,tree,header){
                let w = 0,str = '';
                if(key in tree) {
                    tree[key].forEach(el => {
                        w = 0;
                        w += +header[el].width;

                        if (el in tree)
                            w += +getNumber(el, tree, header);

                        str += +w + 'px '

                    });
                }
                return str;
            }

            tree.root.forEach(el => {
                treeWidth.root += +header[el].width + getNumber(el,tree,header) + 'px '
            });

            for(let key in tree){
                if(key  !== 'root'){
                    treeWidth[key] = '';
                    treeWidth[key] += +header[key].width + 'px ' + getString(key,tree,header);
                }
            }

            Vue.set(s.grid[name], 'virtualHeader', {});
            Vue.set(s.grid[name].virtualHeader, 'tree', tree);
            Vue.set(s.grid[name].virtualHeader, 'sortableTree', sortableTree);
            Vue.set(s.grid[name].virtualHeader, 'list', list);
            Vue.set(s.grid[name].virtualHeader, 'listWidth', listWidth);
            Vue.set(s.grid[name].virtualHeader, 'scrollWidth', scrollWidth);
            Vue.set(s.grid[name].virtualHeader, 'treeWidth', treeWidth);
        },
        updateHeader : function(s,data){
            data.update.forEach(el => {
                s.grid[data.grid].header[el.key] = {
                    ...s.grid[data.grid].header[el.key],
                    ...el.params
                }
            });
        },
        normalizeElement : function(s, data){
            Vue.set(s.grid[data.name], 'elements', data.data.elements);
        },
        showContext : function(s, data){
            console.log(s.grid[data.name].context);
            Vue.set(s.grid[data.name].context, 'row', data.row);
        },
        hideContext : function(s, name){
            Vue.set(s.grid[name].context, 'row', null);
        },
    },
    actions: {
        createGrid : function({commit},data){
            commit('createGrid',data.name);
            commit('normalizeContext',data);
            commit('normalizePagination',data);
            commit('normalizeSetting',data);
            commit('normalizeHeader',data);
            commit('virtualHeader',data.name);
            commit('normalizeElement',data);
        },
        resize : function({commit},data){
            commit('updateHeader',{
                grid : data.name,
                update : [{
                    key : data.key,
                    params : {
                        width : data.width
                    }
                }]
            });
            commit('virtualHeader',data.name);
        },
        sortable : function({commit},data){
            commit('updateHeader',{
                grid : data.name,
                update : data.data
            });
            commit('virtualHeader',data.name);
        }
    },
    getters : {
        keyHeader       : s => name => s.grid[name].keyHeader,
        virtualHeader   : s => name => s.grid[name].virtualHeader,
        context         : s => name => s.grid[name].context,
        pagination      : s => name => s.grid[name].pagination,
        header          : s => name => s.grid[name].header,
        setting         : s => name => s.grid[name].setting,
        elements        : s => name => s.grid[name].elements,
    }
}