<script setup>
const clientValue = useState(() => 0);
const serverValue = useState(() => 0);
// const { data: serverValue } = await useFetch('/api/test')

async function send() {
  await $fetch("/api/test", {
    method: "POST",
    body: {
      clientValue: clientValue.value,
    },
  });
}

async function recieve() {
  const data = await $fetch("/api/test", {
    method: "GET",
  });
  serverValue.value = data;
}
</script>

<template>
  <p>{{ serverValue }}</p>
  <p>{{ clientValue }}</p>
  <Button
    icon="pi pi-check"
    aria-label="Submit"
    label="+"
    @click="clientValue++"
  />
  <Button icon="pi pi-check" aria-label="Submit" label="Post" @click="send()" />
  <Button
    icon="pi pi-check"
    aria-label="Submit"
    label="Get"
    @click="recieve()"
  />
</template>
