<template>
  <v-app>
    <v-main>
      <router-view/>
      <!-- <v-btn @click="() => { $socket.socketSend('cmd|getBatches') }" /> -->
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  data: () => ({
    // socket: {} as SocketHandler
  }),

  methods: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initialize () {

    }
  },

  created () {
    this.initialize()
  }
})
</script>
