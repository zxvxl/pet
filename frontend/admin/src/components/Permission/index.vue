// frontend/admin/src/components/Permission/index.vue
// 权限控制组件

<template>
  <slot v-if="hasAuth" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hasPermission, hasAnyRole, checkRoles } from '@/utils/permission'

interface Props {
  // 权限代码
  permission?: string
  // 角色列表
  roles?: string[]
  // 默认是否显示
  defaultShow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  permission: '',
  roles: () => [],
  defaultShow: false,
})

// 计算是否有权限
const hasAuth = computed(() => {
  // 如果既没有权限也没有角色，使用默认值
  if (!props.permission && !props.roles.length) {
    return props.defaultShow
  }
  
  // 检查权限
  if (props.permission && !hasPermission(props.permission)) {
    return false
  }
  
  // 检查角色
  if (props.roles.length && !checkRoles(props.roles)) {
    return false
  }
  
  return true
})
</script>