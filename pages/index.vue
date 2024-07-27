<script setup lang="ts">
const { data: keys } = await useFetch("/api/credentials/all-credential-keys");
const displayReadyKeys = computed(() =>
  keys.value
    ?.map((key) => {
      const keyArr = key.split(":"); // -- is not used in base64, 0 index stands for "credentials"
      const link = keyArr[1];
      const keyQuery = keyArr[2]; // copying a primitive value
      return { label: `${link} ${base64ToString(keyArr[2])}`, keyQuery, link };
    })
    .sort((a, b) => {
      const labelA = a.label.toUpperCase(); // ignore upper and lowercase
      const labelB = b.label.toUpperCase(); // ignore upper and lowercase
      if (labelA < labelB) return -1;
      if (labelA > labelB) return 1;
      return 0;
    }),
);
</script>

<template>
  <div
    class="flex align-items-center justify-content-center flex-column h-full w-full"
  >
    <h3>Pick a flow</h3>
    <div class="flex flex-column align-items-start">
      <NuxtLink to="/authorization-code"
        ><Button label="Authorization Code" link
      /></NuxtLink>
      <NuxtLink to="/implicit"
        ><Image
          src="/icons/under-construction.png"
          width="25"
          height="25" /><Button label="Implicit" link
      /></NuxtLink>
      <NuxtLink to="/refresh-token"
        ><Button label="Refresh Token" link
      /></NuxtLink>
    </div>
    <Divider />

    <h3>Or Pick a Saved Item</h3>
    <div class="card flex justify-content-center">
      <Listbox :options="displayReadyKeys" list-style="max-height:300px">
        <template #option="slotProps">
          <NuxtLink
            :to="`/${slotProps.option.link}?key=${slotProps.option.keyQuery}`"
            ><Button :label="slotProps.option.label" link
          /></NuxtLink>
        </template>
      </Listbox>
    </div>
  </div>
</template>
