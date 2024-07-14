export default defineEventHandler(async () => {
  return await useStorage("data").getKeys("credentials");
});
