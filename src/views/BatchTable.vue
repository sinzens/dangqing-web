<template>
  <v-container>
    <v-row>
      <v-col>
        <data-table
          sourceTable="batch"
          :headers="headers"
          :items="batches"
          :editedItemModel="editedItemModel"
          :defaultItemModel="defaultItemModel"
          sortBy="batchNo"
        ></data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { BatchItem, DataHeader } from '../interface'
import dataMap from '../plugins/dataMap'
import dataTable from '../components/DataTable.vue'

export default Vue.extend({
  name: 'BatchTable',
  components: { dataTable },

  data: () => ({
    headers: [
      {
        text: '波次编号',
        align: 'start',
        value: 'batchNo'
      },
      { text: '到达时间 (min)', value: 'arrivalTime' },
      { text: '到达人数', value: 'arrivalNum' },
      { text: '落客点', value: 'dropOffNo' },
      { text: '看台区域编号', value: 'standNo' },
      { text: '安检点', value: 'securityNo' },
      { text: '安检点最大承载人数', value: 'scCapacity' },
      { text: '操作', value: 'actions', sortable: false }
    ] as DataHeader[],

    batches: [] as BatchItem[],

    editedItemModel: {
      batchNo: '',
      arrivalTime: '0',
      arrivalNum: '0',
      dropOffNo: '0',
      standNo: dataMap.standMap['01'],
      securityNo: dataMap.securityMap['01'],
      scCapacity: '0'
    } as BatchItem,
    defaultItemModel: {
      batchNo: '01',
      arrivalTime: '0',
      arrivalNum: '0',
      dropOffNo: '0',
      standNo: dataMap.standMap['01'],
      securityNo: dataMap.securityMap['01'],
      scCapacity: '0'
    } as BatchItem
  }),

  methods: {
    initialize () {
      this.getBatchesFromDb()
    },

    getBatchesFromDb () {
      this.$socket.socketSend('cmd|getBatches', (result) => {
        this.batches = result as BatchItem[]
        this.batches.forEach((value) => {
          Object.assign(value, dataMap.batchPlainDataToText(value))
        })
      })
    }
  },

  watch: {
    batches (value) {
      this.$store.dispatch('setBatches', value)
    }
  },

  created () {
    this.initialize()
  }
})
</script>
