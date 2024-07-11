<template>
  <div
    class="flex align-items-center justify-content-center flex-column h-full w-full"
  >
    <h3>Pick a flow</h3>
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
</template>
