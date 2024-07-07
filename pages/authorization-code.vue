<script setup lang="ts">
import type {
  CredentialsDTO,
  GrantType,
  IdentityPorvider,
  ResponseType,
} from "~/types/credentials";

// const router = useRouter();
const { data: initialValues } = await useFetch("/api/credentials");
const identityProviders: IdentityPorvider[] = [
  "AWS Cognito" /*, "Okta", "Google"*/,
];
const identityPorvider = useState<IdentityPorvider>(
  () => initialValues.value?.identityPorvider ?? "AWS Cognito",
);

const grantType = useState<GrantType>(
  () => initialValues.value?.grantType ?? ("Authorization Code" as GrantType),
);
const grantTypes: GrantType[] = [
  "Authorization Code" /*, "Implicit", "Client Credentials"*/,
];

const responseType = useState<ResponseType>(
  () => initialValues.value?.responseType ?? ("code" as ResponseType),
);
const responseTypes: ResponseType[] = ["code" /*, "token"*/];

const scope = useState<string>(() => initialValues.value?.scope ?? "openid");

const authUri = useState<string>(() => initialValues.value?.authUri ?? "");

const tokenUri = useState<string>(() => initialValues.value?.tokenUri ?? "");

const clientId = useState<string>(() => initialValues.value?.clientId ?? "");

const clientSecret = useState<string>(
  () => initialValues.value?.clientSecret ?? "",
);

const url = useRequestURL();
const callbackUri = `${url.protocol}//${url.host}/api/callback`;

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
    grantType: grantType.value,
    tokenUri: tokenUri.value,
    authUri: authUri.value,
    scope: scope.value,
    callbackUri,
    responseType: responseType.value,
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
  </div>
</template>
