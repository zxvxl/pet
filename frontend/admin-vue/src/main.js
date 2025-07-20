import { createApp } from 'vue'
import naive from 'naive-ui'
import { themeOverrides } from './theme.js'
import Dashboard from './Dashboard.vue'

createApp(Dashboard).use(naive, { themeOverrides }).mount('#app')
