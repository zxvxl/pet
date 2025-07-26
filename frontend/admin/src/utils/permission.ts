/ frontend/admin/src/utils/permission.ts
// 权限控制工具函数

import { useUserStore } from '@/store/modules/user'

/**
 * 检查是否有指定权限
 * @param permission 权限代码
 * @returns boolean
 */
export function hasPermission(permission: string): boolean {
  const userStore = useUserStore()
  const userInfo = userStore.getUserInfo
  
  // 超级管理员拥有所有权限
  if (userInfo.roles?.includes('super_admin') || userInfo.roles?.includes('super')) {
    return true
  }
  
  // 检查权限列表
  const permissions = userInfo.permissions || []
  return permissions.includes(permission)
}

/**
 * 检查是否有指定角色
 * @param role 角色代码
 * @returns boolean
 */
export function hasRole(role: string): boolean {
  const userStore = useUserStore()
  const userInfo = userStore.getUserInfo
  const roles = userInfo.roles || []
  return roles.includes(role)
}

/**
 * 检查是否有任意一个权限
 * @param permissions 权限代码数组
 * @returns boolean
 */
export function hasAnyPermission(permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(permission))
}

/**
 * 检查是否有所有权限
 * @param permissions 权限代码数组
 * @returns boolean
 */
export function hasAllPermissions(permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(permission))
}

/**
 * 检查是否有任意一个角色
 * @param roles 角色代码数组
 * @returns boolean
 */
export function hasAnyRole(roles: string[]): boolean {
  return roles.some(role => hasRole(role))
}

/**
 * 根据权限控制组件显示
 * @param permission 权限代码
 * @param defaultShow 默认是否显示（当没有权限时）
 * @returns boolean
 */
export function checkPermission(permission: string, defaultShow: boolean = false): boolean {
  if (!permission) return defaultShow
  return hasPermission(permission)
}

/**
 * 根据角色控制组件显示
 * @param roles 角色代码数组
 * @param defaultShow 默认是否显示（当没有角色时）
 * @returns boolean
 */
export function checkRoles(roles: string[], defaultShow: boolean = false): boolean {
  if (!roles || !roles.length) return defaultShow
  return hasAnyRole(roles)
}

/**
 * 格式化权限代码为中文描述
 * @param permission 权限代码
 * @returns string
 */
export function formatPermission(permission: string): string {
  const permissionMap: Record<string, string> = {
    // 系统管理
    'system:manage': '系统管理',
    'user:manage': '用户管理',
    'role:manage': '角色管理',
    'permission:manage': '权限管理',
    'menu:manage': '菜单管理',
    'log:view': '操作日志查看',
    
    // 用户相关
    'user:view': '查看用户',
    'user:create': '创建用户',
    'user:edit': '编辑用户',
    'user:delete': '删除用户',
    
    // 喂养员相关
    'feeder:view': '查看喂养员',
    'feeder:create': '创建喂养员',
    'feeder:edit': '编辑喂养员',
    'feeder:delete': '删除喂养员',
    'feeder:manage': '管理喂养员',
    'feeder:audit': '审核喂养员',
    'feeder:enable': '启用喂养员',
    'feeder:disable': '禁用喂养员',
    
    // 订单相关
    'order:view': '查看订单',
    'order:manage': '管理订单',
    'order:export': '导出订单',
    
    // 评价反馈
    'review:view': '查看评价',
    'review:manage': '管理评价',
    'feedback:view': '查看反馈',
    'feedback:handle': '处理反馈',
    
    // 统计相关
    'dashboard:view': '查看数据统计',
    'system:monitor': '系统监控',
  }
  
  return permissionMap[permission] || permission
}

/**
 * 获取当前用户权限列表
 * @returns string[]
 */
export function getCurrentPermissions(): string[] {
  const userStore = useUserStore()
  return userStore.getUserInfo.permissions || []
}

/**
 * 获取当前用户角色列表
 * @returns string[]
 */
export function getCurrentRoles(): string[] {
  const userStore = useUserStore()
  return userStore.getUserInfo.roles || []
}

/**
 * 判断是否为超级管理员
 * @returns boolean
 */
export function isSuperAdmin(): boolean {
  return hasAnyRole(['super_admin', 'super'])
}

/**
 * 根据权限过滤菜单项
 * @param menus 菜单列表
 * @returns 过滤后的菜单列表
 */
export function filterMenusByPermission(menus: any[]): any[] {
  return menus.filter(menu => {
    // 检查菜单权限
    if (menu.meta?.roles && !checkRoles(menu.meta.roles)) {
      return false
    }
    
    if (menu.meta?.permission && !hasPermission(menu.meta.permission)) {
      return false
    }
    
    // 递归过滤子菜单
    if (menu.children && menu.children.length > 0) {
      menu.children = filterMenusByPermission(menu.children)
      // 如果子菜单全部被过滤掉，则隐藏父菜单
      return menu.children.length > 0
    }
    
    return true
  })
}