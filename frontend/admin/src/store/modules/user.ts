import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login } from '@/api/system/user';
import { storage } from '@/utils/Storage';
import { getUserIdFromToken } from '@/utils/jwt';

export type UserInfoType = {
  id?: number;
  username?: string;
  nickname?: string | null;
  email?: string | null;
  phone?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: any[];
  permissions?: string[];
};

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): string[] {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      const response = await login(params);
      console.log(response);
      const token = (response as any).data?.access_token;
      console.log(token)
      if (token) {
        const ex = 7 * 24 * 60 * 60;
        storage.set(ACCESS_TOKEN, token, ex);
        storage.set(CURRENT_USER, (response as any).data, ex);
        this.setToken(token);
        this.setUserInfo((response as any).data);
      }
      return response;
    },

    // 获取用户信息
    async getInfo() {
      const token = this.getToken;
      if (!token) {
        throw new Error('未找到登录token');
      }
      
      const userId = getUserIdFromToken(token);
      if (!userId) {
        throw new Error('无法从token中获取用户ID');
      }
      
      const data = await getUserInfoApi(userId);
      const response = data as any;
      const info = response?.result || response?.data || response;
      
      // 处理权限和菜单：直接使用后端的权限和菜单数据
      if (info?.permissions && Array.isArray(info.permissions)) {
        this.setPermissions(info.permissions);
      }
      
      // 保存完整的用户信息，包括角色、权限和菜单
      this.setUserInfo(info);
      return info;
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({});
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
