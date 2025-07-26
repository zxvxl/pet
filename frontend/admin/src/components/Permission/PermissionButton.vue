// frontend/admin/src/components/Permission/PermissionButton.vue
// 权限按钮组件

<template>
  <n-button
    v-if="hasAuth"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </n-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'
import { hasPermission, checkRoles } from '@/utils/permission'

interface Props {
  // 权限代码
  permission?: string
  // 角色列表
  roles?: string[]
  // 点击事件
  onClick?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  permission: '',
  roles: () => [],
})

// 计算是否有权限
const hasAuth = computed(() => {
  // 如果既没有权限也没有角色，默认显示
  if (!props.permission && !props.roles.length) {
    return true
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

const handleClick = () => {
  if (props.onClick) {
    props.onClick()
  }
}
</script>