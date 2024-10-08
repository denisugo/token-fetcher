<script setup lang="ts">
import useInitialState from "~/composables/use-initial-state";
import type {
  AuthorizationCodeCredentialsDto,
  ResponseType,
} from "~/types/credentials";

const { key, initialValues } =
  await useInitialState<AuthorizationCodeCredentialsDto>("authorization-code");

const title = ref(key!);

const responseType = ref(
  initialValues?.value?.responseType ?? ("code" as ResponseType),
);

const responseTypes: ResponseType[] = ["code", "token"];

const scope = ref(initialValues?.value?.scope ?? "openid");

const authEndpoint = ref(initialValues?.value?.authEndpoint ?? "");
const authUrl = computed(() => stringToUrl(authEndpoint.value));

const tokenEndpoint = ref(initialValues?.value?.tokenEndpoint ?? "");

const tokenUrl = computed(() => stringToUrl(tokenEndpoint.value));

const clientId = ref(initialValues?.value?.clientId ?? "");

const clientSecret = ref(initialValues?.value?.clientSecret ?? "");

const currentUrl = useRequestURL();
const callbackEndpoint = computed(
  () =>
    `${currentUrl.protocol}//${currentUrl.host}/${responseType.value === "code" ? "api/authorization-code/callback" : "tokens"}`,
);

const fullAuthEndpoint = computed(() => {
  if (authUrl.value && responseType.value && clientId.value) {
    const url = authUrl.value;
    url.searchParams.set("response_type", responseType.value);
    url.searchParams.set("client_id", clientId.value);
    url.searchParams.set("redirect_uri", callbackEndpoint.value);
    scope.value && url.searchParams.set("scope", scope.value);
    return url.href;
  }
  return null;
});

const isFetchDisabled = computed(() => {
  const baseConditions = !fullAuthEndpoint.value;
  if (responseType.value === "code")
    return baseConditions || !tokenUrl.value || !clientSecret.value;
  return baseConditions;
});

async function supplyBody(
  sendRequest: (body: AuthorizationCodeCredentialsDto) => Promise<void>,
) {
  const body: AuthorizationCodeCredentialsDto = {
    clientId: clientId.value,
    clientSecret: clientSecret.value,
    tokenEndpoint: tokenEndpoint.value,
    authEndpoint: authEndpoint.value,
    scope: scope.value,
    callbackEndpoint: callbackEndpoint.value,
    responseType: responseType.value,
  };
  await sendRequest(body);
}

async function saveCredentials() {
  await supplyBody(
    async (body) =>
      await $fetch<never>(
        `/api/authorization-code/credentials/${stringToBase64(title.value)}`,
        {
          method: "POST",
          body,
        },
      ),
  );
}
async function fetchTokens(_finishLoading: () => void) {
  // The finishLoading functions is not required to be called here as the whole page is going to be reloaded
  await supplyBody(
    async (body) =>
      await $fetch<never>("/api/authorization-code/credentials/callback", {
        method: "POST",
        body,
      }),
  );
  navigateTo(fullAuthEndpoint.value, { external: true });
}

async function deleteCredentials() {
  await $fetch<never>(
    `/api/authorization-code/credentials/${stringToBase64(title.value)}`,
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
    grant-name="Authorization code"
    :is-fetch-disabled="isFetchDisabled"
    :is-save-disabled="!title"
    :save-credentials="saveCredentials"
  >
    <div class="flex flex-column align-items-center row-gap-4 w-full">
      <div class="flex flex-column gap-2 w-full">
        <label for="response-type"> response type</label>
        <Dropdown
          id="response-type"
          v-model="responseType"
          :options="responseTypes"
          placeholder="Select a grand type"
        />
      </div>
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
      <div class="flex flex-column gap-2 w-full">
        <label for="client-secret">client secret</label>
        <InputText id="client-secret" v-model="clientSecret" />
      </div>
    </div>
  </GrantFormProvider>
</template>
