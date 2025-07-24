import { getAdminMenus } from '@/api/system/menu';

import { RouteRecordRaw } from 'vue-router';
import { Layout, ParentLayout } from '@/router/constant';
import type { AppRouteRecordRaw } from '@/router/types';
declare type Recordable<T = any> = Record<string, T>;

const Iframe = () => import('@/views/iframe/index.vue');
const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', Layout);
LayoutMap.set('IFRAME', Iframe);

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generateRoutes = (routerMap: Recordable[], parent?: Recordable): any[] => {
  return routerMap.map((item: Recordable) => {
    const currentRoute: Recordable = {
      path: `${(parent && parent.path) ?? ''}${item.path}`,
      name: item.name ?? '',
      component: item.component,
      meta: { title: item.name, ...(item.meta || {}) },
    };

    currentRoute.path = currentRoute.path.replace('//', '/');
    if (item.children && item.children.length > 0) {
      currentRoute.children = generateRoutes(item.children, currentRoute);
    }
    return currentRoute;
  });
};

/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generateDynamicRoutes = async (): Promise<RouteRecordRaw[]> => {
  const result = await getAdminMenus();
  const response = result as any;
  const menus = response?.menus || [];
  
  // 将后端菜单格式转换为前端路由格式
  const formattedMenus = menus.map(menu => ({
    ...menu,
    name: menu.name || menu.path?.replace('/', '') || '',
    component: menu.component || 'LAYOUT',
    meta: {
      title: menu.name,
      icon: menu.icon || 'file',
      hideMenu: menu.is_show === 0,
      ...menu.meta
    }
  }));
  
  const router = generateRoutes(formattedMenus);
  asyncImportRoute(router);
  return router;
};

/**
 * 查找views中对应的组件文件
 * */
let viewsModules: Record<string, () => Promise<Recordable>>;
export const asyncImportRoute = (routes: AppRouteRecordRaw[] | undefined): void => {
  viewsModules = viewsModules || import.meta.glob('../views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach((item) => {
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFRAME';
    }
    const { component, name } = item;
    const { children } = item;
    if (component) {
      const layoutFound = LayoutMap.get(component as string);
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        item.component = dynamicImport(viewsModules, component as string);
      }
    } else if (name) {
      item.component = ParentLayout;
    }
    children && asyncImportRoute(children);
  });
};

/**
 * 动态导入
 * */
export const dynamicImport = (
  viewsModules: Record<string, () => Promise<Recordable>>,
  component: string
): (() => Promise<Recordable>) | undefined => {
  component = component.replace(/^\//, '').replace(/\.vue$/, '');
  const keys = Object.keys(viewsModules);
  const matchKeys = keys.filter((key) => {
    let k = key.replace('../views', '');
    const lastIndex = k.lastIndexOf('.');
    k = k.substring(0, lastIndex);
    return k === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return viewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    console.warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    );
    return;
  }
};
