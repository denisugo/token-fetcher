<script setup lang="ts">
import GrantFormProvider from "~/components/GrantFormProvider.vue";
import type { PkceCredentialsDto } from "~/types/credentials";
import stringToBase64 from "~/utils/string-to-base64";

const { key, initialValues } =
  await useInitialState<PkceCredentialsDto>("pkce");

const title = ref(key);

const tokenEndpoint = ref(initialValues?.value?.tokenEndpoint ?? "");
const tokenUrl = computed(() => stringToUrl(tokenEndpoint.value));

const authEndpoint = ref(initialValues?.value?.authEndpoint ?? "");
const authUrl = computed(() => stringToUrl(authEndpoint.value));

const clientId = ref(initialValues?.value?.clientId ?? "");

const scope = ref(initialValues?.value?.scope ?? "openid");

const responseType = "code";
const codeChallengeMethod = "S256";

const { codeChallenge, codeVerifier } = await generateVerifierAndChallenge();

const currentUrl = useRequestURL();
const callbackEndpoint = computed(
  () => `${currentUrl.protocol}//${currentUrl.host}/api/pkce/callback`,
);

const isFetchDisabled = computed(
  () => !tokenUrl.value || !authUrl.value || !clientId.value,
);

const fullAuthEndpoint = computed(() => {
  if (authUrl.value && clientId.value) {
    const url = new URL(authUrl.value);
    url.searchParams.set("response_type", responseType);
    url.searchParams.set("client_id", clientId.value);
    scope.value && url.searchParams.set("scope", scope.value);
    url.searchParams.set("redirect_uri", callbackEndpoint.value);
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", codeChallengeMethod);
    return url.href;
  }
  return null;
});

async function supplyBody(
  sendRequest: (body: PkceCredentialsDto) => Promise<void>,
) {
  const body: PkceCredentialsDto = {
    clientId: clientId.value,
    tokenEndpoint: tokenEndpoint.value,
    authEndpoint: authEndpoint.value,
    callbackEndpoint: callbackEndpoint.value,
    scope: scope.value,
    codeVerifier,
  };
  await sendRequest(body);
}

async function saveCredentials() {
  await supplyBody(
    async (body) =>
      await $fetch<never>(
        `/api/pkce/credentials/${stringToBase64(title.value)}`,
        {
          method: "POST",
          body,
        },
      ),
  );
}

async function fetchTokens() {
  await supplyBody(
    async (body) =>
      await $fetch<never>("/api/pkce/credentials/callback", {
        method: "POST",
        body,
      }),
  );
  navigateTo(fullAuthEndpoint.value, { external: true });
}

async function deleteCredentials() {
  await $fetch<unknown>(
    `/api/pkce/credentials/${stringToBase64(title.value)}`,
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
    grant-name="PKCE"
    :is-fetch-disabled="isFetchDisabled"
    :is-save-disabled="!title"
    :save-credentials="saveCredentials"
  >
    <div class="flex flex-column align-items-center row-gap-4 w-full">
      <div class="flex flex-column gap-2 w-full">
        <label for="calback-url"> callback url</label>
        <div class="flex flex-row gap-2 w-full">
          <div class="flex flex-column flex-grow-1">
            <InputText id="calback-url" :value="callbackEndpoint" disabled />
          </div>
          <CopyButton :source="callbackEndpoint" />
        </div>
      </div>
      <div class="flex flex-column gap-2 w-full">
        <label for="scope">scope</label>
        <InputText id="scope" v-model="scope" />
      </div>
      <div class="flex flex-column gap-2 w-full">
        <label for="auth-endpoint">authorization endpoint</label>
        <InputText
          id="auth-endpoint"
          v-model="authEndpoint"
          :invalid="Boolean(!authUrl && authEndpoint)"
        />
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
    </div>
  </GrantFormProvider>
</template>
