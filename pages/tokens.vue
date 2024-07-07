<script setup lang="ts">
import type { TokensQueryDto } from "~/types/tokens";

const { query }: { query: TokensQueryDto } = useRoute();

const accessToken = computed(() => query.accessToken);
const idToken = computed(() => query.idToken);
const refreshToken = computed(() => query.refreshToken);
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
            v-model="accessToken"
            rows="5"
            cols="30"
            disabled
          />
        </div>
      </div>
      <JwtIoRedirectButton :token="accessToken" />
    </div>

    <div v-if="idToken" class="mb-2 flex flex-column gap-2 align-items-center">
      <div>
        <label for="id-token">id token</label>
        <div class="card flex justify-content-center">
          <Textarea
            id="id-token"
            v-model="idToken"
            rows="5"
            cols="30"
            disabled
          />
        </div>
      </div>
      <JwtIoRedirectButton :token="idToken" />
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
            v-model="refreshToken"
            rows="5"
            cols="30"
            disabled
          />
        </div>
      </div>
      <JwtIoRedirectButton :token="refreshToken" />
    </div>
    <div class="flex flex-column gap-2 align-items-center">
      <NuxtLink to="/"><Button label="Go Back" link /></NuxtLink>
    </div>
  </div>
</template>
