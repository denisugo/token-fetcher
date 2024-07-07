<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import type { TokensResponseDto } from "~/types/tokens";
const toast = useToast();

function showError(detail: string) {
  toast.add({
    severity: "error",
    summary: "Error",
    detail,
    life: 3000,
  });
}

const refreshToken = useState<string>(() => "");
const tokenUri = useState<string>(() => "");
const clientId = useState<string>(() => "");
const clientSecret = useState<string>(() => "");
const loading = useState<boolean>(() => false);
const identityProviderUri = computed(() => {
  if (
    tokenUri.value &&
    clientId.value &&
    clientSecret.value &&
    refreshToken.value
  ) {
    try {
      const url = new URL(tokenUri.value); // TODO replace with regex
      return url.href;
    } catch {
      return null;
    }
  }
  return null;
});

async function callIdentityProviderEndpoint() {
  loading.value = true;

  const authorization = toBase64(`${clientId}:${clientSecret}`);
  const headers = new Headers();
  headers.append("Authorization", `Basic ${authorization}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("refresh_token", refreshToken.value!);

  try {
    const { access_token, id_token, refresh_token }: TokensResponseDto =
      await $fetch(identityProviderUri.value!, {
        method: "POST",
        headers,
        body: urlencoded,
        timeout: 3000,
      });

    const queryBuilder = [];
    access_token && queryBuilder.push(`accessToken=${access_token}`);
    id_token && queryBuilder.push(`idToken=${id_token}`);
    refresh_token && queryBuilder.push(`refreshToken=${refresh_token}`);

    await navigateTo(`/tokens?${queryBuilder.join("&")}`);
  } catch (e) {
    showError((e as Error).message);
  }
  loading.value = false;
}

async function submit() {
  //saveCredentilas
  await callIdentityProviderEndpoint();
}
</script>
<template>
  <div class="flex flex-column align-items-center row-gap-4 w-full md:w-18rem">
    <Toast />
    <h1 class="text-xl">Refresh Token</h1>

    <!-- <ProgressBar v-if="loading" mode="indeterminate" style="height: 6px" /> -->

    <div class="flex flex-column gap-2 w-full">
      <label for="refresh-token">refresh token</label>
      <InputText id="refresh-token" v-model="refreshToken" />
    </div>
    <div class="flex flex-column gap-2 w-full">
      <label for="token-url">token url</label>
      <InputText id="token-url" v-model="tokenUri" />
    </div>
    <div class="flex flex-column gap-2 w-full">
      <label for="client-id">client id</label>
      <InputText id="client-id" v-model="clientId" />
    </div>
    <div class="flex flex-column gap-2 w-full">
      <label for="client-secret">client secret</label>
      <InputText id="client-secret" v-model="clientSecret" />
    </div>

    <div class="flex align-items-center justify-content-center w-full gap-2">
      <NuxtLink to="/"><Button label="Go Back" link /></NuxtLink>
      <Button
        icon="pi pi-check"
        aria-label="Submit"
        label="Fetch"
        :disabled="!identityProviderUri || loading"
        @click="submit"
      />
    </div>
  </div>
</template>
