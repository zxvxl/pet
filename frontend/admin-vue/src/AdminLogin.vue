<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

const form = ref({ username: '', password: '', captcha: '', remember: false })
const message = useMessage()

const submit = async () => {
  try {
    // replace with real API
    await fetch('/api/login', { method: 'POST', body: JSON.stringify(form.value) })
    message.success('登录成功')
  } catch (e) {
    message.error('登录失败')
  }
}
</script>

<template>
  <n-card style="max-width: 360px; margin: 80px auto;">
    <n-form :model="form">
      <n-form-item label="用户名">
        <n-input v-model:value="form.username" />
      </n-form-item>
      <n-form-item label="密码">
        <n-input type="password" v-model:value="form.password" />
      </n-form-item>
      <n-form-item label="验证码">
        <n-input v-model:value="form.captcha" />
      </n-form-item>
      <n-form-item>
        <n-checkbox v-model:checked="form.remember">记住我</n-checkbox>
      </n-form-item>
      <n-button type="primary" block @click="submit">登录</n-button>
    </n-form>
  </n-card>
</template>
