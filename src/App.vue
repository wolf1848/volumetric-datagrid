<template>
  <div id="app">
    <Grid :data="row" :row="row" />
  </div>
</template>

<script>

import Grid from './components/grid/grid'

export default {
  name: 'App',
  components: {
    Grid
  },
  data : function (){
    return {
      row : {
        setting : {
          contextMenu : true,
          contextMenuHeight : 92,
          contextElement : [
            {
              name : 'Принять в работу',
              action : async function(row){
                this.$store.commit('setLoading',true);
                let result = await this.$store.dispatch('query',{url : '/api/vicarious/request/set-work',data : {id : row.id}});
                if(result.status == 'success') {
                  this.$store.commit('setMessage', {text: result.message, header: 'Успешно!', success: true});
                  await this.getData();
                }else
                  this.$store.commit('setMessage',{text : result.message,header : 'Возникла проблема!',error : true});
                this.$store.commit('setLoading',false);
              }.bind(this),
              show : function(row){
                //return this.showContextElement(row,'Заявка создана');
              }.bind(this)
            },{
              name : 'Отклонить заявку',
              action : async function(row){
                this.$store.commit('setLoading',true);
                let result = await this.$store.dispatch('query',{url : '/api/vicarious/request/set-reject', data : {id : row.id}});
                if(result.status == 'success') {
                  this.$store.commit('setMessage', {text: result.message, header: 'Успешно!', success: true});
                  await this.getData();
                }else
                  this.$store.commit('setMessage',{text : result.message,header : 'Возникла проблема!',error : true});
                this.$store.commit('setLoading',false);
              }.bind(this),
              show : function(row){
                //return this.showContextElement(row,'Заявка создана')
              }.bind(this)
            },{
              name : 'Редактировать',
              action : function(row){
                this.edit_element = row.id;
                this.$store.commit('setComponent','edit');
                this.$store.commit('setComponentParams',row.id);
              }.bind(this),
              show : function(row){
                //return this.showContextElement(row,'Принята в работу');
              }.bind(this)
            },{
              name : 'Сгенерировать документ<br />и завершить заявку',
              action : function(row){
                this.show_element = row.id;
                this.$store.commit('setComponent','show');
              }.bind(this),
              show : function(row){
                //return this.showContextElement(row,'Принята в работу');
              }.bind(this)
            },{
              name : 'Удалить',
              action : async function(row){
                this.$store.commit('setLoading',true);
                let result = await this.$store.dispatch('query',{url : '/api/vicarious/request/delete',data : {id : row.id}});
                if(result.status == 'success') {
                  this.$store.commit('setMessage',{text : result.message,header : 'Успешно!',success : true});
                  await this.getData();
                }else
                  this.$store.commit('setMessage',{text : result.message,header : 'Возникла проблема!',error : true});

                this.$store.commit('setLoading',false);
              }.bind(this),
              show : function(row){
                //return this.showContextElement(row,'Заявка отклонена');
              }.bind(this)
            },
          ],
          filter : {
            id : {
              type : 'Number',
              name : 'ID'
            },
            creator : {
              type : 'List',
              name : 'Заказчик',
              multiple : false,
              url : '/api/vicarious/user/search',
            }
          }
        },
        header: {
          'id'     : {
            text : 'ID',
            width : '60',
            group : ['column_1'],
          },
          'column'     : {
            text : 'Колонка',
            width : '160',
          },
          'column_1'     : {
            text : 'Привязанная колонка',
            width : '160',
          },

        },
        column : [
          {
            id : [
              {
                value : '1',
                column_1 : [
                  {value : 1},
                  {value : 2}
                ]
              }
            ],
            column : 1
          }
        ]
      },
      rowq : {
        setting : {
          contextMenu : true,
          contextElement : [
            {name : 'Пункт1', action : function(row){console.log('Пункт 1',row,this.main_menu,123)}.bind(this)},
            {name : 'Пункт2', action : function(){console.log('Пункт 2',this)}},
            {name : 'Пункт3', action : function(){console.log('Пункт 3')}},
          ]
        },
        header: {
          'id'     : {
            text : 'ID',
            width : '40',
          },
          'type'   : {
            text : 'Тип функции',
            width : '250',
            group : ['type_1','type_2'],
            filter : true
          },
          'type_1' : {
            text : 'Доп 1',
            width : '250',
            group : ['type_3'] ,
            filter : true
          },
          'type_2' : {
            text : 'Доп 2',
            width : '250',
            filter : true
          },
          'type_3' : {
            text : 'Доп 3',
            width : '250',
            filter : true,
            sort : true,
          },
          'id2'     : {
            text : 'ID2',
            width : '40',
          },
        },
        column : [{
          id : 1,
          id2 : 2,
          type : [
            {
              value : 'Тип 1',
              type_1 : [
                {
                  value : 'Тип 1 Доп 1-1',
                  type_3 : [
                    {value : 't(1)t_1(t_3)(1)'},
                    {value : 't(1)t_1(t_3)(2)'}
                  ]
                },
                {
                  value : 'Тип 1 Доп 1-2',
                  type_3 : [
                    {value : 't(1)t_1(t_3)(1)'},
                    {value : 't(1)t_1(t_3)(2)'}
                  ]
                }
              ],
              type_2 : [
                {value : 't(1)t_2(1)'},
                // {value : 't(1)t_2(2)'},
                // {value : 't(1)t_2(3)'},
                // {value : 't(1)t_2(4)'}
              ],
            },
            {
              value : 'Тип 2',
              type_1 : [
                {
                  value : 'Тип 2 Доп 1-1',
                  type_3 : [
                    {value : 't(1)t_1(t_3)(1)'},
                    {value : 't(1)t_1(t_3)(2)'}
                  ]
                },
                {
                  value : 'Тип 2 Доп 1-2',
                  type_3 : [
                    {value : 't(1)t_1(t_3)(1)'},
                    {value : 't(1)t_1(t_3)(2)'}
                  ]
                }
              ],
              type_2 : [
                {value : 't(2)t_2(1)'},
                {value : 't(2)t_2(2)'},
                {value : 't(2)t_2(3)'}
              ],
            }
          ]
        }]
      },

    };
  }
}
</script>
