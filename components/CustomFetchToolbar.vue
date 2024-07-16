<script setup lang="ts">
const { fetchTokens, saveCredentials } = defineProps<{
  isFetchDisabled: boolean;
  isSaveDisabled: boolean;
  fetchTokens: () => Promise<void>;
  saveCredentials: () => Promise<void>;
}>();

const loadingFetch = useState(() => false);
const loadingFetchAndSave = useState(() => false);
const loading = computed(() => loadingFetch || loadingFetchAndSave);

async function fetchAndSave() {
  loadingFetchAndSave.value = true;
  await saveCredentials();
  await fetchTokens();
  loadingFetchAndSave.value = false;
}

async function fetchOnly() {
  loadingFetch.value = true;
  await fetchTokens();
  loadingFetch.value = false;
}
</script>

<template>
  <div class="flex align-items-center justify-content-center w-full gap-2">
    <Button
      icon="pi pi-check"
      aria-label="Submit"
      :loading="loadingFetch"
      label="Fetch"
      :disabled="isFetchDisabled || loading.value"
      @click="fetchOnly"
    />
    <Button
      icon="pi pi-check"
      aria-label="Submit"
      :loading="loadingFetchAndSave"
      label="Fetch & Save"
      :disabled="isFetchDisabled || isSaveDisabled || loading.value"
      @click="fetchAndSave"
    />
  </div>
</template>
