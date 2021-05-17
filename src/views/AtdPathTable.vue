<template>
  <v-container>
    <v-row>
      <v-col>
        <data-table
          sourceTable="atdPath"
          :headers="headers"
          :items="paths"
          :editedItemModel="editedItemModel"
          :defaultItemModel="defaultItemModel"
          sortBy="area"
        ></data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { PathItemAtd, DataHeader } from '../interface'
import dataTable from '../components/DataTable.vue'
import dataMap from '../plugins/dataMap'

export default Vue.extend({
  name: 'AtdPathTable',
  components: { dataTable },

  data: () => ({
    headers: [
      {
        text: '落客点',
        align: 'start',
        value: 'area'
      },
      { text: '详细解释', value: 'name' },
      { text: '安检点', value: 'destination' },
      { text: '路径', value: 'path' },
      { text: '操作', value: 'actions', sortable: false }
    ] as DataHeader[],

    paths: [] as PathItemAtd[],

    editedItemModel: {
      area: '',
      name: '',
      destination: '01',
      path: '0'
    } as PathItemAtd,
    defaultItemModel: {
      area: '01',
      name: '',
      destination: '01',
      path: '0'
    } as PathItemAtd
  }),

  methods: {
    initialize () {
      this.getPathsFromDb()
    },

    getPathsFromDb () {
      this.$socket.socketSend('cmd|getPathsAtd', (result) => {
        this.paths = result as PathItemAtd[]
        this.paths.forEach((value) => {
          Object.assign(value, dataMap.pathPlainDataToTextAtd(value))
        })
      })
    }
  },

  created () {
    this.initialize()
  }
})
</script>
