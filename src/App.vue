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
        setting : {
          headerWidth : '',
        },
        header : {
          id : {
            name : 'ID',
            width : 80,
            child : ['column_1']
          },
          column_1 : {
            name : 'Заголовок 1',
            width : 360,
            child : ['column_2','column_3']
          },
          column_2 : {
            name : 'Заголовок 2',
            width : 550,
          },
          column_3 : {
            name : 'Заголовок 3',
            width : 380,
            sort : 80
          },
          column_4 : {
            name : 'Заголовок 4',
            width : 390,
            sort : 90
          },
          column_5 : {
            name : 'Заголовок 5',
            width : 400,
          },
          column_6 : {
            name : 'Заголовок 6',
            width : 410,
          },
        },
        elements : [
          {
            id : [
              {
                value : 1,
                child : {
                  column_1 : [
                    {
                      value : 'Колонка 1',
                      child : {
                        column_2 : [
                          {
                            value : 'Колонка 2'
                          },
                          {
                            value : 'Колонка 2.2'
                          }
                        ],
                        column_3: [{
                          value : 'Колонка 3'
                        }],
                      }
                    },
                    {
                      value : 'Колонка 1',
                      child : {
                        column_2 : [
                          {
                            value : 'Колонка 2'
                          },
                          {
                            value : 'Колонка 2.2'
                          },
                          {
                            value : 'Колонка 2.3'
                          },
                          {
                            value : 'Колонка 2.4'
                          }
                        ],
                        column_3: [{
                          value : 'Колонка 3'
                        }],
                      }
                    }
                  ]
                }
              }
            ],
            column_4: [{
              value : 'Колонка 4'
            }],
            column_5: [{
              value : 'Колонка 5'
            }],
            column_6: [{
              value : 'Колонка 6'
            }],
          }
        ]
      }
    };
  },
  created : function(){
    this.$store.dispatch('createGrid', {name : 'main',data : this.main_grid});
  },
}
</script>