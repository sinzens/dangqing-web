<template>
  <v-container>
    <v-row>
      <v-col>
        <data-table
          sourceTable="dtaPath"
          :headers="headers"
          :items="paths"
          :editedItemModel="editedItemModel"
          :defaultItemModel="defaultItemModel"
          sortBy="name"
        ></data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { PathItemDta, DataHeader } from '../interface'
import dataTable from '../components/DataTable.vue'
import dataMap from '../plugins/dataMap'

export default Vue.extend({
  name: 'DtaPathTable',
  components: { dataTable },

  data: () => ({
    headers: [
      {
        text: '路径名',
        align: 'start',
        value: 'name'
      },
      { text: '详细解释', value: 'content' },
      { text: '安检点', value: 'securityNo' },
      { text: '看台区域号', value: 'areaNumber' },
      { text: '路径', value: 'path' },
      { text: '操作', value: 'actions', sortable: false }
    ] as DataHeader[],

    paths: [] as PathItemDta[],

    editedItemModel: {
      name: '',
      content: '',
      securityNo: '01',
      areaNumber: '1',
      path: '0'
    } as PathItemDta,
    defaultItemModel: {
      name: '',
      content: '',
      securityNo: '01',
      areaNumber: '1',
      path: '0'
    } as PathItemDta
  }),

  methods: {
    initialize () {
      this.getPathsFromDb()
    },

    getPathsFromDb () {
      this.$socket.socketSend('cmd|getPathsDta', (result) => {
        this.paths = result as PathItemDta[]
        this.paths.forEach((value) => {
          Object.assign(value, dataMap.pathPlainDataToTextDta(value))
        })
      })
    }
  },

  created () {
    this.initialize()
  }
})
</script>
