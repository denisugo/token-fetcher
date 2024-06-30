<script setup lang="ts">
const { data: tokens } = await useFetch("/api/tokens");
const accessToken = computed(() => tokens.value?.access_token);
const idToken = computed(() => tokens.value?.id_token);
const refreshToken = computed(() => tokens.value?.refresh_token);
// const tokenType = computed(() => tokens.value?.token_type);
// const expires = computed(() => tokens.value?.expires_in);
</script>
<template>
  <div>
    <div v-if="accessToken" class="flex flex-column gap-2 align-items-center">
      <label for="access-token">access token</label>
      <div class="card flex justify-content-center">
        <Textarea
          id="access-token"
          v-model="accessToken"
          rows="5"
          cols="30"
          disabled
        />
      </div>
      <JwtIoRedirectButton :token="accessToken" />
    </div>
    <div v-if="idToken" class="flex flex-column gap-2">
      <label for="id-token">id token</label>
      <div class="card flex justify-content-center">
        <Textarea id="id-token" v-model="idToken" rows="5" cols="30" disabled />
      </div>

      <JwtIoRedirectButton :token="idToken" />
    </div>
    <div v-if="refreshToken" class="flex flex-column gap-2">
      <label for="refresh-token">refresh token</label>
      <div class="card flex justify-content-center">
        <Textarea
          id="refresh-token"
          v-model="refreshToken"
          rows="5"
          cols="30"
          disabled
        />
      </div>

      <JwtIoRedirectButton :token="refreshToken" />
    </div>
    <div class="mt-2">
      <Button
        icon="pi pi-check"
        aria-label="Submit"
        label="back"
        @click="navigateTo('/')"
      />
    </div>
  </div>
</template>
