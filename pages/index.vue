<script setup lang="ts">
import type { CredentialsDTO } from "~/types/credentials";

// const router = useRouter();

type IdentityPorvider = "AWS Cognito";
const identityProviders: IdentityPorvider[] = [
  "AWS Cognito" /*, "Okta", "Google"*/,
];
const identityPorvider = useState<IdentityPorvider>(
  () => "AWS Cognito" as IdentityPorvider,
);

type GrantType = "Authorization Code" | "Implicit" | "Client Credentials";
const grantType = useState<GrantType>(() => "Authorization Code" as GrantType);
const grantTypes: GrantType[] = [
  "Authorization Code" /*, "Implicit", "Client Credentials"*/,
];

type ResponseType = "code" | "token";
const responseType = useState<ResponseType>(() => "code" as ResponseType);
const responseTypes: ResponseType[] = ["code" /*, "token"*/];

const scope = useState<string>(() => "openid");

const authUri = useState<string>();

const tokenUri = useState<string>();

const clientId = useState<string>();

const clientSecret = useState<string>();

const callbackUri = import.meta.client
  ? `${window.location.origin}/api/callback`
  : "";

const identityProviderUri = computed(() => {
  // TODO add regex
  // TODO check if all params a filled out
  if (
    authUri.value &&
    tokenUri.value &&
    responseType.value &&
    clientId.value &&
    clientSecret.value &&
    scope.value
  ) {
    try {
      const url = new URL(authUri.value);
      url.searchParams.set("response_type", responseType.value);
      url.searchParams.set("client_id", clientId.value);
      url.searchParams.set("redirect_uri", callbackUri);
      url.searchParams.set("scope", scope.value);
      return url.href;
    } catch {
      return null;
    }
  }
  return null;
});
// TODO uncomment
// watch([identityPorvider, grantType, scope], (newVal) => {
//     const [newIdentityPorvider, newGrandType, newScope] = newVal
//     router.push({
//         query: { identity_provider: newIdentityPorvider, grantType: newGrandType.toLowerCase().replace(" ", "_"), scope: newScope }
//     })
// }, {})
const loading = useState<boolean>(() => false);
async function saveAuthData() {
  loading.value = true;
  const body: CredentialsDTO = {
    clientId: clientId.value,
    clientSecret: clientSecret.value,
    grantType: grantType.value.toLowerCase().replace(" ", "_"),
    tokenUri: tokenUri.value,
    callbackUri,
  };
  await $fetch("/api/credentials", {
    method: "POST",
    body,
  });
  loading.value = false;
}
async function submit() {
  await saveAuthData();
  navigateTo(identityProviderUri.value, { external: true });
}
</script>

<template>
  <div class="flex flex-column row-gap-4 w-full md:w-18rem">
    <ProgressBar v-if="loading" mode="indeterminate" style="height: 6px" />
    <div class="flex flex-column gap-2">
      <label for="identity-prorvider">identity prorvider</label>
      <Dropdown
        id="identity-prorvider"
        v-model="identityPorvider"
        :options="identityProviders"
        placeholder="Select an identity provider"
      />
    </div>

    <div class="flex flex-column gap-2">
      <label for="grant-type">grant type</label>
      <Dropdown
        id="grant-type"
        v-model="grantType"
        :options="grantTypes"
        placeholder="Select a grand type"
      />
    </div>
    <div class="flex flex-column gap-2">
      <label for="response-type">response type</label>
      <Dropdown
        id="response-type"
        v-model="responseType"
        :options="responseTypes"
        placeholder="Select a grand type"
      />
    </div>
    <div class="flex flex-column gap-2">
      <label for="calback-url">callback url</label>
      <InputText id="calback-url" v-model="callbackUri" disabled />
    </div>
    <div class="flex flex-column gap-2">
      <label for="scope">scope</label>
      <InputText id="scope" v-model="scope" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="auth-url">auth url</label>
      <InputText id="auth-url" v-model="authUri" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="token-url">token url</label>
      <InputText id="token-url" v-model="tokenUri" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="client-id">client id</label>
      <InputText id="client-id" v-model="clientId" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="client-secret">client secret</label>
      <InputText id="client-secret" v-model="clientSecret" />
    </div>

    <div class="align-self-center">
      <Button
        icon="pi pi-check"
        aria-label="Submit"
        label="go"
        :disabled="!identityProviderUri || loading"
        @click="submit"
      />
    </div>
  </div>
</template>
