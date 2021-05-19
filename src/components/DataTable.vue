<template>
  <v-container>
    <v-row>
      <v-col>
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
              <v-dialog v-model="dialog" max-width="600px">
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
                          <v-combobox
                            v-model="editedItem[attr]"
                            :no-data-text="noDataText"
                            :items="$store.getters.predefinedPaths"
                            :label="dialogInputLabel(attr)"
                            v-else-if="attr === 'path'"
                          ></v-combobox>
                          <v-text-field
                            v-model="editedItem[attr]"
                            :label="dialogInputLabel(attr)"
                            v-else
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-alert
                      border="bottom"
                      colored-border
                      type="error"
                      elevation="2"
                      v-show="editedInvalid"
                    >{{ editInvalidText }}</v-alert>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text v-text="cancelText" @click="close" />
                    <v-btn color="blue darken-1" text v-text="saveText" @click="save" />
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :loading-text="loadingText"
          :no-data-text="noDataText"
          :headers="backupHeaders"
          :items="backups"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              small
              class="mr-2"
              v-text="'mdi-backup-restore'"
              @click="restoreFromBackups(item)"
            ></v-icon>
            <v-icon
              small
              class="mr-2"
              v-text="'mdi-delete'"
              @click="deleteBackupItem(item)"
            ></v-icon>
            <v-icon
              small
              v-text="'mdi-eye'"
              @click.stop="showBackup(item)"
            ></v-icon>
            <v-dialog
              v-model="showBackupPreviewDialog"
              :retain-focus="false"
              max-width="60%"
            >
              <v-card>
                <v-card-title class="headline" v-text="backupDialogTitle" />
                <v-card-text>
                  {{ backupViewerIdentifier }}
                  <v-data-table
                    :loading-text="loadingText"
                    :no-data-text="noDataText"
                    :headers="backupViewerHeaders"
                    :items="backupViewerItems"
                    :sort-by="sortBy"
                  ></v-data-table>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="primary"
                    text
                    v-text="confirmText"
                    @click.stop="showBackupPreviewDialog = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Public from '../plugins/public'
import {
  BatchItem,
  PathItemAtd,
  PathItemDta,
  DataHeader,
  DataBackup,
  TableDataBackup,
  PathItemAtdDb
} from '../interface'
import dataMap from '../plugins/dataMap'

export default Vue.extend({
  name: 'DataTable',

  model: {
    prop: 'items',
    event: 'itemsChanged'
  },

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

    backupTitle: '备份记录',
    backupDialogTitle: '备份数据预览',

    cancelText: '取消',
    saveText: '保存',
    confirmText: '确定',
    resetText: '恢复',
    deleteConfirmText: '确定要删除此项吗',

    selectSearchedAttrText: '字段',
    selectSearchedAttrRuleText: '规则',
    searchText: '值',

    editInvalidText: '',

    dialog: false,
    dialogDelete: false,
    showBackupPreviewDialog: false,
    editedInvalid: false,

    editedIndex: -1,

    editedItem: {},
    defaultItem: {},

    search: '',
    searchedAttr: '',
    searchRule: '等于',
    searchRules: ['小于', '等于', '大于', '小于等于', '大于等于'],

    backups: [] as DataBackup[],
    backupViewerItems: [] as unknown[],
    backupViewerIdentifier: '',
    backupHeaders: [
      {
        text: '记录产生时间',
        align: 'start',
        value: 'identifier'
      },
      { text: '操作', value: 'actions', sortable: false }
    ] as DataHeader[]
  }),

  methods: {
    initialize () {
      this.editedItem = this.editedItemModel
      this.defaultItem = this.defaultItemModel
      const backups = this.getBackups()
      if (backups.length !== 0) {
        this.backups = backups
      }
    },

    getBackups (): DataBackup[] {
      if (
        Object.prototype.hasOwnProperty.call(
          this.$store.getters.backups,
          this.sourceTable
        )
      ) {
        return [].concat(this.$store.getters.backups[this.sourceTable])
      } else {
        return []
      }
    },

    addBackup (oldItems_: unknown[]) {
      const oldItems = JSON.parse(JSON.stringify(oldItems_))
      this.backups.push({
        identifier: new Date().toString(),
        data: oldItems
      })
    },

    showBackup (item: DataBackup) {
      this.backupViewerIdentifier = item.identifier
      this.backupViewerItems = item.data
      this.showBackupPreviewDialog = true
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
      this.addBackup(this.items)
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
      const valid = this.checkEditValid(editedData)
      this.editedInvalid = !valid

      if (this.checkEditValid(editedData)) {
        this.addBackup(this.items)
        if (this.editedIndex > -1) {
          Object.assign(this.items[this.editedIndex], this.editedItem)
          this.updateItemToDb(editedData, beforeData)
        } else {
          this.items.push(this.editedItem)
          this.insertItemToDb(editedData)
        }
        this.close()
      }
    },

    insertItemToDb (item: unknown) {
      const jsonData = JSON.stringify(item)
      this.$socket.socketSend(
        `cmd|insertItem|${this.sourceTable}|${jsonData}`
      )
    },

    deleteItemToDb (item: unknown) {
      const jsonData = JSON.stringify(item)
      this.$socket.socketSend(
        `cmd|deleteItem|${this.sourceTable}|${jsonData}`
      )
    },

    updateItemToDb (item: unknown, itemBefore: unknown) {
      const jsonData = JSON.stringify(item)
      const jsonDataBefore = JSON.stringify(itemBefore)
      this.$socket.socketSend(
        `cmd|updateItem|${this.sourceTable}|${jsonData}|${jsonDataBefore}`
      )
    },

    restoreFromBackupsToDb (backups: unknown[]) {
      const jsonData = JSON.stringify(backups)
      this.$socket.socketSend(
        `cmd|restoreFromBackups|${this.sourceTable}|${jsonData}`
      )
    },

    deleteBackupItem (item: DataBackup) {
      const index = this.backups.indexOf(item)
      this.backups.splice(index, 1)
    },

    restoreFromBackups (item: DataBackup) {
      const backups = item.data
      const backupsData = backups.map((backupItem) => {
        return this.textToPlainData(backupItem)
      })
      this.$emit('itemsChanged', ([] as unknown[]).concat(backups))
      this.restoreFromBackupsToDb(backupsData)
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
    },

    checkEditValid (item_: unknown) {
      switch (this.sourceTable) {
        case 'batch': {
          const item = item_ as BatchItem
          const index = (this.$store.getters.pathsAtd as PathItemAtdDb[])
            .findIndex((path) => {
              return (
                item.dropOffNo === path.area &&
                item.securityNo === path.destination
              )
            })
          if (index === -1) {
            this.editInvalidText = '落客点与安检点不在"落客到安检数据表"中, 数据库禁止插入'
          }
          return index !== -1
        }
        default: return true
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
    },

    backupViewerHeaders () {
      const headers = [...(this.headers as DataHeader[])]
      const actionIndex = headers.findIndex((value) => {
        return value.value === 'actions'
      })
      if (actionIndex !== -1) {
        headers.splice(actionIndex, 1)
      }
      return headers
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },

    backups: {
      handler (value) {
        this.$store.dispatch('setBackups', {
          sourceTable: this.sourceTable,
          backup: value
        } as TableDataBackup)
      },
      deep: true
    }
  },

  created () {
    this.initialize()
  }
})
</script>
