# 统一组件开发规范

本文档用于指导团队在开发小程序端（TDesign）与管理端（Naive UI）组件时的统一规范，确保风格一致与代码可维护。

## 组件命名规则
- 使用大驼峰式命名，例如 `UserCard`、`LoginForm`。
- 目录命名使用小写短横线，如 `user-card/`。

## 公共组件规范
- 顶部导航、空状态、分页等组件应放置在 `components/` 目录，方便复用。
- 公共组件尽量无业务逻辑，通过 `props` 传递数据与事件。

## 表单提交与验证
- 所有表单使用 `v-model` 双向绑定，并在 `submit` 前进行必填校验。
- 错误信息通过 `naive-ui` 或 `tdesign` 的 `FormItem` 提示。

## 页面布局
- 管理端统一采用顶部导航 + 侧边栏布局，小程序端遵循微信页面栈。
- 主区域保持 16px 间距，移动端使用 rpx 相对单位。

## 样式变量与主题
- 主色：`#F5A623`，辅色：`#FFEDDA`，文字色：`#333333`，强调色：`#62C7C0`。
- 小程序端在 `styles/theme.scss` 定义主题变量；管理端在 `src/theme.js` 定义 `themeOverrides`。
- 所有按钮与标签使用主题色，空状态图标和 Tab 与品牌色保持一致。

## 与组件库的对接
- 优先使用 Naive UI 与 TDesign 提供的组件；如需扩展，保持 API 风格一致。
- 通过 `themeOverrides` 或 SCSS 变量修改默认配色，避免直接修改组件库源码。

## 组件开发与复用
- 复杂页面拆分为若干功能组件，每个组件只负责自身逻辑。
- 通过 `emit` 事件向父组件传递交互结果，避免双向耦合。

## 示例
```vue
<!-- UserCard.vue -->
<template>
  <n-card :title="user.name">
    <slot />
  </n-card>
</template>
<script setup>
defineProps({ user: Object })
</script>
```
此组件可在不同页面复用，保持统一的视觉与交互。
