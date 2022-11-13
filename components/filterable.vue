<script>
import {inject, h, resolveComponent, Transition, reactive, computed} from "vue";

export default {
    name : 'Filterable',
    props : ['name'],
    setup(props){

        const grid = inject(props.name);

        const condition = reactive({
            keys : {
                all : computed(() => Object.keys(grid.filter.data)),
                show : computed(() => Object.keys(grid.filter.data).filter(key => grid.filter.data[key].show)),
                hide : computed(() => Object.keys(grid.filter.data).filter(key => !grid.filter.data[key].show))
            },
            window : {
                show : false,
                expect : false,
                hide : true
            },
            drop : {
                top : 0,
                left : 0,
                show : false,
                button : computed(() => !!Object.keys(grid.filter.data).filter(key => !grid.filter.data[key].show).length)
            },
            profile : {
                creation : {
                    use : false,
                    form : {
                        name : ''
                    },
                    rules : {
                        name: [
                            { required: true, message: 'Укажите наименование профиля', trigger: 'blur' },
                            { min: 1, max: 30, message: 'Наименование профиля не более 30 символов', trigger: 'blur' },
                        ]
                    }
                },
                update : false,
                rename : false,
                active : {
                    name : 'По умолчанию',
                    key : 0
                }
            },
            tags : []
        })

        return {grid, condition}
    },
    methods : {
        open : function(){
            this.condition.window.show = true;
            document.addEventListener('click', this.close);
        },
        close : function($event) {
            if($event.target.closest('.vdg_filter.' + this.name) == null && !this.condition.window.expect) {
                this.condition.window.show = false;
                document.removeEventListener('click', this.close)
            }else if(this.condition.window.hide){
                this.condition.window.expect = false;
            }
        },
        clearField : function(element){
            switch (element.type){
                case 'date': case 'number':
                    element.operation = '=';
                    element.min = '';
                    element.max = '';
                    break;
                case 'list': case 'searchList':
                    element.changeOption = [];
                    element.value = '';
                    break;
            }
        },
        checkField : function(element){
            switch (element.type){
                case 'date':case 'number':
                    if(element.min != '' || element.max != '')
                        return true
                    break;
                case 'list': case 'searchList':
                    if(element.value instanceof Array && element.value.length > 0 || element.value != '')
                        return true
                    break;
                default: return false
            }
        },
        extractField : function(element){
            switch (element.type){
                case 'date' : case 'number' :
                    return {
                        key : element.key,
                        type : element.type,
                        operation : element.operation,
                        min : element.min,
                        max : element.max,
                    }
                    break;
                case 'list' : case 'searchList' :
                    return {
                        key : element.key,
                        type : element.type,
                        value : element.value,
                    }
                break
            }
        },
        extractFieldForProfile : function(element){
            switch (element.type){
                case 'date': case 'number':
                    return {
                        key : element.key,
                        value : {
                            min : element.min,
                            max : element.max,
                            operation : element.operation
                        }
                    }
                    break;
                case 'list' : case 'searchList' :
                    return {
                        key : element.key,
                        value : {
                            value : element.value,
                            option : element.load ? element.option : []
                        }
                    }
                    break;
            }
        },
        hideField : function(element){
            return h( resolveComponent ('el-button'), {
                    class : ['el-button', 'el-button--default'],
                    onClick : () => {
                        this.clearField(element);
                        element.show = false;
                        this.condition.window.expect = true;
                        this.extract();
                    }
                },
                () => h(resolveComponent('el-icon'), () => h(resolveComponent('close')))
            )
        },
        number : function(element){
            return [
                h('label',element.name),
                h('div', {class : 'vdg_filter_number'},
                    [
                        h( resolveComponent('el-select'), {
                                'modelValue' : element.operation,
                                'onUpdate:modelValue': value => {
                                    element.operation = value
                                    this.extract();
                                },
                            },
                            () => element.change.map(el => {
                                return h(resolveComponent('el-option'), {label : el.label, value : el.value}, '')
                            })
                        ),
                        h( resolveComponent('el-input'), {
                                'modelValue' : Number(element.min) ? element.min : null,
                                'onUpdate:modelValue': value => {
                                    element.min = value;
                                    this.extract();
                                },
                                onBlur : function(){
                                    if(element.min > element.max && element.max) element.max = +element.min + 1;
                                },
                                placeholder : 'Введите значение'
                            }
                        ),
                        element.operation == '><' ? h(
                            resolveComponent('el-input'), {
                                'modelValue' : Number(element.max) ? element.max : null,
                                'onUpdate:modelValue': value => {
                                    element.max = value
                                    this.extract();
                                },
                                onBlur : function(){
                                    if(element.min > element.max && element.max) element.max = +element.min +1;
                                },
                                placeholder : 'Введите значение'
                            }
                        ) : '',
                        this.hideField.call(this,element)
                    ]
                ),
            ]
        },
        date : function(element){
            let setting = {
                type : 'date',
                format : 'DD.MM.YYYY',
                valueFormat : 'DD.MM.YYYY',
                placeholder : 'Укажите дату',
                'onVisibleChange' : v => {this.condition.window.hide = !v;this.condition.window.expect = v;}
            };
            return [
                h('label',element.name),
                h('div', {class : 'vdg_filter_date'},
                    [
                        h( resolveComponent('el-select'), {
                                'modelValue' : element.operation,
                                'onUpdate:modelValue': value => {
                                    element.operation = value
                                    this.extract();
                                }
                            },
                            () => element.change.map(el => {return h(resolveComponent('el-option'), {label : el.label, value : el.value}, '')})
                        ),
                        h( resolveComponent('el-date-picker'), {
                                ...setting,
                                'modelValue' : element.min,
                                'onUpdate:modelValue': value => {
                                    element.min = value
                                    this.extract();
                                }
                            }
                        ),
                        element.operation == '><' ? h( resolveComponent('el-date-picker'), {
                                ...setting,
                                'modelValue' : element.max,
                                'onUpdate:modelValue': value => {
                                    if(value){
                                        let valueDate = value.split("."),
                                            valueTimestamp = new Date( valueDate[2], valueDate[1] - 1, valueDate[0]).getTime(),
                                            minDate = element.min.split("."),
                                            minTimestamp = new Date( minDate[2], minDate[1] - 1, minDate[0]).getTime();
                                        if(valueTimestamp < minTimestamp)
                                            element.max = element.min
                                        else element.max = value
                                    }else element.max = value
                                    this.extract();
                                },
                            }
                        ) : '',
                        this.hideField.call(this,element)
                    ]
                ),
            ]
        },
        list : function(element){
            return [
                h('label',element.name),
                h('div', {class : 'vdg_filter_list'},
                    [
                        h( resolveComponent('el-select'), {
                                clearable :true,
                                multiple : element.multiple,
                                loading: element.loading,
                                loadingText: element.loadingText,
                                onFocus : () => this.remote(element),
                                'modelValue' : element.value,
                                'onUpdate:modelValue': value => {
                                    element.value = value
                                    this.extract();
                                }
                            },
                            () => element.option.map(el => {return h(resolveComponent('el-option'), {label : el.label, value : el.value}, '')})
                        ),
                        this.hideField.call(this,element)
                    ]
                ),
            ]
        },
        searchList : function(element){
            return [
                h('label',element.name),
                h('div', {class : 'vdg_filter_searchList'},
                    [
                        h( resolveComponent('el-select'), {
                                clearable : true,
                                multiple : element.multiple,
                                filterable : true,
                                loading : element.loading,
                                loadingText: element.loadingText,
                                ref : 'search',
                                remote : true,
                                placeholder : 'Введите значение',
                                'modelValue' : element.value,
                                'onUpdate:modelValue': value => {
                                    element.value = value
                                    this.extract();
                                },
                                remoteMethod : query => this.remote(element,query),
                                onChange : (value) => {
                                    if(value instanceof Array) {
                                        let inc = element.changeOption.filter(el => value.includes(el.value))
                                        let diff = value.filter(el => !inc.map(val => val.value).includes(el))
                                        element.changeOption =  element.option.filter(el => diff.includes(el.value)).concat(inc)
                                    }else{
                                        element.changeOption = [];
                                        if(value)
                                            element.changeOption.concat(element.option.filter(op => value == op.value));
                                    }
                                    this.$refs.search.query = '';
                                }
                            },
                            () => element.option.map(el => {return h(resolveComponent('el-option'), {label : el.label, value : el.value})})
                        ),
                        this.hideField.call(this,element)
                    ]
                ),
            ]
        },
        extract : function(){
            this.grid.filter.filtered = this.condition.keys.show.filter(key => {
                let element = this.grid.filter.data[key];
                return this.checkField(element)
            }).map(key => {
                let element = this.grid.filter.data[key];
                return this.extractField(element);
            });
            this.difference();
        },
        diffShow : function(){
            this.grid.filter.profiles[this.condition.profile.active.key].fields.forEach(el => {
                if (!this.condition.keys.show.includes(el.key))
                    this.condition.profile.update = true;
            })
        },
        diffHide : function(){
            let fp = this.grid.filter.profiles[this.condition.profile.active.key].fields.map(el => el.key)
            this.condition.keys.show.forEach(key => {
                if (!fp.includes(key))
                    this.condition.profile.update = true;
            })
        },
        diffFields : function(){
            this.grid.filter.profiles[this.condition.profile.active.key].fields.forEach(el => {
                this.grid.filter.filtered.forEach(fill => {
                    if (fill.key == el.key) {
                        switch (fill.type) {
                            case 'date': case 'number':
                                if (fill.operation != el.value.operation || fill.min != el.value.min || fill.max != el.value.max)
                                    this.condition.profile.update = true
                                break;
                            case 'list': case 'searchList':
                                if (fill.value instanceof Array) {
                                    fill.value.join()
                                    el.value.value.join()
                                }
                                if (fill.value != el.value)
                                    this.condition.profile.update = true
                                break;
                        }
                    }
                })
            })
        },
        difference : function(){
            this.condition.profile.update = false;

            this.diffShow()

            if(!this.condition.profile.update)
                this.diffHide()

            if (!this.condition.profile.update)
                this.diffFields()

            if(this.condition.profile.active.key == 0)
                this.updateProfile();
        },
        remote : function(element,query = ''){
            if(element.load) {
                element.query = query;
                element.loading = true;
                setTimeout((localQuery) => {
                    if(element.query == localQuery)
                        fetch(element.url, {
                            method: 'post',
                            body: JSON.stringify({
                                ...element.body,
                                searchQuery: query
                            }),
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                ...element.headers
                            }
                        }).then(res => res.json()).then(res => {
                            element.option = res;
                            if('changeOption' in element){
                                let option = element.option.map(el => el.value)
                                element.changeOption = element.changeOption.filter(el => !option.includes(el.value));
                                element.option = element.option.concat(element.changeOption)
                            }
                            element.loading = false;
                        }).catch(() => {element.loadingText = element.loadingError})
                },600,query)
            }
        },
        queryTag : function(element){
            let value;
            switch (element.type){
                case 'date': case 'number':
                    value = element.operation + ' ' + element.min;
                    if(this.grid.filter.data[element.key].operation == '><')
                        value = (element.min != ''  ? element.min : '?') + ' - ' + (element.max != '' ? element.max : '?');
                    return {
                        key : element.key,
                        name : element.name,
                        value : value
                    }
                    break;
                case 'list': case 'searchList':
                    value = element.value;
                    if(element.value instanceof Array)
                        element.option.filter(option => element.value.includes(option.value)).map(option => option.label).join()
                    return {
                        key : element.key,
                        name : element.name,
                        value : element.option.filter(option => element.value.includes(option.value)).map(option => option.label)
                    }
                    break;
            }
        },
        show : function(){
            let arr =  this.condition.keys.show.filter(key => {
                let element = this.grid.filter.data[key];
                return this.checkField(element)
            }).map(key => {
                let element = this.grid.filter.data[key];
                return this.queryTag(element)
            })

            let len = arr.length - 1;
            let cut = arr.reduce((previousValue, currentValue,i) => {
                    let len = (currentValue.name + currentValue.value).length;

                    if((previousValue.len + len) < 90) {
                        previousValue.len = previousValue.len + len;
                        previousValue.key = i;
                    }

                    return previousValue
                },
                {len : 0, key : 0}
            )

            this.condition.tags = arr.filter((el,i) => i <= cut.key);
            if(this.condition.tags.length > 0 && len > cut.key)
                this.condition.tags.push({
                    key : 'all',
                    name : 'Еще',
                    value : len - cut.key
                })
        },
        apply : function() {
            this.show();
            this.grid.filter.use = true;
            this.grid.$action.loader(this.name);
            this.grid.$action.start(this.grid);
            this.condition.window.show = false;
        },
        cancel : function() {
            this.condition.tags = [];
            this.grid.filter.use = false;
            this.grid.$action.loader(this.name);
            //this.grid.$action.start(this.grid)
        },
        clear : function() {
            this.grid.filter.filtered = this.condition.keys.all.map(key => {
                let element = this.grid.filter.data[key];
                this.clearField(element);
            });
            this.grid.filter.filtered = [];
        },
        createProfile : function() {
            this.$refs.createProfile.validate((valid) => {
                if (valid) {
                    this.grid.filter.profiles.push({
                        name : this.condition.profile.creation.form.name,
                        fields : this.condition.keys.show.map(key => {
                            let element = this.grid.filter.data[key];
                            return this.extractFieldForProfile(element);
                        })
                    });

                    this.condition.profile.creation.form.name = '';
                    this.condition.profile.creation.use = false
                    this.condition.window.expect = true;
                    this.grid.$action.saveProfile();
                }
            })
        },
        updateProfile : function() {
            this.grid.filter.profiles[this.condition.profile.active.key] = {
                name : this.condition.profile.active.name,
                fields : this.condition.keys.show.map(key => {
                    let element = this.grid.filter.data[key];
                    return this.extractFieldForProfile(element);
                })
            };

            this.condition.profile.update = false
            this.condition.window.expect = true
            this.grid.$action.saveProfile();
        },
        renameProfile : function() {
            this.condition.profile.rename = !this.condition.profile.rename;
            if(this.condition.profile.rename)
                this.condition.profile.creation.form.name = this.condition.profile.active.name;
            this.condition.window.expect = true;
            if(!this.condition.profile.rename)
                this.$refs.updateProfile.validate((valid) => {
                    if (valid) {
                        this.grid.filter.profiles[this.condition.profile.active.key].name = this.condition.profile.creation.form.name
                        this.condition.profile.active.name = this.condition.profile.creation.form.name
                        this.condition.profile.creation.form.name = '';
                        this.grid.$action.saveProfile();
                    }
                })
        },
        selectProfile : function(key){
            this.condition.profile.update = false;
            if(key != null) {
                let keys = this.grid.filter.profiles[key].fields.map(el => {
                    if ('min' in el.value) this.grid.filter.data[el.key].min = el.value.min;
                    if ('max' in el.value) this.grid.filter.data[el.key].max = el.value.max;
                    if ('operation' in el.value) this.grid.filter.data[el.key].operation = el.value.operation;
                    if ('option' in el.value) this.grid.filter.data[el.key].option = el.value.option;
                    if ('value' in el.value) this.grid.filter.data[el.key].value = el.value.value;

                    return el.key;
                })

                this.condition.keys.all.forEach(key => {
                    this.grid.filter.data[key].show = keys.includes(key);
                });

                this.condition.profile.active.name = this.grid.filter.profiles[key].name;
                this.condition.profile.active.key = key;
            }
        },
        showDropMenu :  function($event){
            $event.stopPropagation();

            this.condition.drop.show = true;

            let rect = this.$refs.dropMenu.ref.getBoundingClientRect();

            if(($event.clientY + rect.height) > window.innerHeight)
                this.condition.drop.top = window.innerHeight - rect.height - 10;
            else
                this.condition.drop.top = $event.clientY;

            if(($event.clientX + rect.width) > window.innerWidth)
                this.condition.drop.left = window.innerWidth - rect.width - 20;
            else
                this.condition.drop.left = $event.clientX;

            document.addEventListener('click', this.hideDropMenu);
        },
        hideDropMenu : function($event) {
            if($event.target.closest('.vdg_filter_dropMenu.' + this.name) == null){
                this.condition.drop.show = false;
                document.removeEventListener('click',this.hideDropMenu)
            }
        },
        buttonAddProfile : function(){
            return h('button',{
                    class : ['el-button','el-button--default'],
                    onClick : () => {
                        this.condition.profile.creation.use = true;
                        this.condition.window.expect = true;
                    }
                },
                ['Создать новый профиль',h(resolveComponent('el-icon'), () => h(resolveComponent('plus')))]
            )
        },
        formAddProfile : function(){
            return h(resolveComponent('el-form'),{
                    ref : 'createProfile',
                    model : this.condition.profile.creation.form,
                    rules : this.condition.profile.creation.rules,
                },
                () => [
                    h(resolveComponent('el-form-item'), {prop : 'name'},
                        () => h(resolveComponent('el-input'), {
                                maxlength : 30,
                                showWordLimit : true,
                                placeholder : 'Введите название профиля',
                                'modelValue' : this.condition.profile.creation.form.name,
                                'onUpdate:modelValue': value => this.condition.profile.creation.form.name = value,
                            }
                        )
                    ),
                    h('button',{
                            class : ['el-button','el-button--default'],
                            onClick : $e => {
                                $e.preventDefault();
                                this.createProfile();
                            },
                        },
                        ['Сохранить',h(resolveComponent('el-icon'),() => h(resolveComponent('check')))]
                    ),
                    h('button',{
                            class : ['el-button','el-button--default'],
                            onClick : () => {
                                this.condition.profile.creation.use = false;
                                this.condition.window.expect = true;
                            }
                        },
                        ['Отменить',h(resolveComponent('el-icon'),() => h(resolveComponent('close')))]
                    )
                ]
            )
        },
        userProfiles : function(){
            return h(resolveComponent ('el-scrollbar'), {class : [{active : this.condition.profile.creation.use}],},
                () => h('div',{ref : 'spWrap'},
                    this.grid.filter.profiles.map((el,i) => {
                        return h('button',{
                                class : ['el-button','el-button--default',{selected : i == this.condition.profile.active.key}],
                                onClick : () => this.selectProfile(i),
                            },
                            el.name
                        )
                    })
                )
            )
        },
        sectionProfiles : function(){
            return h(
                'div', {}, [
                    h('h3', {},'Выбор профиля'),
                    this.userProfiles(),
                    !this.condition.profile.creation.use ? this.buttonAddProfile() : '',
                    this.condition.profile.creation.use ? this.formAddProfile() : '',
                ]
            )
        },
        dropMenu : function(){
            return h('div', {
                    class : ['vdg_filter_dropMenu', this.name, 'wrap'],
                    style : {
                        top  : this.condition.drop.top  + 'px',
                        left : this.condition.drop.left + 'px',
                    },
                },
                this.condition.keys.hide.map(key => {
                    return h('div', {
                            onClick : () => {
                                this.condition.profile.update = false;
                                this.grid.filter.data[key].show = true;
                                this.condition.window.expect = true;
                                this.difference();
                            }
                        },
                        this.grid.filter.data[key].name
                    )
                })
            )
        },
        sectionFilters : function(){
            return h('div', {
                    class : ['vdg_filter_window',{profile : this.grid.filter.profiled}],
                }, [
                    this.grid.filter.profiled ? this.sectionProfiles() : '',
                    h('div', {}, [
                            h('h3',{}, [
                                    'Активный профиль : ',
                                        !this.condition.profile.rename ? h('span',{},
                                            this.condition.profile.active.name) :
                                            h(resolveComponent('el-form'),{
                                                    ref : 'updateProfile',
                                                    model : this.condition.profile.creation.form,
                                                    rules : this.condition.profile.creation.rules,
                                                },
                                                () => [
                                                    h(resolveComponent('el-form-item'), {prop : 'name'},
                                                        () => h(resolveComponent('el-input'), {
                                                                maxlength : 30,
                                                                showWordLimit : true,
                                                                autofocus : true,
                                                                placeholder : 'Введите название профиля',
                                                                'modelValue' : this.condition.profile.creation.form.name,
                                                                'onUpdate:modelValue': value => this.condition.profile.creation.form.name = value
                                                            }
                                                        )
                                                    )
                                                ]
                                            ),
                                    this.condition.profile.active.key > 0 ? h(resolveComponent('el-icon'),{
                                        onClick : () => this.renameProfile()
                                    },() => h(resolveComponent(this.condition.profile.rename ? 'check' : 'EditPen' ))) : ''
                                ]
                            ),
                            h(resolveComponent ('el-scrollbar'), {},
                                () => h('div',{ref : 'sfWrap'},
                                    Object.keys(this.grid.filter.data).map(key => {
                                        let element = this.grid.filter.data[key];
                                        return (element.type in this && element.show) ? this[element.type](element) : '';
                                    })
                                )
                            ),
                            h('div',{},[
                                    this.condition.drop.button ? h(resolveComponent ('el-button'), {
                                            ref : 'dropMenu',
                                            class : ['vdg_filter_dropMenu', this.name],
                                            onClick : $event => {this.showDropMenu($event) }
                                        }, () => '+'
                                    ) : '',
                                    this.condition.profile.active.key > 0 ? h(resolveComponent ('el-button'), {
                                            class : ['el-button--danger', 'is-plain'],
                                            onClick : () => {
                                                this.grid.filter.profiles.splice(this.condition.profile.active.key,1)
                                                this.selectProfile(0)
                                                this.grid.$action.saveProfile();
                                            }
                                        }, () => 'Удалить профиль'
                                    ) : '',
                                    this.condition.profile.active.key > 0 && this.condition.profile.update ? h(resolveComponent ('el-button'), {
                                            class : ['el-button--success', 'is-plain'],
                                            onClick : () => this.updateProfile()
                                        }, () => 'Сохранить профиль'
                                    ) : '',
                                    this.condition.profile.active.key == 0 ? h(resolveComponent ('el-button'), {
                                            class : ['vdg_filter_clear', 'el-button', 'el-button--default', {last : this.condition.profile.active.key == 0}],
                                            onClick : () => this.grid.filter.use ? this.cancel() : this.clear()
                                        },
                                        () => this.grid.filter.use ? 'Сбросить' : 'Очистить'
                                    ) : '',
                                    h(resolveComponent ('el-button'), {
                                            class : ['el-button', 'el-button--primary', {last : this.condition.profile.active.key > 0}],
                                            onClick : () => this.apply()
                                        },
                                        () => 'Найти'
                                    )
                                ]
                            )
                        ]
                    )
                ]
            );
        }
    },
    render(){
        return h('div',{
            class : ['vdg_filter', this.name]
            }, [
                h(resolveComponent('el-input'), {
                        placeholder : 'Фильтр',
                        onClick : () => this.open()
                    },
                    {
                        prefix : () => this.condition.tags.map(el => {
                            return h(resolveComponent('el-tag'),{
                                closable : el.key == 'all' ? false : true,
                                size : 'large',
                                onClose : function (){
                                    let element = this.grid.filter.data[el.key];
                                    this.clearField(element)
                                    this.extract();
                                    this.apply();
                                }.bind(this)
                            }, () => el.name + ' : ' + el.value)
                        }),
                        suffix : () => this.condition.tags.length ? h(resolveComponent('el-tag'),{
                            size : 'large',
                            closable : true,
                            onClose : function (){
                                this.clear();
                                this.apply();
                            }.bind(this)
                        }) : ''
                    }
                ),
                h( Transition, {
                    name : 'el-fade-in-linear'
                    }, () => [
                        this.condition.window.show ? this.sectionFilters() : '',
                    ],
                ),
                this.condition.drop.show ? this.dropMenu() : '',
            ]
        );
    }
}
</script>
