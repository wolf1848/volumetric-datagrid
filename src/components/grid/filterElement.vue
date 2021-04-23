<template>
  <div class="filter_main" v-click-outside="onClickOutsideHideFliter">
    <div class="wrapper-label-filter">
        <div class="input-filter" @click="filterShow">
          <div
            v-for="(item, key) in filter.filter((t) => t.value.length > 0)"
            :key="item.id"
          >
            <span class="value-filter" v-if="key < 2 && item.value != ''">
              {{ item.name }} :
              {{ fvalue(item.value, item.name) }}
            </span>
          </div>
          <span class="value-filter" v-if="filtercount > 2">
            +{{ filtercount - 2 }}
          </span>
          <el-input class="bh filter_input" placeholder="Фильтр + поиск" @focus="filterShow"></el-input>
        </div>

    </div>

    <transition name="el-fade-in-linear">
      <div class="filter-wrapper" v-show="fshow">
        <div class="filter-row">
          <label class="label-filter">{{ 'ID' }}</label>
          <div class="filter-fields">
            <el-select v-model="changeInput" :class="'change-fields'">
              <el-option
                  v-for="(item,i) in change"
                  :key="i"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <el-input
                v-model="input"
                :placeholder="'ID'"
                :class="'change-value'"
            ></el-input>
            <el-input
                v-model="input"
                :placeholder="'ID'"
                :class="'change-value'"
            ></el-input>
            <el-button :class="'hide-fields'" icon="el-icon-close" @click="minus('ID')" />
          </div>
        </div>

        <el-row class="">
          <el-col :span="24" class="pt-2 pl-2 pr-2 pb-2">
            <div v-for="value in filter" :key="value.id" class="mb-1">
              <div v-if="value.type == 'select'">
                <el-row type="flex" :gutter="10">
                  <el-col :span="24">
                    <label class="lfilter">{{ value.name }}</label>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="21">
                    <el-select
                      v-model="value.value"
                      class="el_100"
                      empty="12"
                      filterable
                      multiple
                      :multiple-limit="10"
                      collapse-tags
                      remote
                      reserve-keyword
                      :placeholder="value.placeholder"
                    >
                      <el-option
                        v-for="item in value.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>

                      <span slot="empty">Label for the slot</span>
                    </el-select>
                  </el-col>
                  <el-col :span="3">
                    <el-button class="float_left ml-1" @click="minus(value.id)">
                      -
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="value.type == 'select_user_filter'">
                <el-row type="flex" :gutter="10">
                  <el-col :span="24">
                    <label class="lfilter">{{ value.name }}</label>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="21">
                    <el-select
                      v-model="value.value"
                      class="el_100"
                      empty="12"
                      filterable
                      @change="clearUserName"
                      ref="clearUserName"
                      multiple
                      autocomplete
                      default-first-option
                      :multiple-limit="5"
                      collapse-tags
                      :filter-method="user_filter"
                      remote
                      reserve-keyword
                      :placeholder="value.placeholder"
                      clearable
                    >
                      <el-option
                        v-for="item in value.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>

                      <span slot="empty">Пользователь не найден</span>
                    </el-select>
                  </el-col>
                  <el-col :span="3">
                    <el-button class="float_left ml-1" @click="minus(value.id)">
                      -
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="value.type == 'cascader'">
                <el-row type="flex" :gutter="10">
                  <el-col :span="24">
                    <label class="lfilter">{{ value.name }}</label>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="21">
                    <el-cascader
                      class="el_100"
                      v-model="value.value"
                      :options="value.options"
                      :props="{
                        multiple: true,
                        checkStrictly: true,
                        emitPath: false,
                      }"
                      :show-all-levels="false"
                      :placeholder="value.placeholder"
                      clearable
                      collapse-tags
                    ></el-cascader>
                  </el-col>
                  <el-col :span="3">
                    <el-button class="float_left ml-1" @click="minus(value.id)">
                      -
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="value.type == 'input'">
                <el-row>
                  <el-col :span="24">
                    <label class="lfilter">{{ value.name }}</label>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="21">
                    <el-input
                      v-model="value.value"
                      class="el_100"
                      :placeholder="value.placeholder"
                    ></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-button class="float_left ml-1" @click="minus(value.id)">
                      -
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row type="flex" :gutter="10" class="mt-1">
          <el-col :span="24">
            <el-button
              type="primary "
              class="float_right ml-1 mr-2 ui-btn-primary"
              @click="onSubmit"
              icon="el-icon-search"
            >
              Найти
            </el-button>

            <el-button class="float_right" @click="clear">Сбросить</el-button>
            <el-dropdown @command="plus" class="float_left ml-2">
              <el-button>+</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in filterhide"
                  :key="item.id"
                  :command="item.id"
                  :disabled="findindex(item.id)"
                >
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  props: ['isAdmin', 'contracts', 'userList'],
  data() {
    return {
      input : '',
      changeInput : 'Точно',
      change : [
        {
          value: 'Точно',
          label: 'Точно'
        },
        {
          value: 'Диапазон',
          label: 'Диапазон'
        }
      ],
      filter: [],
      filtercount: 0,
      uopt: [],
      fshow: false,
      filterhide: [
        {
          id: 1,
          value: '',
          name: 'ID',
          name_eng: 'id',
          type: 'input',
          placeholder: 'Введите ID',
        },
        {
          id: 2,
          value: '',
          name: 'Статус',
          name_eng: 'status',
          type: 'select',
          placeholder: 'Выберите статус',
          options: [
            { value: 'Подготовка', label: 'Подготовка' },
            { value: 'Согласование', label: 'Согласование' },
            { value: 'Утверждение', label: 'Утверждение' },
            { value: 'Утвержден', label: 'Утвержден' },
            { value: 'Выполнен', label: 'Выполнен' },
            { value: 'Аннулирован', label: 'Аннулирован' },
          ],
        },
        {
          id: 3,
          value: '',
          name: 'Мое участие',
          name_eng: 'role',
          type: 'select',
          placeholder: 'Выберите роль',
          options: [
            { value: 'Созданные мной', label: 'Созданные мной' },
            {
              value: 'Я согласующий',
              label: 'Я согласующий',
            },
            {
              value: 'Я подписант',
              label: 'Я подписант',
            },
            {
              value: 'Я адресат',
              label: 'Я адресат',
            },
            {
              value: 'Требуют моей реакции',
              label: 'Требуют моей реакции',
            },
          ],
        },
        {
          id: 4,
          value: '',
          name: 'Подразделение',
          name_eng: 'department',
          type: 'cascader',
          placeholder: 'Выберите подразделение',
          options: [],
        },
        {
          id: 5,
          value: '',
          name: 'Инициатор',
          name_eng: 'user',
          type: 'select_user_filter',
          placeholder: 'Выберите инициатора',
          options: [],
        },
      ],
    }
  },
  created: function () {
    let s = this

    if (!localStorage.filter || JSON.parse(localStorage.filter).length == 0)
      localStorage.filter = JSON.stringify([
        { id: 1, value: '' },
        { id: 2, value: '' },
        { id: 3, value: '' },
        { id: 4, value: '' },
        { id: 5, value: '' },
      ])

    let filter = JSON.parse(localStorage.filter)

    s.filter = filter.map(function (elem) {
      let e = s.filterhide.find((item) => elem.id == item.id)
      e.value = elem.value
      if (elem.options) e.options = elem.options
      return e
    })



  },
  methods: {
    clearUserName() {
      this.$refs.clearUserName[0].query = ''
    },
    user_filter(query) {
      if (query !== '') {
        setTimeout(() => {
          let uopt = []
          let index = this.filter.findIndex((item) => item.id == 5)

          uopt = Object.values(this.userList).filter((item) => {
            if (this.filter[index].value.indexOf(item.value) !== -1) return true
            if (item.label)
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })

          uopt = uopt.slice(0, 5)

          this.filter[index].options = uopt
        }, 100)
      }
    },
    fvalue(value, name) {
      let s = this
      if (name == 'Инициатор') {
        if (typeof value == 'object') {
          let newval = value.map((item) => {

          })

          value = newval.join(',')
        }
        if (value.length > 25) {
          value = value.substring(0, 25) + '...'
        }

        return value
      } else {
        if (typeof value == 'object') {
          value = value.join(',')
        }
        if (value.length > 25) {
          value = value.substring(0, 25) + '...'
        }

        return value
      }
    },
    onClickOutsideHideFliter() {
      this.fshow = false
    },
    filterShow() {
      this.fshow = true
    },
    findindex(id) {
      if (this.filter.findIndex((t) => t.id == id) > -1) return true
      else return false
    },
    plus(id) {
      let s = this
      //console.log(id)
      this.filter.push(this.filterhide.find((item) => item.id == id))


    },
    minus(id) {
      let key = this.filter.findIndex((item) => item.id == id)
      if (key != -1) {
        this.filter.splice(key, 1)
      }
    },
    clear() {
      let s = this
      let filter = this.filter
      let f = []

      filter.forEach((item, i) => {
        f.push({ id: item.id, value: '' })
        filter[i].value = ''
      })

      localStorage.filter = JSON.stringify(f)

      this.filter = filter

      this.fshow = false

    },
    onSubmit() {
      let s = this
      // запись фильтра в localStorage
      let f = []
      s.filter.forEach((item) => {
        f.push({
          id: item.id,
          value: item.value,
          options: item.options ? item.options : [],
        })
      })
      localStorage.filter = JSON.stringify(f)
      // запись фильтра в localStorage
      this.fshow = false

    },
  },
  watch: {
    filter: {
      deep: true,
      handler(filter) {
        if (filter.length > 0) {
          this.filtercount = 0
          filter.forEach((f) => {
            if (f.value != '') this.filtercount++
          })
        }
      },
    },
  },
}
</script>

<style>
.wrapper-label-filter{
  display: flex;
  width: 100%;
  align-items: center;
}
.wrapper-label-filter >div:last-child{
  display: flex;
  flex : 1 1 500px;
  height: 40px;
}
.input-filter {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
span.value-filter {
  background: #bcedfc;
  color: #6b6b6b;
  font-size: 15px;
  float: left;
  height: 32px;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 4px;
}
.filter-wrapper {
  overflow: hidden;
  left: 0px;
  top: 45px;
  padding: 20px;
  position: absolute;
  width: 580px;
  z-index: 10;
  background: #fff;
  box-shadow: 0 7px 21px rgb(83 92 105 / 12%), 0 -1px 6px 0 rgb(83 92 105 / 6%);
}
.label-filter {
  text-align: left;
  line-height: 40px;
  padding: 0 12px 0 0;
  color: #a9adb2;
  display: inline-block;
  width: 100%;
  font: 13px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}
.filter-fields{
  display: flex !important;
  margin-bottom: 10px;
}
.change-fields{
  display: flex !important;
  flex: 1 1 160px;
  padding-right: 10px;
  min-width: 160px;

}
.change-value{
  display: flex !important;
  flex: 1 1 100%;
  padding-right: 10px;
}
.hide-fields{
  display: flex !important;
  flex: 1 1 40px;
  padding: 12px !important;
}






.filter_main {
  position: relative;
  display: flex;
  flex : 1 1 500px;
}
.float_right {
  float: right;
}
.float_left {
  float: left;
}
.bh input {
  border: none !important;
}
.el_100 {
  width: 100%;
}
.el_70 {
  width: 80%;
}
.fctitle {
  padding: 10px 0;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 700;
  color: #828888;
}

.f_name {
  font-weight: 700;
  height: 40px;
  vertical-align: middle;
  display: table-cell;
  padding-left: 16px;
  color: #4a4a4a;
}

.fconfig {
  background: #f8fafb;
  border-right: 1px solid #e7eaec;
  width: 214px;
}

.fconfig:after {
  position: absolute;
  left: 0;
  width: 214px;
  height: 10000px;
  border-right: 1px solid #e7eaec;
  background: #f8fafb;
  content: '';
}

.ui-btn-primary {
  background: #3bc8f5 !important;
  border: 1px solid #3bc8f5;
}

.filter_input {
  font-size: 14px;
  display: flex;
  width: auto;
  height: 40px;
}

.filter_main .el-tag.el-tag--info {
  background: #bcedfc !important;
}
.el-select-dropdown__item.selected {
  color: #4ac2e6 !important;
}
.filter_main .el-input__inner:focus,
.filter_main .el-select .el-input.is-focus .el-input__inner {
  border-color: #4ac2e6 !important;
  outline: 0;
}
</style>
