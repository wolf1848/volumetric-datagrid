<script>
import Column from "@/vdg3/components/column";
import HeaderRow from "@/vdg3/components/header";
import Filterable from "@/vdg3/components/filterable";
import {h, Teleport, inject, resolveComponent} from "vue";

export default {
  components: {Column,HeaderRow, Filterable},
  name : 'Grid',
  props : ['name'],
  setup(props){
    let grid = inject(props.name);
    grid.name = props.name;

    grid.$action.start(grid)

    return {grid}
  },

  render(){

    let pagination = h(
        resolveComponent('el-pagination'),
        {
          total: this.grid.pagination.total,
          layout: this.grid.pagination.layout.join(','),
          pagerCount: this.grid.pagination.pager,
          currentPage: this.grid.pagination.page,
          'onUpdate:currentPage': value => {
            this.grid.pagination.page = value;
            this.grid.$action.changePage()
          },
          pageSize: this.grid.pagination.size,
          'onUpdate:pageSize': value => {
            this.grid.pagination.size = value;
            this.grid.$action.resizePage()
          },
          pageSizes: this.grid.pagination.sizes
        }
    )

    return h(
        "div",
        {
            id : "grid-wrap-"+this.name
        },
        [

            h('div',{class : ['vdg_paginationWrapper', this.name]},[
              h(Filterable, {name : this.name}),
              (this.grid.pagination.show == 'full' || this.grid.pagination.show == 'top') ? pagination : null,

              // (() => {
              //       if (this.grid.pagination.show == 'full' || this.grid.pagination.show == 'top')
              //         return pagination;
              //     })()


              ]
            ),

          h(HeaderRow,{name : this.name}),

          h(Column,{name : this.name}),

          // Формирует контекстное меню если есть меню элемента берет его если нет общее
          this.grid.system.context.show ? h(
              Teleport,
              {to : "body"},
              h(
                  'div',
                  {
                    class : ['vdg_contextMenuWrapper',this.name],
                    style : {
                      top : this.grid.system.context.top + 'px',
                      left : this.grid.system.context.left + 'px',
                    },
                  },
                  this.grid.system.context.row.context ? this.grid.system.context.row.context.map(el => {
                        return h(
                            'div',
                            {
                              class : 'vdg_contextMenuWrapper_item',
                               onClick : $event => {
                                 el.function($event,this.grid.system.context,this.grid)
                                 this.grid.system.context.show = false;
                               }
                            },
                            el.text
                        )
                   }) : this.grid.context.map(el => {
                    return h(
                        'div',
                        {
                          class : 'vdg_contextMenuWrapper_item',
                          onClick : $event => {
                            el.function($event,this.grid.system.context,this.grid)
                            this.grid.system.context.show = false;
                          }
                        },
                        el.text
                    )
                  })
              )
          ) : '',

          h('div',{class : ['vdg_paginationWrapper', this.name]},[
               (this.grid.pagination.show == 'full' || this.grid.pagination.show == 'bottom') ? pagination : null,
                // (() => {
                //   if (this.grid.pagination.show == 'full' || this.grid.pagination.show == 'bottom')
                //     return pagination
                // })()
              ]
          ),
        ]
    )
  },
  mounted() {
    this.grid.$action.loader(this.name);
  }

};

</script>
