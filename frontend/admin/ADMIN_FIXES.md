# 管理后台修复说明

## 修复内容

### 1. 路由配置修复
- ✅ 更新了 `router/modules/dashboard.ts` - 修正图标和标题
- ✅ 创建了 `router/modules/feeder.ts` - 喂养员管理路由
- ✅ 创建了 `router/modules/order.ts` - 订单管理路由

### 2. 页面组件创建
- ✅ 创建了 `views/feeder/FeederList.vue` - 喂养员列表页面
- ✅ 创建了 `views/feeder/FeederAudit.vue` - 喂养员审核页面
- ✅ 创建了 `views/order/OrderList.vue` - 订单列表页面
- ✅ 更新了 `views/dashboard/index.vue` - 完善仪表盘页面

### 3. API接口完善
- ✅ 更新了 `api/feeder.ts` - 添加喂养员相关接口
- ✅ 更新了 `api/order.ts` - 添加订单相关接口
- ✅ 更新了 `api/dashboard/index.ts` - 修正接口路径

### 4. 功能特性
- ✅ 使用 Naive UI 组件，统一页面风格
- ✅ 实现权限控制，普通管理员不显示金额字段
- ✅ 支持分页、搜索、筛选功能
- ✅ 添加加载状态和错误提示
- ✅ 实现响应式布局

## 页面功能说明

### 仪表盘 (/dashboard)
- 显示今日新增用户、喂养员、订单数
- 显示总用户、总喂养员、总订单数
- 根据权限显示/隐藏金额信息
- 订单趋势图表（支持金额和数量双轴）
- 快捷操作按钮

### 喂养员列表 (/feeders/list)
- 显示喂养员基本信息（姓名、电话、状态等）
- 支持按姓名/手机号搜索
- 支持按状态筛选
- 分页显示
- 查看详情、编辑、启用/禁用操作

### 喂养员审核 (/feeders/audit)
- 显示审核统计数据
- 待审核、今日审核、通过率、平均审核时长
- 支持按状态和日期范围筛选
- 审核操作（通过/拒绝）
- 查看申请详情和证件材料

### 订单列表 (/orders/list)
- 显示订单统计信息
- 支持按订单号/用户/喂养员搜索
- 支持按状态和日期范围筛选
- 根据权限显示/隐藏金额字段
- 查看订单详情和进度时间线

## 权限控制
- 使用 `useUserStore` 管理用户权限
- 通过 `roles` 字段判断是否为超级管理员
- 普通管理员不显示金额相关字段
- 使用 `computed` 属性动态控制显示

## 技术栈
- Vue 3 + TypeScript
- Naive UI 组件库
- Pinia 状态管理
- Alova HTTP 客户端
- ECharts 图表库

## 接口说明
- 所有接口都使用 `/admin/` 前缀
- 支持分页参数 `page` 和 `pageSize`
- 支持搜索和筛选参数
- 统一的错误处理和消息提示 