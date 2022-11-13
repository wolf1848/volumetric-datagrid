import {computed, reactive, watch} from "vue";
import def from "./default";
import action from "./action";
import system from "./system";

export default function(data) {
    let grid = reactive({
        header         : {},
        system         : {},
        context        : [],
        pagination     : {},
        filter         : {},
        network        : {},
        setting        : {},
        elements       : [],
        error          : []
    })

    system.merge('setting', data, grid, def);
    system.merge('context', data, grid,true);
    system.merge('network', data, grid, def);
    system.merge('pagination', data, grid, def);

    if('network' in data)
        Object.keys(grid.network).forEach(key => {
            system.merge(key, data.network, grid.network, def.network);
        })

    grid.error = system.validation.header(data);

    if(!grid.error.length)
        system.normalize.header(data,grid);




    if('filter' in data) {
        let gridFilter = {
            ...def.filter,
            ...data.filter
        };
        for (let key in data.filter.data) {
            gridFilter.data[key] = {
                ...def.fType[data.filter.data[key].type],
                ...data.filter.data[key],
                key: key
            };
        };
        grid.filter = reactive(gridFilter)
    }else
        grid.filter =  reactive(def.filter);



    grid.system = computed(() => {
        let headerKey = Object.keys(grid.header);

        //ниже убрали поля которые показывать не надо и еще сортанули
        let columnKey = headerKey.filter(el => {
            return !!grid.header[el].show;
        }).sort((a,b) => {
            return grid.header[a].sort - grid.header[b].sort
        });

        return {
            // Используем для построения шапки в таблице (сортированые и доступные для отображения ключи)
            columnKey : columnKey,

            // Используем для построения списка полей в модалке (сортированые и любые для отображения ключи)
            columnShow : headerKey.filter(el => {
                return el != 'icon';
            }).sort((a,b) => {
                return grid.header[a].sort - grid.header[b].sort
            }),
            // grid-template-columns  (gtc) для ширины колонок и тела таблицы
            gtc : (columnKey.map(el => {
                return grid.header[el].width;
            }).join('px ')) + 'px',

            // Общая ширина всех колонок для просчета боковой прокрутки
            scrollWidth : columnKey.reduce(
                (previousValue, currentValue) => previousValue + grid.header[currentValue].width,
                0
            ),
            sort : reactive({
                direction : "asc",
                field : headerKey.filter(el => grid.header[el].sortable)[0],
            }),
            context : reactive({
                top : 0,
                left : 0,
                show : false,
                row : null,
            }),
        }

    });

    if('action' in data)
        grid.$action = {
            ...action,
            ...data.action,
            self : grid
        }
    else
        grid.$action = {
            ...action,
            self : grid
        };

    watch(() => grid.filter.data, (newValue, oldValue) => {grid.filter.updateSavedProfile = true},{deep : true});


    return grid;

};
