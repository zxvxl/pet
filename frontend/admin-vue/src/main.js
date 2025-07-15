import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import FeederAudit from './FeederAudit.vue';

createApp(FeederAudit).use(ElementPlus).mount('#app');
