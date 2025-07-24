import { computed } from 'vue';
import { useUserStore } from '@/store/modules/user';

/**
 * 权限管理Hook
 */
export function usePermission() {
  const userStore = useUserStore();

  /**
   * 检查用户是否具有指定权限
   * @param permission 权限代码
   */
  const hasPermission = (permission: string): boolean => {
    // 从用户store中获取权限列表，确保是数组
    const permissions: string[] = Array.isArray(userStore.getPermissions) ? userStore.getPermissions : [];
    return permissions.includes(permission);
  };

  /**
   * 检查用户是否具有多个权限中的任意一个
   * @param permissions 权限代码数组
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    const userPermissions = userStore.getPermissions || [];
    return permissions.some(permission => userPermissions.includes(permission));
  };

  /**
   * 检查用户是否具有所有指定权限
   * @param permissions 权限代码数组
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    const userPermissions = userStore.getPermissions || [];
    return permissions.every(permission => userPermissions.includes(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: computed(() => userStore.getPermissions || [])
  };
}