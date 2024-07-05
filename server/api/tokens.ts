import type { TokensDto } from "~/types/tokens";
// TODO replace with query params in vue
export default defineEventHandler(async () => {
  const tokens = (await useStorage("data").getItem<TokensDto>("tokens")) ?? {};
  await useStorage("data").removeItem("tokens");
  return tokens;
});
