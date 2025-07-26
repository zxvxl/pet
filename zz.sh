#!/bin/bash
# 图标问题修复脚本

echo "🔧 开始修复图标问题..."

# 检查项目目录
if [ ! -d "frontend/admin/src/router/modules" ]; then
    echo "❌ 路由目录不存在，请在项目根目录下执行此脚本"
    exit 1
fi

echo "📁 创建路由文件备份..."
cp -r frontend/admin/src/router/modules frontend/admin/src/router/modules.backup.$(date +%Y%m%d_%H%M%S)

echo "🎨 更新路由文件中的图标配置..."

# 1. 修复 feeder.ts 文件
cat > frontend/admin/src/router/modules/feeder.ts << 'EOF'
import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { People, PersonAdd } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/feeders',
  name: 'Feeders',
  redirect: '/feeders/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '喂养员管理',
    icon: renderIcon(People),
    orderNo: 2,
    roles: ['super'],
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'FeederList',
      component: () => import('@/views/feeders/FeederList.vue'),
      meta: {
        title: '喂养员列表',
        icon: renderIcon(People),
        roles: ['super', 'feeder_manager'],
        hideMenu: false,
      },
    },
    {
      path: 'audit',
      name: 'FeederAudit',
      component: () => import('@/views/feeders/FeederAudit.vue'),
      meta: {
        title: '审核中心',
        icon: renderIcon(PersonAdd),
        roles: ['super', 'feeder_manager'],
        hideMenu: false,
      },
    },
  ],
}

export default routes
EOF

# 2. 修复 dashboard.ts 文件
cat > frontend/admin/src/router/modules/dashboard.ts << 'EOF'
import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { Home } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/layout/index.vue'),
  redirect: '/dashboard/index',
  meta: {
    title: '首页',
    icon: renderIcon(Home),
    orderNo: 1,
    hideMenu: false,
  },
  children: [
    {
      path: 'index',
      name: 'DashboardIndex',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '数据概览',
        hideMenu: false,
        affix: true,
      },
    },
  ],
}

export default routes
EOF

# 3. 修复 order.ts 文件
cat > frontend/admin/src/router/modules/order.ts << 'EOF'
import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { Document } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/orders',
  name: 'Orders',
  redirect: '/orders/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '订单管理',
    icon: renderIcon(Document),
    orderNo: 3,
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/orders/OrderList.vue'),
      meta: {
        title: '订单列表',
        icon: renderIcon(Document),
        hideMenu: false,
      },
    },
  ],
}

export default routes
EOF

# 4. 修复 user.ts 文件
cat > frontend/admin/src/router/modules/user.ts << 'EOF'
import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { Person, Settings } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/users',
  name: 'Users',
  redirect: '/users/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '用户管理',
    icon: renderIcon(Person),
    orderNo: 4,
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/users/UserList.vue'),
      meta: {
        title: '用户列表',
        icon: renderIcon(Person),
        hideMenu: false,
      },
    },
    {
      path: 'admin',
      name: 'AdminUsers',
      component: () => import('@/views/admin/users/index.vue'),
      meta: {
        title: '管理员用户',
        icon: renderIcon(Settings),
        roles: ['super'],
        hideMenu: false,
      },
    },
  ],
}

export default routes
EOF

# 5. 修复 review.ts 文件
cat > frontend/admin/src/router/modules/review.ts << 'EOF'
import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { Star, Warning } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/reviews',
  name: 'Reviews',
  redirect: '/reviews/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '服务评价',
    icon: renderIcon(Star),
    orderNo: 5,
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'ReviewList',
      component: () => import('@/views/reviews/ReviewList.vue'),
      meta: {
        title: '评价列表',
        icon: renderIcon(Star),
        hideMenu: false,
      },
    },
    {
      path: 'feedback',
      name: 'FeedbackList',
      component: () => import('@/views/reviews/FeedbackList.vue'),
      meta: {
        title: '反馈投诉',
        icon: renderIcon(Warning),
        hideMenu: false,
      },
    },
  ],
}

export default routes
EOF

# 6. 修复 system.ts 文件
cat > frontend/admin/src/router/modules/system.ts << 'EOF'
import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { Settings, People, LockClosed, Menu, DocumentText } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/system',
  name: 'System',
  redirect: '/system/role',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '系统管理',
    icon: renderIcon(Settings),
    orderNo: 10,
    roles: ['super'],
    hideMenu: false,
  },
  children: [
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        title: '角色管理',
        icon: renderIcon(People),
        roles: ['super'],
        hideMenu: false,
      },
    },
    {
      path: 'permission',
      name: 'SystemPermission',
      component: () => import('@/views/system/permission/index.vue'),
      meta: {
        title: '权限管理',
        icon: renderIcon(LockClosed),
        roles: ['super'],
        hideMenu: false,
      },
    },
    {
      path: 'menu',
      name: 'SystemMenu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        title: '菜单管理',
        icon: renderIcon(Menu),
        roles: ['super'],
        hideMenu: false,
      },
    },
    {
      path: 'log',
      name: 'SystemLog',
      component: () => import('@/views/system/log/index.vue'),
      meta: {
        title: '操作日志',
        icon: renderIcon(DocumentText),
        roles: ['super'],
        hideMenu: false,
      },
    },
  ],
}

export default routes
EOF

echo "✅ 图标配置修复完成"

# 验证文件
echo "🔍 验证修复结果..."
echo "检查路由文件是否存在："
for file in feeder.ts dashboard.ts order.ts user.ts review.ts system.ts; do
    if [ -f "frontend/admin/src/router/modules/$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file 缺失"
    fi
done

echo ""
echo "📋 修复内容总结："
echo "✅ 修复了 renderIcon 函数的导入路径"
echo "✅ 替换了不存在的图标组件"
echo "✅ 统一了图标使用规范"
echo "✅ 为所有路由配置了正确的图标"
echo ""
echo "🎯 下一步操作："
echo "1. 重启前端开发服务器"
echo "2. 检查浏览器控制台是否有错误"
echo "3. 验证菜单图标是否正常显示"
echo ""
echo "💡 如果仍有问题，请："
echo "1. 检查 @vicons/ionicons5 是否正确安装"
echo "2. 确认项目中的 utils/index.ts 文件存在"
echo "3. 查看图标修复指南文档"

echo "🎉 图标修复完成！"