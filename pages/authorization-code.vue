<script setup lang="ts">
import type {
  AuthorizationCodeCredentialsDTO,
  ResponseType,
} from "~/types/credentials";

// const router = useRouter();
const { data: initialValues } = await useFetch(
  "/api/authorization-code-credentials",
);

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
    clientSecret.value
  ) {
    try {
      const url = new URL(authUri.value);
      url.searchParams.set("response_type", responseType.value);
      url.searchParams.set("client_id", clientId.value);
      url.searchParams.set("redirect_uri", callbackUri);
      scope.value && url.searchParams.set("scope", scope.value);
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
  const body: AuthorizationCodeCredentialsDTO = {
    clientId: clientId.value,
    clientSecret: clientSecret.value,
    tokenUri: tokenUri.value,
    authUri: authUri.value,
    scope: scope.value,
    callbackUri,
    responseType: responseType.value,
  };
  await $fetch("/api/authorization-code-credentials", {
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
  <div class="flex flex-column align-items-center row-gap-4 w-full md:w-18rem">
    <h1 class="text-xl">Authorization Code</h1>

    <div class="flex flex-column gap-2 w-full">
      <label for="response-type"
        ><Image src="/icons/under-construction.png" width="15" height="15" />
        response type</label
      >
      <Dropdown
        id="response-type"
        v-model="responseType"
        :options="responseTypes"
        placeholder="Select a grand type"
      />
    </div>
    <div class="flex flex-column gap-2 w-full">
      <label for="calback-url"
        ><Image src="/icons/under-construction.png" width="15" height="15" />
        callback url</label
      >
      <InputText id="calback-url" :value="callbackUri" disabled />
    </div>
    <div class="flex flex-column gap-2 w-full">
      <label for="scope">scope</label>
      <InputText id="scope" v-model="scope" />
    </div>
    <div class="flex flex-column gap-2 w-full">
      <label for="auth-url">auth url</label>
      <InputText id="auth-url" v-model="authUri" />
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
        :loading="loading"
        label="Fetch"
        :disabled="!identityProviderUri || loading"
        @click="submit"
      />
    </div>
  </div>
</template>
