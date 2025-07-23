import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from '../permissions.guard';

const reflector = new Reflector();
const guard = new PermissionsGuard(reflector);

function mockContext(user: any, handler: object) {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => handler,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard', () => {
  it('allows when no metadata', () => {
    const ctx = mockContext({}, {});
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('allows when user has permission', () => {
    const handler = {};
    Reflect.defineMetadata('permissions', ['p1'], handler);
    const ctx = mockContext({ permissions: ['p1'] }, handler);
    const res = guard.canActivate(ctx);
    Reflect.deleteMetadata('permissions', handler);
    expect(res).toBe(true);
  });

  it('blocks when user lacks permission', () => {
    const handler = {};
    Reflect.defineMetadata('permissions', ['p2'], handler);
    const ctx = mockContext({ permissions: ['p1'] }, handler);
    const res = guard.canActivate(ctx);
    Reflect.deleteMetadata('permissions', handler);
    expect(res).toBe(false);
  });
});
