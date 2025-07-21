<template>
  <iframe :src="route.meta.frameSrc" frameborder="0" style="width:100%;height:100%"></iframe>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
