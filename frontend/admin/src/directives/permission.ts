// frontend/admin/src/directives/permission.ts
// 权限指令

import type { App, Directive } from 'vue'
import { hasPermission, hasAnyRole } from '@/utils/permission'

const permissionDirective: Directive = {
  mounted(el, binding) {
    const { value } = binding
    
    if (value) {
      let hasAuth = false
      
      if (typeof value === 'string') {
        // 权限检查
        hasAuth = hasPermission(value)
      } else if (Array.isArray(value)) {
        // 角色检查
        hasAuth = hasAnyRole(value)
      } else if (value.permission) {
        // 权限检查
        hasAuth = hasPermission(value.permission)
      } else if (value.roles) {
        // 角色检查
        hasAuth = hasAnyRole(value.roles)
      }
      
      if (!hasAuth) {
        el.style.display = 'none'
      }
    }
  },
  
  updated(el, binding) {
    // 重新检查权限
    permissionDirective.mounted?.(el, binding, null as any, null as any)
  },
}

export function setupPermissionDirective(app: App) {
  app.directive('permission', permissionDirective)
  app.directive('auth', permissionDirective)
}

export default permissionDirective