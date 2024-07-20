<script setup lang="ts">
import type { ToastServiceMethods } from "primevue/toastservice";

const { deleteCredentials, saveCredentials, toast } = defineProps<{
  isSaveDisabled: boolean;
  deleteCredentials: () => Promise<void>;
  saveCredentials: () => Promise<void>;
  toast: ToastServiceMethods;
}>();

const {
  query: { key: isDeleteVisible },
} = useRoute();

const loadingDelete = ref(false);
const loadingSave = ref(false);
const loading = computed(() => loadingDelete.value || loadingSave.value);

async function saveCredentialsWithLoading() {
  loadingSave.value = true;
  await saveCredentials();
  loadingSave.value = false;
  toast.add({
    severity: "success",
    summary: "Successfully saved",
    life: 3000,
  });
}

async function deleteCredentialsWithLoading() {
  loadingDelete.value = true;
  await deleteCredentials();
  loadingDelete.value = false;
  toast.add({
    severity: "success",
    summary: "Successfully deleted",
    life: 3000,
  });
}
</script>
<template>
  <div class="flex align-items-center justify-content-center w-full gap-2">
    <Button
      icon="pi pi-save"
      aria-label="Save credentials"
      label="Save"
      :loading="loadingSave"
      :disabled="isSaveDisabled || loading"
      @click="saveCredentialsWithLoading"
    />
    <Button
      v-if="isDeleteVisible"
      icon="pi pi-trash"
      aria-label="Delete Credentials"
      label="Delete"
      severity="danger"
      :loading="loadingDelete"
      @click="deleteCredentialsWithLoading"
    />
  </div>
</template>
