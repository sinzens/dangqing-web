<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row>
          <v-select
            v-model="selectedBatches"
            :items="batchItems"
            :label="selectBatchLabel"
            clearable
            multiple
          >
            <template slot="append-outer">
                <v-btn
                  color="primary"
                  class="mr-2"
                  v-text="selectAllBatchesButtonText"
                  @click="selectAllBatches"
                ></v-btn>
                <v-btn
                  color="primary"
                  class="mr-2"
                  v-text="selectInvertBatchesButtonText"
                  @click="selectInvertBatches"
                ></v-btn>
                <v-btn
                  color="primary"
                  v-text="deselectAllBatchesButtonText"
                  @click="deselectAllBatches"
                ></v-btn>
            </template>
          </v-select>
        </v-row>
        <v-row>
          <v-text-field
            v-model="initialSpeed.value"
            :label="initialSpeed.label"
            :rules="speedRules"
          />
        </v-row>
        <v-row>
          <v-text-field
            v-model="preferredSpeed.value"
            :label="preferredSpeed.label"
            :rules="speedRules"
          />
        </v-row>
        <v-row>
          <v-text-field
            v-model="recordPositionInterval.value"
            :label="recordPositionInterval.label"
            :rules="intervalRules"
          />
        </v-row>
        <v-row>
          <v-text-field
            v-model="writeCsvInterval.value"
            :label="writeCsvInterval.label"
            :rules="intervalRules"
          />
        </v-row>
        <v-row>
          <v-text-field
            v-model="numberOfPeople.value"
            :label="numberOfPeople.label"
            :rules="numberRules"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { InputForm } from '../interface'

export default Vue.extend({
  name: 'BasicModel',
  data: () => ({
    selectBatchLabel: '测试波次',
    selectAllBatchesButtonText: '全部选择',
    selectInvertBatchesButtonText: '反向选择',
    deselectAllBatchesButtonText: '取消选择',

    initialSpeed: {
      label: '人员初始速度 (m/s)',
      value: ''
    } as InputForm,

    preferredSpeed: {
      label: '人员舒适速度 (m/s)',
      value: ''
    } as InputForm,

    recordPositionInterval: {
      label: '记录点位时间间隔 (s)',
      value: ''
    },

    writeCsvInterval: {
      label: '写入csv时间间隔 (s)',
      value: ''
    },

    numberOfPeople: {
      label: '生成人数',
      value: ''
    } as InputForm,

    selectedBatches: [] as string[],
    batchItems: [] as string[],

    isFloat: (value: string) => {
      return value.match(RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/)) !== null
    },

    isInt: (value: string) => {
      return value.match(RegExp(/^[1-9]\d*$/)) !== null
    }
  }),

  methods: {
    initBatchItems () {
      this.batchItems = Array.from({ length: 233 }, (_, index) => {
        return `第${index + 1}波次`
      })
    },

    selectAllBatches () {
      this.selectedBatches = [...this.batchItems]
    },

    selectInvertBatches () {
      const inverted = this.batchItems.filter((batch) => !this.selectedBatches.includes(batch))
      this.selectedBatches = [...inverted]
    },

    deselectAllBatches () {
      this.selectedBatches.splice(0, this.selectedBatches.length)
    }
  },

  computed: {
    speedRules () {
      return [
        (value: string) => !!value || '不能为空',
        (value: string) => this.isFloat(value) || '必须是非负小数'
      ]
    },
    intervalRules () {
      return [
        (value: string) => !!value || '不能为空',
        (value: string) => this.isInt(value) || '必须是正整数'
      ]
    },
    numberRules () {
      return [
        (value: string) => !!value || '不能为空',
        (value: string) => this.isInt(value) || '必须是正整数'
      ]
    }
  },

  mounted () {
    this.initBatchItems()
  }
})
</script>
