import Vue from 'vue'
import Vuex from 'vuex'
import {
  BatchBasicModel, BatchItem, PathItemAtd, PathItemDta
} from '../interface'
import dataMap from '../plugins/dataMap'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    batchBasicModel: {} as BatchBasicModel,
    batches: [] as BatchItem[],
    pathsAtd: [] as PathItemAtd[],
    pathsDta: [] as PathItemDta[]
  },

  mutations: {
    setBatchBasicModelCommit (state, value) {
      state.batchBasicModel = value
    },

    setBatchesCommit (state, value) {
      state.batches = value
    },

    setPathsAtdCommit (state, value) {
      state.pathsAtd = value
    },

    setPathsDtaCommit (state, value) {
      state.pathsDta = value
    }
  },

  actions: {
    setBatchBasicModel (context, value) {
      context.commit('setBatchBasicModelCommit', value)
    },

    setBatches (context, value) {
      context.commit('setBatchesCommit', value)
    },

    setPathsAtd (context, value) {
      context.commit('setPathsAtdCommit', value)
    },

    setPathsDta (context, value) {
      context.commit('setPathsDtaCommit', value)
    }
  },

  getters: {
    batchBasicModel: state => [state.batchBasicModel],
    batches: state => state.batches.map((batch_) => {
      const batch = dataMap.batchTextToPlainData(batch_)
      return {
        batchno: batch.batchNo,
        arrialtime: batch.arrivalTime,
        arrivalnum: batch.arrivalNum,
        dropoff_no: batch.dropOffNo,
        stand_no: batch.standNo,
        security_no: batch.securityNo,
        sc_capacity: batch.scCapacity
      }
    }),
    pathsAtd: state => state.pathsAtd.map((path_) => {
      const path = dataMap.pathTextToPlainDataAtd(path_)
      return {
        area: path.area,
        name: path.name,
        destination: path.destination,
        path: path.path
      }
    }),
    pathsDta: state => state.pathsDta.map((path_) => {
      const path = dataMap.pathTextToPlainDataDta(path_)
      return {
        name: path.name,
        content: path.content,
        security_no: path.securityNo,
        areanumber: path.areaNumber,
        path: path.path
      }
    })
  },

  modules: {}
})
