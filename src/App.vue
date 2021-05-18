<template>
  <div id="app">
    <Grid name="main" />
  </div>
</template>

<script>
import Grid from './components/grid/grid'

export default {
  name: 'App',
  components : {Grid},

  data: function (){
    return {
      main_grid : {
        filter : {
          id : {
            type : 'number'
          }
        },
        context : [
          {
            name : 'Тестирование',
            function : function(row){
              console.log(row,1);
            }
          },
          {
            name : 'Тестирование2',
            function : function(row){
              console.log(row,2);
            }
          }
        ],
        header : {
          id : {
            name : 'ID',
            width : 80,
            child : ['column_1','column_2']
          },
          column_1 : {
            name : 'Заголовок 1',
            width : 360,
            child : ['column_3']
          },
          column_2 : {
            name : 'Заголовок 2',
            width : 370,
            child : ['column_4','column_5']
          },
          column_3 : {
            name : 'Заголовок 3',
            width : 380,
          },
          column_4 : {
            name : 'Заголовок 4',
            width : 390,
            child : ['column_6']
          },
          column_5 : {
            name : 'Заголовок 5',
            width : 400,
          },
          column_6 : {
            name : 'Заголовок 6',
            width : 410,
          },
          column_7 : {
            name : 'Заголовок 7',
            width : 410,
          },

        },
        elements : [
          {
            id : [
              {
                value : 1,
                child : {
                  column_2 : [
                    {
                      value : 'Колонка 2',
                      child : {
                        column_5 : [
                          {
                            value : 'Колонка 5'
                          },{
                            value : 'Колонка 5'
                          }
                        ],
                        column_4 : [
                          {
                            value : 'Колонка 4',
                            child : {
                              column_6 : [
                                {value : 'Колонка 6'},{value : 'Колонка 6'}
                              ]
                            }
                          },
                          {
                            value : 'Колонка 4',
                            child : {
                              column_6 : [
                                {value : 'Колонка 6'},{value : 'Колонка 6'}
                              ]
                            }
                          },
                          {
                            value : 'Колонка 4',
                            child : {
                              column_6 : [
                                {value : 'Колонка 6'},{value : 'Колонка 6'}
                              ]
                            }
                          }
                        ]
                      }
                    }
                  ],
                  column_1 : [
                    {
                      value : 'Колонка 1',
                      child : {
                        column_3 : [
                          {
                            value : 'Колонка 3'
                          },
                          {
                            value : 'Колонка 3'
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            column_7 : [
              {value : 'Заголовок 7'}
            ]
          }
        ]
      }
    };
  },
  created : function(){
    this.$store.dispatch('grid/createGrid', {name : 'main',data : this.main_grid});
  },
}
</script>