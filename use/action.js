import {ElLoading} from "element-plus";

export default {
    insert : (elements) => {
        //Рекурсивный перебор дерева элементов
        let extractChild = (element,startIndex) => {
            let resultElementsChild = {};
            for (const [key, child] of Object.entries(element)) {
                let iterator = startIndex;
                resultElementsChild[key] = [];
                let resultObject = {};

                if(!child.length) {
                    resultObject = {
                        value: '',
                        start: iterator,
                        end: iterator + 1
                    }

                    resultElementsChild[key].push(resultObject)
                }

                child.forEach(value => {
                    let endMax = iterator + 1;
                    resultObject = {
                        value : value.value,
                        start : iterator,
                        end : endMax
                    }

                    if('child' in value){
                        let childRow = extractChild(value.child, resultObject.start);

                        for (const [childKey, childElement] of Object.entries(childRow)) {
                            if(childKey in resultElementsChild){
                                resultElementsChild[childKey] = resultElementsChild[childKey].concat(childElement);
                            }else{
                                resultElementsChild[childKey] = childElement;
                            }
                            let maxEnd = childElement[childElement.length - 1].end;
                            if(maxEnd > resultObject.end)
                                resultObject.end = maxEnd;
                        }
                    }

                    resultElementsChild[key].push(resultObject)
                    iterator = resultObject.end;
                })
            }
            return resultElementsChild;
        }

        //Перебор расчета высоты строк
        return elements.map(element => {

            let resultElements = {};

            for (const [key, target] of Object.entries(element)) {
                resultElements[key] = [];
                let changeValue = true;
                target.forEach((value, index) => {
                    let back = resultElements[key][index - 1];
                    let resultObject = {
                        value: value.value,
                        start: back ? back.end : index + 1,
                        end: back ? back.end + 1 : index + 2
                    }
                    if ('child' in value) {
                        let childRow = extractChild(value.child, resultObject.start);

                        for (const [key, childElement] of Object.entries(childRow)) {
                            if (key in resultElements) {
                                resultElements[key] = resultElements[key].concat(childElement);
                            } else {
                                resultElements[key] = childElement;
                            }
                            let maxEnd = childElement[childElement.length - 1].end;
                            if (maxEnd > resultObject.end)
                                resultObject.end = maxEnd;
                        }
                    }

                    resultElements[key].push(resultObject);
                    changeValue = false;
                })
                if (changeValue)
                    resultElements[key].push({
                        value: '',
                        start: 1,
                        end: 2
                    });
            }

            resultElements['icon'] = [{
                value: '',
                start: 1,
                end: 2
            }]

            if('context' in element)
                resultElements['context'] = element.context

            return resultElements;
        });
    },
    normalizeFilterData : (data) => {
        grid.filter.data = {...grid.filter.data, ...data};
        for (let key in grid.filter.data) {
            grid.filter.data[key] = {
                ...filter[grid.filter.data[key].type],
                ...grid.filter.data[key],
                key: key
            };
        };
        setTimeout(() => {grid.filter.updateSavedProfile = false;}, 0);
    },
    loader : (function (){
        let instance = null;
        return function(name){
            if(!instance)
                instance = ElLoading.service({
                    target : "#grid-wrap-" + name,
                    text : "Загрузка данных...",
                    spinner : `
                                <path class="path" d="
                                  M 30 15
                                  L 28 17
                                  M 25.61 25.61
                                  A 15 15, 0, 0, 1, 15 30
                                  A 15 15, 0, 1, 1, 27.99 7.5
                                  L 15 15
                                " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
                              `,
                    svgViewBox : "-10, -10, 50, 50",
                    lock : false
                })
            else{
                instance.close();
                instance = null;
            }
        }
    }()),
    getElements : (grid) => {
        return new Promise((next,err) => {
            fetch(grid.network.getElements.url, {
                method: 'post',
                body: JSON.stringify({
                    pagination : {
                        use : grid.network.getElements.pagination,
                        limit : grid.pagination.size,
                        offset : grid.pagination.page
                    },
                    sort : {
                        field : grid.system.sort.field,
                        direction : grid.system.sort.direction
                    },
                    filter : grid.filter.use ? grid.filter.filtered : []
                }),
                headers: {
                    'Content-Type' : 'application/json;charset=utf-8',
                    ...grid.network.getElements.headers
                }
            })
            .then(res => res.json())
            .then(res => next(res))
            .catch(res => err(res))
        })
    },
    doLoad : (grid) => {
        return new Promise((next,err) => {
            let key = {
                name : grid.name,
                prefix : grid.setting.prefix,
                user : grid.setting.user
            }, remote = grid.setting.remote ? 'server' : 'local';

            grid.$action[remote].loadSetting.call(grid,key)
                .then(res => {
                    if('setting' in res){
                        Object.keys(res.setting).forEach(key => {
                            grid.header[key].show = res.setting[key].show;
                            grid.header[key].sort = res.setting[key].sort;
                            grid.header[key].width = res.setting[key].width;
                        })
                    }
                    if('profile' in res)
                        grid.filter.profiles = res.profile;

                })
                .then(res => {
                    if(!grid.filter.profiles.length)
                        grid.filter.profiles.push({
                            name : 'По умолчанию',
                            fields : Object.keys(grid.filter.data).filter(key => grid.filter.data[key].show).map(key => {
                                let element = grid.filter.data[key];
                                switch (element.type){
                                    case 'date': case 'number': return {
                                        key : key, value : {
                                            min : element.min,
                                            max : element.max,
                                            operation : element.operation
                                        }
                                    }; break;
                                    case 'list' : case 'searchList' : return {
                                        key : key, value : {
                                            value : element.value,
                                            option : element.load ? element.option : []
                                        }
                                    }; break;
                                }
                            })
                        })
                    else{
                        let show = grid.filter.profiles[0].fields.map(el => el.key)
                        Object.keys(grid.filter.data).forEach(key => {
                            if(show.includes(key)) grid.filter.data[key].show = true
                            else grid.filter.data[key].show = false
                        })
                    }

                    next(grid);
                })
                .catch(err => {
                    console.log(err);
                    err();
                })
        })
    },
    start : (grid) => {
        grid.$action.doLoad(grid)
            .then(grid => {
                grid.$action.getElements(grid)
                    .then(res => {
                        grid.pagination.total = res.total;
                        grid.elements = grid.$action.insert(res.elements);
                    })
                    .catch(err => {
                        console.error("Error load elements")
                    }).finally(() => grid.$action.loader());
            })
            .catch()
    },
    resizePage : function(){
        this.self.$action.loader(this.self.name);
        this.self.$action.start(this.self)
    },
    changePage : function(){
        this.self.$action.loader(this.self.name);
        this.self.$action.start(this.self)
    },
    saveGrid : function(){
        let save = {
            name : this.self.name,
            prefix : this.self.setting.prefix,
            user : this.self.setting.user,
            field : Object.keys(this.self.header).map(key => {
                return {
                    key : key,
                    show : this.self.header[key].show,
                    sort : this.self.header[key].sort,
                    width : this.self.header[key].width,
                }
            })
        }, remote = this.self.setting.remote ? 'server' : 'local';

        this.self.$action[remote].saveGrid.call(this.self,save)
    },
    saveProfile : function(){
        let save = {
            name : this.self.name,
            prefix : this.self.setting.prefix,
            user : this.self.setting.user,
            field : this.self.filter.profiles
        }, remote = this.self.setting.remote ? 'server' : 'local';

        this.self.$action[remote].saveProfile.call(this.self,save)
    },

    server : {
        loadSetting : function (key){
            return new Promise((next,err) => {
                fetch(this.network.getSetting.url, {
                    method: 'post',
                    body: JSON.stringify({
                        ...key,
                        ...this.network.getSetting.body
                    }),
                    headers: {
                        'Content-Type' : 'application/json;charset=utf-8',
                        ...this.network.getSetting.headers
                    }
                })
                .then(res => res.json())
                .then(res => {
                    next(res);
                })
                .catch(res => err(res))
            })
        },
        saveGrid : function(save){
            fetch(this.network.saveSetting.url, {
                method: 'post',
                body: JSON.stringify({
                    ...save,
                    ...this.network.saveSetting.body
                }),
                headers: {
                    'Content-Type' : 'application/json;charset=utf-8',
                    ...this.network.saveSetting.headers
                }
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })
            .catch(res => {
                console.log(res);
            })

        },
        saveProfile : function(save){
            fetch(this.network.saveSetting.url, {
                method: 'post',
                body: JSON.stringify({
                    ...save,
                    ...this.network.saveSetting.body
                }),
                headers: {
                    'Content-Type' : 'application/json;charset=utf-8',
                    ...this.network.saveSetting.headers
                }
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })
            .catch(res => {
                console.log(res);
            })
        }
    },
    local : {
        loadSetting : function (key){
            return new Promise((next,err) => {
                let id = key.name + ':' + key.prefix + ':' + key.user;
                let local = localStorage.getItem('grid');
                local = local ? JSON.parse(local) : {}

                if(!(id in local))
                    local[id] = {}
                next(local[id])
            })
        },
        saveGrid : function(save){
            let local = localStorage.getItem('grid');
            local = local ? JSON.parse(local) : {}

            let key = save.name + ':' + save.prefix + ':' + save.user;
            if(!(key in local))
                local[key] = {
                    setting : {},
                    profile : []
                }

            save.field.forEach(el => {
                if(!(el.key in local[key].setting))
                    local[key].setting[el.key] = {}
                local[key].setting[el.key] = {
                    show : el.show,
                    sort : el.sort,
                    width : el.width,
                }
            })

            localStorage.setItem('grid',JSON.stringify(local))
        },
        saveProfile : function(save){
            let local = localStorage.getItem('grid');
            local = local ? JSON.parse(local) : {}

            let key = save.name + ':' + save.prefix + ':' + save.user;

            if(!(key in local))
                local[key] = {
                    setting : {},
                    profile : []
                }

            local[key].profile = save.field

            localStorage.setItem('grid',JSON.stringify(local))
        }
    }
}
