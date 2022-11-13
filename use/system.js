import def from "./default";
import {reactive} from "vue";

export default {
    validation : {
        header : function(data){
            let error = [];

            if(!('header'in data))
                error.push('Field "header" in object Grid required');

            Object.keys(data.header).forEach(key => {
                let field = data.header[key];

                if(!('name' in field))
                    error.push('Field "name" in header column "'+key+'" required');

                if(!('width' in field))
                    error.push('Field "width" in header column "'+key+'" required');

                if('sort' in field && field.sort < 0)
                    error.push('Field "sort" in header column "'+key+'" cannot be negative');
            })

            return error;
        }
    },
    normalize : {
        header : function(data, grid){
            Object.keys(data.header).forEach(key => {
                let field = data.header[key];

                grid.header[key] = {
                    ...def.header.field,
                    ...field,
                }

                if('child' in field && field.child.length){
                    field.child.forEach(el => {
                        grid.header[el].parent = key;
                    })
                }

            })

            grid.header.icon = def.header.icon;
            grid.header.icon.show = grid.setting.customizable || grid.setting.context;

            Object.keys(grid.header).sort((a,b) => {
                return grid.header[a].sort - grid.header[b].sort
            }).reduce((sort, key) => {
                    grid.header[key].sort = sort;
                    return sort += 100;
                }, 0
            )
        }
    },
    merge : function(key, data, grid, normal = {}, array = false){
        if(array){
            if (key in data) grid[key] = data[key];
        }else{
            if (key in data) grid[key] = reactive({...normal[key], ...data[key]});
            else grid[key] = reactive(normal[key]);
        }
    }
}
