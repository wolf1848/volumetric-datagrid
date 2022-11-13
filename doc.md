# action ($action)
> getElements : метод запроса элементов с сервера. Метод обязательно возвращает промис, который возвращает json элементов 

# network [Object]
```javascript
getElements : {
    url     : 'http://localhost/getElements',
    method  : 'get|post|put|patch|delete',
    headers : {
        'Content-Type': 'application/json;charset=utf-8 - содержит поумолчанию', 
        'Дополнительные заголовки'
    },
    pagination : true //Обрабатывать объект постраничной навигации
}
```

```javascript
{
    show : 'none',//full//top//bottom//none
        size : 10,
        sizes : [10,20,50],
        layout : ['jumper', 'prev', 'pager', 'next', 'sizes', 'total'],
        pager : 5, // от 5 до 21
        total : 400,
        page : 1
}
```
