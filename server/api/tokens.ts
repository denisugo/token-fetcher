import type { TokensDto } from "~/types/tokens";

export default defineEventHandler(async () => {
  return (await useStorage("data").getItem<TokensDto>("tokens")) ?? {};
});
