<script setup lang="ts">
import type { TokensQueryDto } from "~/types/tokens";
definePageMeta({
  middleware: ["token-hash-params"],
});
const { query }: { query: TokensQueryDto } = useRoute();

const { accessToken, idToken, refreshToken } = query;
</script>
<template>
  <div>
    <div
      v-if="accessToken"
      class="mb-2 flex flex-column gap-2 align-items-center"
    >
      <div>
        <label for="access-token">access token</label>
        <div class="card flex justify-content-center">
          <Textarea
            id="access-token"
            :value="accessToken"
            rows="5"
            cols="30"
            disabled
          />
        </div>
      </div>
      <div class="flex gap-1 justify-content-center align-items-center w-full">
        <JwtIoRedirectButton :token="accessToken" />
        <CopyButton :source="accessToken" />
      </div>
    </div>

    <div v-if="idToken" class="mb-2 flex flex-column gap-2 align-items-center">
      <div>
        <label for="id-token">id token</label>
        <div class="card flex justify-content-center">
          <Textarea
            id="id-token"
            :value="idToken"
            rows="5"
            cols="30"
            disabled
          />
        </div>
      </div>
      <div class="flex gap-1 justify-content-center align-items-center w-full">
        <JwtIoRedirectButton :token="idToken" />
        <CopyButton :source="idToken" />
      </div>
    </div>
    <div
      v-if="refreshToken"
      class="mb-4 flex flex-column gap-2 align-items-center"
    >
      <div>
        <label for="refresh-token">refresh token</label>
        <div class="card flex justify-content-center">
          <Textarea
            id="refresh-token"
            :value="refreshToken"
            rows="5"
            cols="30"
            disabled
          />
        </div>
      </div>

      <div class="flex gap-1 justify-content-center align-items-center w-full">
        <JwtIoRedirectButton :token="refreshToken" />
        <CopyButton :source="refreshToken" />
      </div>
    </div>
    <div class="flex flex-column gap-2 align-items-center">
      <NuxtLink to="/"><Button label="Go Back" link /></NuxtLink>
    </div>
  </div>
</template>
