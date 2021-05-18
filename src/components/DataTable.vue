<template>
  <v-data-table
    :loading-text="loadingText"
    :no-data-text="noDataText"
    :no-results-text="noResultsText"
    :headers="headers"
    :items="items"
    :items-per-page="10"
    :sort-by="sortBy"
    :search="search"
    :custom-filter="comprehensiveFilter"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-select
          class="mr-4"
          v-model="searchedAttr"
          :no-data-text="noDataText"
          :items="attrNames"
          :label="selectSearchedAttrText"
        ></v-select>
        <v-select
          class="mr-4"
          v-model="searchRule"
          :no-data-text="noDataText"
          :items="Object.values(searchRules)"
          :label="selectSearchedAttrRuleText"
        ></v-select>
        <v-text-field
          class="mr-4"
          v-model="search"
          :label="searchText"
        ></v-text-field>
        <v-spacer />
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              v-text="newItemText"
            ></v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4" v-for="attr in Object.keys(editedItem)" :key="attr">
                    <v-select
                      v-model="editedItem[attr]"
                      :no-data-text="noDataText"
                      :items="standNames"
                      :label="dialogInputLabel(attr)"
                      v-if="attr === 'dropOffNo' || attr === 'area'"
                    ></v-select>
                    <v-select
                      v-model="editedItem[attr]"
                      :no-data-text="noDataText"
                      :items="securityNames"
                      :label="dialogInputLabel(attr)"
                      v-else-if="attr === 'securityNo' || attr === 'destination'"
                    ></v-select>
                    <v-select
                      v-model="editedItem[attr]"
                      :no-data-text="noDataText"
                      :items="areaNumbers"
                      :label="dialogInputLabel(attr)"
                      v-else-if="attr === 'areaNumber' || attr === 'standNo'"
                    ></v-select>
                    <v-text-field
                      v-model="editedItem[attr]"
                      :label="dialogInputLabel(attr)"
                      v-else
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text v-text="cancelText" @click="close" />
              <v-btn color="blue darken-1" text v-text="saveText" @click="save" />
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--  -->
        <v-dialog v-model="dialogDelete" max-width="300px">
          <v-card>
            <v-card-title class="headline" v-text="deleteConfirmText" />
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text v-text="cancelText" @click="closeDelete" />
              <v-btn color="blue darken-1" text v-text="confirmText" @click="deleteItemConfirm" />
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" v-text="'mdi-pencil'" @click="editItem(item)" />
      <v-icon small v-text="'mdi-delete'" @click="deleteItem(item)" />
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" v-text="resetText" @click="initialize" />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import Public from '../plugins/public'
import { BatchItem, PathItemAtd, PathItemDta, DataHeader } from '../interface'
import dataMap from '../plugins/dataMap'

export default Vue.extend({
  name: 'DataTable',

  props: {
    sourceTable: String,
    headers: Array,
    items: Array,
    editedItemModel: Object,
    defaultItemModel: Object,
    sortBy: String
  },

  data: () => ({
    loadingText: '正在读取数据',
    noDataText: '没有任何数据',
    noResultsText: '没有匹配的结果',
    newItemText: '新增数据项',
    dialogNewItemText: '新增数据',
    dialogEditItemText: '修改数据',

    cancelText: '取消',
    saveText: '保存',
    confirmText: '确定',
    resetText: '恢复',
    deleteConfirmText: '确定要删除此项吗',

    selectSearchedAttrText: '字段',
    selectSearchedAttrRuleText: '规则',
    searchText: '值',

    dialog: false,
    dialogDelete: false,

    editedIndex: -1,

    editedItem: {},
    defaultItem: {},

    search: '',
    searchedAttr: '',
    searchRule: '等于',
    searchRules: ['小于', '等于', '大于', '小于等于', '大于等于']
  }),

  methods: {
    initialize () {
      this.editedItem = this.editedItemModel
      this.defaultItem = this.defaultItemModel
    },

    editItem (item: unknown) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item: unknown) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      const deleted = this.items.splice(this.editedIndex, 1)[0]
      const deletedData = this.textToPlainData(deleted)
      this.deleteItemToDb(deletedData)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      const editedData = this.textToPlainData(this.editedItem)
      const beforeData = this.textToPlainData(this.items[this.editedIndex])
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
        this.updateItemToDb(editedData, beforeData)
      } else {
        this.items.push(this.editedItem)
        this.insertItemToDb(editedData)
      }
      this.close()
    },

    insertItemToDb (item: unknown) {
      const jsonData = JSON.stringify(item)
      this.$socket.socketSend(`cmd|insertItem|${this.sourceTable}|${jsonData}`)
    },

    deleteItemToDb (item: unknown) {
      const jsonData = JSON.stringify(item)
      this.$socket.socketSend(`cmd|deleteItem|${this.sourceTable}|${jsonData}`)
    },

    updateItemToDb (item: unknown, itemBefore: unknown) {
      const jsonData = JSON.stringify(item)
      const jsonDataBefore = JSON.stringify(itemBefore)
      this.$socket.socketSend(
        `cmd|updateItem|${this.sourceTable}|${jsonData}|${jsonDataBefore}`
      )
    },

    textToPlainData (item: unknown) {
      switch (this.sourceTable) {
        case 'batch': return dataMap.batchTextToPlainData(item as BatchItem)
        case 'atdPath': return dataMap.pathTextToPlainDataAtd(item as PathItemAtd)
        case 'dtaPath': return dataMap.pathTextToPlainDataDta(item as PathItemDta)
        default: return {}
      }
    },

    comprehensiveFilter (
      _value: unknown,
      search: string,
      item: Record<string, string>
    ) {
      const header = (this.headers as DataHeader[])
        .find((header: DataHeader) => header.text === this.searchedAttr)
      if (header) {
        const attr = header.value
        const itemValue = item[attr]
        switch (this.searchRule) {
          case '小于': return search > itemValue
          case '等于': return search === itemValue
          case '大于': return search < itemValue
          case '小于等于': return search >= itemValue
          case '大于等于': return search <= itemValue
          default: return true
        }
      } else {
        return false
      }
    }
  },

  computed: {
    formTitle (): string {
      return this.editedIndex === -1 ? this.dialogNewItemText : this.dialogEditItemText
    },

    dialogInputLabel () {
      return (attr: string) => {
        const header = (this.headers as DataHeader[])
          .find((header: DataHeader) => header.value === attr)
        return header?.text || ''
      }
    },

    standNames () {
      return Object.keys(dataMap.standMapInverted || {})
    },

    securityNames () {
      return Object.keys(dataMap.securityMapInverted || {})
    },

    areaNumbers () {
      return Public.numberArrayFromRange(1, 48)
    },

    attrNames () {
      return (this.headers as DataHeader[])
        .filter((header) => {
          return header.value !== 'actions'
        }).map((header) => {
          return header.text
        })
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  created () {
    this.initialize()
  }
})
</script>
