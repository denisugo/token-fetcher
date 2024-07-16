<script setup lang="ts">
defineProps<{ token: string }>();
</script>
<template>
  <NuxtLink
    :to="`https://jwt.io?token=${token}`"
    target="_blank"
    rel="noopener"
    icon="pi pi-globe"
    aria-label="Redirect"
    label="open in jwt.io"
  >
    <Button icon="pi pi-external-link" label="open in jwt.io" class="w-10rem" />
  </NuxtLink>
</template>
