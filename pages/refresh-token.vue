<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import type { RefreshTokenCredentialsDto } from "~/types/credentials";
import type { TokensResponseDto } from "~/types/tokens";
import stringToBase64 from "~/utils/string-to-base64";
const toast = useToast();

function showError(detail: string) {
  toast.add({
    severity: "error",
    summary: "Error",
    detail,
    life: 3000,
  });
}

const { data: initialValues } = await useFetch(
  "/api/refresh-token-credentials",
);

const refreshToken = useState<string>(
  () => initialValues.value?.refreshToken ?? "",
);
const tokenEndpoint = useState<string>(
  () => initialValues.value?.tokenEndpoint ?? "",
);
const tokenUrl = computed(() => stringToUrl(tokenEndpoint.value));
const clientId = useState<string>(() => initialValues.value?.clientId ?? "");
const clientSecret = useState<string>(
  () => initialValues.value?.clientSecret ?? "",
);
const loading = useState<boolean>(() => false);

const isFetchDisabled = computed(
  () =>
    !tokenUrl.value ||
    !refreshToken.value ||
    !clientId.value ||
    !clientSecret.value ||
    loading.value,
);

async function callIdentityProviderEndpoint() {
  const authorization = stringToBase64(
    `${clientId.value}:${clientSecret.value}`,
  );
  const headers = new Headers();
  headers.append("Authorization", `Basic ${authorization}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("refresh_token", refreshToken.value!);

  try {
    const { access_token, id_token, refresh_token }: TokensResponseDto =
      await $fetch(tokenEndpoint.value!, {
        method: "POST",
        headers,
        body: urlencoded,
        timeout: 3000,
      });

    await navigateTo(
      `/tokens?${buildQueryForTokens(access_token, id_token, refresh_token)}`,
    );
  } catch (e) {
    showError((e as Error).message);
  }
}
async function saveCredentials() {
  const body: RefreshTokenCredentialsDto = {
    clientId: clientId.value,
    clientSecret: clientSecret.value,
    tokenEndpoint: tokenEndpoint.value,
    refreshToken: refreshToken.value,
  };
  await $fetch("/api/refresh-token-credentials", {
    method: "POST",
    body,
  }); // assumed reliable enough to add a try-catch
}

async function submit() {
  loading.value = true;
  await saveCredentials();
  await callIdentityProviderEndpoint();
  loading.value = false;
}
</script>
<template>
  <div class="flex flex-column align-items-center row-gap-4 w-full md:w-18rem">
    <Toast />
    <h1 class="text-xl">Refresh Token</h1>

    <div class="flex flex-column gap-2 w-full">
      <label for="refresh-token">refresh token</label>
      <InputText id="refresh-token" v-model="refreshToken" />
    </div>
    <div class="flex flex-column gap-2 w-full">
      <label for="token-endpoint">token endpoint</label>
      <InputText
        id="token-endpoint"
        v-model="tokenEndpoint"
        :invalid="Boolean(!tokenUrl && tokenEndpoint)"
      />
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
        :loading="loading"
        label="Fetch"
        :disabled="isFetchDisabled"
        @click="submit"
      />
    </div>
  </div>
</template>
