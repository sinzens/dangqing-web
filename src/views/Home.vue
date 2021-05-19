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
        <v-row>
          <v-spacer />
          <v-dialog
            v-model="showDefinePathsDialog"
            persistent
            max-width="300"
            v-if="isPathTablePage"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                class="mr-9"
                v-bind="attrs"
                v-on="on"
                v-text="definePathsButtonText"
              ></v-btn>
            </template>
            <v-card>
              <v-card-title class="headline" v-text="definePathsDialogTitle" />
              <v-card-text>
                <v-text-field
                  v-model="definePathsInput"
                  :label="definePathsInputText"
                  :rules="definePathsRules"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  v-text="cancelText"
                  @click="showDefinePathsDialog = false"
                ></v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  v-text="confirmText"
                  @click="addPredefinedPath"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="showExportDialog" persistent max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                class="mr-9"
                v-bind="attrs"
                v-on="on"
                v-text="exportDataButtonText"
              ></v-btn>
            </template>
            <v-card>
              <v-card-title class="headline" v-text="exportDialogTitle" />
              <v-card-text>
                <v-row>
                  <v-col cols="8">
                    <v-text-field
                      v-model="exportFileName"
                      :label="exportDataInputText"
                      :rules="exportDataFileNameRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      class="ml-4"
                      v-model="exportFileExt"
                      :no-data-text="noDataText"
                      :items="exportFileExts"
                      :label="exportDataSelectExtText"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  v-text="cancelText"
                  @click="showExportDialog = false"
                ></v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  v-text="confirmText"
                  @click="exportData"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <notification-dialog
          v-model="showNotificationDialog"
          :title="notificationTitle"
          :content="notificationContent"
        ></notification-dialog>
      </v-card-text>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import notificationDialog from '../components/NotificationDialog.vue'

export default Vue.extend({
  name: 'Home',
  components: { notificationDialog },

  data: () => ({
    homeTitle: '参数调试',
    validPageTitle: '',
    exportDialogTitle: '导出数据为 Excel',
    exportDataButtonText: '导出数据',
    exportDataInputText: '文件名',
    exportDataSelectExtText: '后缀',
    definePathsDialogTitle: '添加预制路径',
    definePathsButtonText: '添加路径',
    definePathsInputText: '输入路径',
    cancelText: '取消',
    confirmText: '确定',
    noDataText: '没有任何数据',

    showNotificationDialog: false,
    showExportDialog: false,
    showDefinePathsDialog: false,

    exportFileName: '',
    exportFileExt: 'xls',
    definePathsInput: '',
    selectedNavigateItem: 0,

    notificationTitle: '',
    notificationContent: '',

    navigateItems: [
      { title: '基本模型参数配置', icon: 'mdi-view-dashboard', link: '/BasicModel' },
      { title: '波次数据表配置', icon: 'mdi-table', link: '/BatchTable' },
      { title: '落客到安检数据表配置', icon: 'mdi-table', link: '/AtdPathTable' },
      { title: '安检点到指定区域数据表配置', icon: 'mdi-table', link: '/DtaPathTable' }
    ],

    exportFileExts: ['xls', 'xlsx'],
    isPathTablePage: false
  }),

  methods: {
    initialize () {
      this.navigate(this.selectedNavigateItem)
    },

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

    exportData () {
      let data: unknown
      this.showExportDialog = false
      switch (this.$router.currentRoute.path) {
        case '/BasicModel': data = this.$store.getters.batchBasicModel; break
        case '/BatchTable': data = this.$store.getters.batches; break
        case '/AtdPathTable': data = this.$store.getters.pathsAtd; break
        case '/DtaPathTable': data = this.$store.getters.pathsDta; break
        default: data = {}; break
      }

      const jsonData = JSON.stringify(data)
      const fileName = `${this.exportFileName}.${this.exportFileExt}`
      this.$socket.socketSend(
        `cmd|exportData|${fileName}|${jsonData}`,
        (result) => {
          const results = (result as string).split('|')
          const infoOrError = results[0]
          const title = infoOrError === 'info' ? '提示' : '错误'
          const type = results[1]

          let content = '信息'
          switch (type) {
            case 'io':
              content = infoOrError === 'info'
                ? `写入文件成功 ${fileName}`
                : '写入文件失败'
              break
          }

          this.notificationTitle = title
          this.notificationContent = content
          this.showNotificationDialog = true
        }
      )
    },

    addPredefinedPath () {
      this.$store.dispatch('addPredefinedPaths', this.definePathsInput)
      this.showDefinePathsDialog = false
    }
  },

  computed: {
    pageTitle () {
      if (typeof (this.selectedNavigateItem) !== 'undefined') {
        return this.navigateItems[this.selectedNavigateItem].title
      } else {
        return this.validPageTitle
      }
    },

    exportDataFileNameRules () {
      return [
        (value: string) => !!value || '不能为空'
      ]
    },

    definePathsRules () {
      return [
        (value: string) => !!value || '不能为空',
        (value: string) => value.includes(',') || '必须用逗号隔开'
      ]
    }
  },

  watch: {
    selectedNavigateItem (after: number) {
      if (typeof (after) !== 'undefined') {
        this.navigate(after)
      }
    },

    $route (to) {
      this.isPathTablePage = (
        to.path === '/AtdPathTable' ||
        to.path === '/DtaPathTable'
      )
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
