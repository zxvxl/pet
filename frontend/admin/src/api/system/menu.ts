import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 管理员菜单数据
 */
export const adminMenus = [];

/**
 * @description: 获取管理员菜单
 */
export function getAdminMenus() {
  return Alova.Get('/admin/auth/info', {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 获取菜单列表
 */
export function getMenuList() {
  return Alova.Get('/admin/menus', {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 创建菜单
 */
export function createMenu(params) {
  return Alova.Post('/admin/menus', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 更新菜单
 */
export function updateMenu(id: number, params) {
  return Alova.Put(`/admin/menus/${id}`, params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除菜单
 */
export function deleteMenu(id: number) {
  return Alova.Delete(`/admin/menus/${id}`, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}