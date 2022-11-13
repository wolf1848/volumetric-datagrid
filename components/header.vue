<script>
import {inject, nextTick, h, Fragment, resolveComponent} from "vue";

export default {
  name : 'HeaderRow',
  props : ['name'],
  setup(props){
    let grid = inject(props.name);
    return {grid}
  },
  render() {

      let icon = [
          h(
              resolveComponent('el-icon'),
              {
                  onClick : $event => {this.dialogVisible = true}
              },
              () => this.grid.setting.customizable ? h(resolveComponent('tools')) : ''

          ),
          //вертикальная палочка
          h('div', {class : 'vdg_rowHeader_columnHeader_handle'})
      ]

    return h(
        Fragment,
        null,
        [
            // Формирование шапки обертка
            h(
                'div',
                {
                  class : ['vdg_rowHeader', this.name],
                  style : {
                    'grid-template-columns' : this.grid.system.gtc
                  }
                },
                // Формирование колонок шапки из видимых сортированых элементов

                this.grid.system.columnKey.map(el => {
                    return h(
                        'div',
                        {
                          class : ['vdg_rowHeader_columnHeader',el],
                          ref : 'drag_'+ el,
                          onMousedown : $event => this.onDragStart($event,el),
                        },
                        (() => {
                          if(el == 'icon'){
                            return icon;
                          }else{
                            return [
                              h(
                                  resolveComponent('el-tooltip'),
                                  {
                                    content : this.grid.header[el].name,
                                    disabled : this.tooltip(el),
                                    placement : "bottom",
                                    effect : "dark"
                                  },
                                  () => [
                                      h(
                                      'span',
                                      {
                                        ref : 'tooltip_' + el,
                                        class : 'vdg_rowHeader_span'
                                      },
                                          (() => {
                                        let child = [];
                                        child.push(this.grid.header[el].name);

                                        if(this.grid.header[el].sortable){
                                            let caret = 'CaretTop', color = '#a8abb2';
                                            if(this.grid.system.sort.field == el ){
                                                color = '#000000'
                                                if(this.grid.system.sort.direction == 'desc')
                                                    caret = 'CaretBottom';
                                            }
                                            child.push(
                                                h(
                                                    resolveComponent('el-icon'),
                                                    () => h(resolveComponent(caret), {
                                                            class: 'vdg_rowHeader_iconSort',
                                                            style : {
                                                                color : color
                                                            },
                                                            onClick: () => {
                                                                if(this.grid.system.sort.field == el)
                                                                    this.grid.system.sort.direction = this.grid.system.sort.direction == 'asc' ? 'desc' : 'asc';
                                                                else {
                                                                    this.grid.system.sort.direction = 'asc'
                                                                    this.grid.system.sort.field = el;
                                                                }
                                                                if(this.grid.localSort){
                                                                    console.log('Локальная сортировка работает только по числам и в рамках объекта с одним значением. Дописать когда ни будь сортировки по вложенным объектам и другим типам данных.');
                                                                    this.grid.elements.sort((a,b) => {
                                                                        if(this.grid.system.sort.direction == 'asc')
                                                                            return a[el][0].value - b[el][0].value;
                                                                        else
                                                                            return b[el][0].value - a[el][0].value
                                                                    })
                                                                }else{
                                                                    this.grid.$action.loader(this.grid.name);
                                                                    this.grid.$action.start(this.grid);
                                                                }
                                                            }
                                                        }
                                                    )
                                                )
                                            );
                                        }
                                        return child;
                                      })()
                                      ),
                                  ]
                              ),
                              h(
                                  'div',
                                  {
                                    class : 'vdg_rowHeader_columnHeader_handle',
                                    onMousedown: $event => this.onResizeStart($event,el),
                                  }
                              )
                            ]
                          }
                        })()
                    )
                })
            ),
          // Формируем скроллбар
          h(
            resolveComponent('el-scrollbar'),
            {
              class : 'vdg_rowHeader_scrollbar',
              ref : 'scrollBarGrid',
              always : true,
              onScroll : $event => this.scrollEvent($event)
            },
            () => [h(
                'div',
                {
                  style : {
                    width : this.grid.system.scrollWidth + 'px',
                    height : '10px'
                  },
                },
                ''
            )]
          ),
          // Диалоговое окно для отключения показа элементов
          h(
            resolveComponent('el-dialog'),
            {
              class : 'vdg_showFieldsModal',
              'model-value' : this.dialogVisible,
              'onUpdate:modelValue': value => {this.dialogVisible = value},
              title : "Настройка списка",
              width : '30%'
            },
            () => [h(
                resolveComponent('el-scrollbar'),
                {
                  height : '400px',
                  class : 'vdg_showFieldsModal_scroll'
                },
                () => {return this.grid.system.columnShow.map(el => {
                  return h(
                      resolveComponent('el-checkbox'),
                      {
                        class : 'vdg_showFieldsModal_item',
                        'model-value' : this.grid.header[el].show,
                        'onUpdate:modelValue': value => {
                          this.grid.header[el].show = value;
                          this.$nextTick(() => {
                              this.$refs['scrollBarGrid'].update();
                              this.grid.$action.saveGrid();
                          });
                        },
                        label : this.grid.header[el].name,
                        size : 'large'
                      },
                      ''
                  )
                })}
            )]
          )
        ]
    );
  },
  mounted() {
    // обработка изменения размера и перемещения колонки
    document.addEventListener('mousemove',async (e) => {
      if(this.resize.key){
        let width = this.resize.width + (e.clientX - this.resize.start);
        this.grid.header[this.resize.key].width = width < 80 ? 80 : width;
      }
      if(this.drag.start){
        let node = document.querySelector('.vdg_rowHeader_dragActiveElement'),
        dragLeft = e.clientX - this.drag.width,
        sort = null,
        updateKey = null;
        if(node)
          node.style.left = dragLeft + 'px';

        if(this.drag.move.back && (this.drag.move.back.rect.x + (this.drag.move.back.rect.width / 2)) > e.clientX)
          updateKey = 'back';

        if(this.drag.move.next && (this.drag.move.next.rect.x + (this.drag.move.next.rect.width / 2)) < e.clientX)
          updateKey = 'next';

        if(updateKey){
          sort = this.grid.header[this.drag.name].sort;
          this.grid.header[this.drag.name].sort = this.grid.header[this.drag.move[updateKey].key].sort;
          this.grid.header[this.drag.move[updateKey].key].sort = sort;
          await nextTick();
          this.dragGetData();
        }
      }
    })
    // Старт изменения размера и перемещения колонки
    document.addEventListener('mouseup',() => {
      if(this.drag.start){
        this.drag.start = false;
        this.drag.width = 0;
        if(document.querySelector('.vdg_rowHeader_dragActiveElement')) {
          document.querySelector('.vdg_rowHeader_dragActiveElement').remove();
          this.grid.$action.saveGrid();
        }
      }
      if(this.resize.key){
        this.$refs['scrollBarGrid'].update();
        this.resize.key = null;
        this.grid.$action.saveGrid();
      }
    })
  },
  data : () => {
    return{
      resize : {
        start : 0,
        move : 0,
        width : 0,
        key : null
      },
      drag : {
        name  : null,
        start : false,
        width : 0,
        move : {
          back : null,
          this : null,
          next : null,
        }
      },
      dialogVisible : false
    }
  },
  methods : {
    onResizeStart (e,el){
      e.preventDefault();
      this.resize.key = el;
      this.resize.start = e.clientX;
      this.resize.width = this.grid.header[el].width;
    },
    dragGetData(){
      let startIndex = this.grid.system.columnKey.indexOf(this.drag.name);
      this.drag.move.this = {};
      this.drag.move.this.key = this.grid.system.columnKey[startIndex];
      this.drag.move.this.rect = this.$refs['drag_' + this.drag.move.this.key].getBoundingClientRect();

      if(startIndex === 0)
        this.drag.move.back = null
      else{
        this.drag.move.back = {};
        this.drag.move.back.key = this.grid.system.columnKey[startIndex - 1];
        this.drag.move.back.rect = this.$refs['drag_' + this.drag.move.back.key].getBoundingClientRect();
      }

      startIndex++;

      if(startIndex === this.grid.system.columnKey.length)
        this.drag.move.next = null
      else{
        this.drag.move.next = {};
        this.drag.move.next.key = this.grid.system.columnKey[startIndex];
        this.drag.move.next.rect = this.$refs['drag_' + this.drag.move.next.key].getBoundingClientRect();
      }
    },
    tooltip(item){
      let flag = true;
      if(this.$refs['tooltip_' + item]){
        if(this.$refs['tooltip_' + item].clientWidth < this.$refs['tooltip_' + item].scrollWidth)
          flag = false
      }
      return flag;
    },
    scrollEvent({scrollLeft}){
      let header = document.querySelector('.vdg_rowHeader.' + this.name);
      header.scrollLeft = scrollLeft;

      let content = document.querySelector('.vdg_contentWrapper.' + this.name);
      content.style.clipPath = 'inset(0 ' + (this.grid.system.scrollWidth - header.clientWidth - scrollLeft + 15) + 'px 0 '+scrollLeft+'px)';
      content.style.left = -scrollLeft+'px';
      content.style.width = this.grid.system.scrollWidth+'px';
    },
    onDragStart(e,item){
      e.preventDefault();
      if(!this.resize.key)
        this.drag.start = true;
      setTimeout(() => {
        if (this.drag.start){
          let node = document.createElement('div');
          this.drag.name = item;
          this.dragGetData();
          this.drag.width = (this.grid.header[item].width / 2);
          node.classList.add('vdg_rowHeader_dragActiveElement', 'vdg_rowHeader_columnHeader');
          node.append(this.grid.header[item].name)
          node.style.left = (e.clientX - this.drag.width) + 'px';
          node.style.top = this.drag.move.this.rect.y + 'px';
          node.style.width = this.grid.header[item].width + 'px';
          document.body.append(node);
        }
      },200)
    },
  }
}
</script>
