<template>
  <v-card height="100%" class="mx-auto">
    <v-navigation-drawer permanent absolute width="300">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ homeTitle }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group v-model="selectedNavigateItem">
          <v-list-item v-for="item in navigateItems" :key="item.title">
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <div id="home-view">
      <v-card-title v-text="pageTitle" />
      <v-card-text>
        <router-view />
      </v-card-text>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Home',

  data: () => ({
    homeTitle: '参数调试',
    validPageTitle: '',
    selectedNavigateItem: 0,
    navigateItems: [
      { title: '基本模型参数配置', icon: 'mdi-view-dashboard', link: '/BasicModel' },
      { title: '波次数据表配置', icon: 'mdi-image', link: '/BatchTable' },
      { title: '落客到安检数据表配置', icon: 'mdi-help-box', link: '/AtdPathTable' },
      { title: '安检点到指定区域数据表配置', icon: 'mdi-help-box', link: '/DtaPathTable' }
    ]
  }),

  methods: {
    setPage (link: string) {
      if (this.$router.currentRoute.path !== link) {
        this.$router.push(link)
      }
    },

    navigate (index: number) {
      const item = this.navigateItems[index]
      this.validPageTitle = item.title
      this.setPage(item.link)
    },

    initialize () {
      this.navigate(this.selectedNavigateItem)
    }
  },

  computed: {
    pageTitle () {
      if (typeof (this.selectedNavigateItem) !== 'undefined') {
        return this.navigateItems[this.selectedNavigateItem].title
      } else {
        return this.validPageTitle
      }
    }
  },

  watch: {
    selectedNavigateItem (after: number) {
      if (typeof (after) !== 'undefined') {
        this.navigate(after)
      }
    }
  },

  created () {
    this.initialize()
  }
})
</script>

<style lang="scss">
  #home-view {
    margin-left: 300px;
    height: 100%;
  }
</style>
