/**
 * JWT工具类，用于解析JWT token
 */

interface JwtPayload {
  sub?: string | number;
  roles?: string[];
  permissions?: string[];
  [key: string]: any;
}

/**
 * 解析JWT token
 * @param token JWT token字符串
 * @returns 解析后的payload对象
 */
export function parseJwt(token: string): JwtPayload | null {
  if (!token || typeof token !== 'string') {
    return null;
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // 确保atob存在（浏览器环境）
    if (typeof atob === 'undefined') {
      console.warn('atob函数不可用，可能在非浏览器环境中运行');
      return null;
    }
    
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('解析JWT token失败:', error);
    return null;
  }
}

/**
 * 从JWT token中获取用户ID
 * @param token JWT token字符串
 * @returns 用户ID
 */
export function getUserIdFromToken(token: string): number | null {
  const payload = parseJwt(token);
  if (!payload || !payload.sub) {
    return null;
  }
  const userId = Number(payload.sub);
  return isNaN(userId) ? null : userId;
}

/**
 * 从JWT token中获取用户角色
 * @param token JWT token字符串
 * @returns 角色数组
 */
export function getRolesFromToken(token: string): string[] {
  const payload = parseJwt(token);
  if (!payload || !payload.roles || !Array.isArray(payload.roles)) {
    return [];
  }
  return payload.roles.filter(role => typeof role === 'string');
}

/**
 * 从JWT token中获取用户权限
 * @param token JWT token字符串
 * @returns 权限数组
 */
export function getPermissionsFromToken(token: string): string[] {
  const payload = parseJwt(token);
  if (!payload || !payload.permissions || !Array.isArray(payload.permissions)) {
    return [];
  }
  return payload.permissions.filter(permission => typeof permission === 'string');
}