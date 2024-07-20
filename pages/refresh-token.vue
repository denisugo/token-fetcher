<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import GrantFormProvider from "~/components/GrantFormProvider.vue";
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
const { fullPath } = useRoute();

const { key, initialValues } =
  await useInitialState<RefreshTokenCredentialsDto>("refresh-token");

const title = useState<string>(`title-${fullPath}`, () =>
  key ? base64ToString(key) : Date.now().toString(),
);

const refreshToken = useState<string>(
  `refresh-token-${fullPath}`,
  () => initialValues?.value?.refreshToken ?? "",
);
const tokenEndpoint = useState<string>(
  `token-nedpoint-${fullPath}`,
  () => initialValues?.value?.tokenEndpoint ?? "",
);
const tokenUrl = computed(() => stringToUrl(tokenEndpoint.value));
const clientId = useState<string>(
  `client-id-${fullPath}`,
  () => initialValues?.value?.clientId ?? "",
);
const clientSecret = useState<string>(
  `client-secret-${fullPath}`,
  () => initialValues?.value?.clientSecret ?? "",
);

const isFetchDisabled = computed(
  () =>
    !tokenUrl.value ||
    !refreshToken.value ||
    !clientId.value ||
    !clientSecret.value,
);

async function fetchTokens() {
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
    const { access_token, id_token, refresh_token } =
      await $fetch<TokensResponseDto>(tokenEndpoint.value, {
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
  await $fetch(
    `/api/credentials/refresh-token/${stringToBase64(title.value)}`,
    {
      method: "POST",
      body,
    },
  ); // assumed reliable enough to add a try-catch
}

async function deleteCredentials() {
  await $fetch<unknown>(
    `/api/credentials/refresh-token/${stringToBase64(title.value)}`,
    {
      method: "DELETE",
    },
  );
}
</script>

<template>
  <GrantFormProvider
    v-model:title="title"
    :delete-credentials="deleteCredentials"
    :fetch-tokens="fetchTokens"
    grant-name="Refresh token"
    :is-fetch-disabled="isFetchDisabled"
    :is-save-disabled="!title"
    :save-credentials="saveCredentials"
  >
    <div class="flex flex-column align-items-center row-gap-4 w-full">
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
    </div>
  </GrantFormProvider>
</template>
