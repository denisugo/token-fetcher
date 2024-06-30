<script setup lang="ts">
const props = defineProps<{ token: string }>();
</script>
<template>
  <NuxtLink
    :to="`https://jwt.io?token=${props.token}`"
    target="_blank"
    rel="noopener"
    icon="pi pi-globe"
    aria-label="Redirect"
    label="open in jwt.io"
  >
    <Button label="open in jwt.io" class="w-10rem" />
  </NuxtLink>
</template>
