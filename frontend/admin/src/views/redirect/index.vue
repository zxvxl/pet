<template>
  <div></div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
if (route.query?.path) {
  router.replace(String(route.query.path))
}
</script>
