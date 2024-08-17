<script setup lang="ts">
defineProps<{
  grantName: string;
  isFetchDisabled: boolean;
  isSaveDisabled: boolean;
  fetchTokens: (finishLoading: () => void) => Promise<void>;
  saveCredentials: () => Promise<void>;
  deleteCredentials: () => Promise<void>;
}>();

const title = defineModel<string>("title");
const toast = useToast();
</script>

<template>
  <Toast />
  <div class="grid w-full">
    <div class="col-6 col-offset-3">
      <div class="w-full flex justify-content-center">
        <h1 class="text-xl">{{ grantName }}</h1>
      </div>
    </div>

    <div class="col-4 col-offset-4">
      <div class="flex flex-column gap-2 w-full">
        <label for="title"> title</label>
        <div class="flex gap-2 w-full">
          <InputText id="title" v-model="title" class="w-10rem" />
          <CustomStorageToolbar
            :delete-credentials="deleteCredentials"
            :save-credentials="saveCredentials"
            :is-save-disabled="!title"
            :toast="toast"
          />
        </div>
      </div>
    </div>
    <Divider />
    <div class="col-4 col-offset-4">
      <slot />
    </div>
    <div class="col-6 col-offset-3">
      <CustomFetchToolbar
        :is-fetch-disabled="isFetchDisabled"
        :is-save-disabled="!title"
        :fetch-tokens="fetchTokens"
        :save-credentials="saveCredentials"
      />
    </div>
  </div>
</template>
