export default {
    header : {
        field : {
            sort: 100,
            show: true,
            child: [],
            parent : null,
            sortable : false,
            direction : "asc"
        },
        icon : {
            name : 'icon',
            width : 80,
            sort : -1,
            show : false,
            child : [],
        }
    },
    setting : {
        customizable    : false,
        context         : false,
        remote          : false,
        prefix          : 'default',
        user            : 0,
    },
    context : [],
    network : {
        getElements : {
            url     : '',
            headers : {},
            body    : {},
            pagination : false
        },
        getSetting : {
            url     : '',
            headers : {},
            body    : {}
        },
        saveSetting : {
            url     : '',
            headers : {},
            body    : {}
        }
    },


    pagination : {
        show : 'none',//full//top//bottom//none
        size : 10,
        sizes : [10,20,50],
        layout : ['jumper', 'prev', 'pager', 'next', 'sizes', 'total'],
        pager : 5, // от 5 до 21
        total : 400,
        page : 1
    },
    grid : {
        filter          : {},
        pagination      : {},
        // Контекстное меню применяемое к каждому ряду таблицы
        context         : {
            row : null, // Ряд применения контекста
            menu : [] // Функции контекстного меню
        },
        // Настройки таблицы
        setting         : {
            minWidth : 70, // Минимальная ширина при ресайзе колонки
            headerWidth : '', // Высота для настройки липучей шапки , возможно устарело
            columnWidth : {}, // Расчитываемый объект ширины колонок
        },
        header          : {}, // Шапка таблицы
        elements        : [], // Элементы
        network         : {}, // Обект одноименных обьектов для выполнения системных функций

    },
    filter : {
        data               : {},
        filtered           : [],
        use                : false,
        profiles           : [],    // сохраненные профили фильтра
        profiled           : false,
        showProfiles       : false, // меняет ширину окна фильтра и включает компанент с профилями
        show               : false,
        updateSavedProfile : false, // если у сохраненного ранее пользовательского профиля поменялись данные то показать кнопку Сохранить
        filter             : function(data){
            console.log('Обьект фильтра : ' , data);
        },
        clear              : function(data){
            console.log('Функция сброса фильтра', data);
        }
    },
    fType : {
        number      : {
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
            max : '',
            show : true
        },
        list        : {
            multiple : false,
            value : '',
            option : [],
            changeOption : [],
            show : true,
            load : false,
            url : '',
            body : {},
            headers : {},
            loading : false,
            loadingText : 'Ожидайте идет загрузка',
            loadingError : 'Ошибка загрузки данных!'
        },
        searchList  : {
            multiple : false,
            value : '',
            option : [],
            changeOption : [],
            show : true,
            load : true,
            query : '',
            url : '',
            body : {},
            headers : {},
            loading : false,
            loadingText : 'Ожидайте идет загрузка',
            loadingError : 'Ошибка загрузки данных!',
        },
        date        : {
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
            max : '',
            show : true
        },
    }
}
