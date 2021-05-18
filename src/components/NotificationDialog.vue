<template>
  <v-dialog v-model="visible" persistent width="500">
    <v-card>
      <v-card-title class="headline" v-text="title" />
      <v-card-text v-text="content" />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text v-text="buttonText" @click="close" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NotificationDialog',
  props: ['visible', 'title', 'content'],

  model: {
    prop: 'visible',
    event: 'visibilityChanged'
  },

  data: () => ({
    buttonText: '确定'
  }),

  methods: {
    close () {
      this.$emit('visibilityChanged', false)
    }
  }
})
</script>
