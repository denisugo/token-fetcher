<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

const { source } = defineProps<{ source: string }>();

const { copy } = useClipboard({ source });
</script>

<template>
  <Button icon="pi pi-clipboard" label="copy" class="w-6rem" @click="copy()" />
</template>
