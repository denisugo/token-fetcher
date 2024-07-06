<script setup lang="ts">
import type { NuxtError } from "#app";
import type { ErrorData } from "./types/error";

const { error } = defineProps<{ error: NuxtError }>();
</script>

<template>
  <div>
    <h1>{{ error.statusCode }}</h1>
    <h2>{{ error.message }}</h2>
    <p>
      {{ (JSON.parse(error.data as string) as ErrorData).originalErrorMessage }}
    </p>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>
