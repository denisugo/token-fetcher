// TODO To be removed

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(await $fetch("https://www.google.com"));
  (global as any).testValue = body.clientValue;
});
