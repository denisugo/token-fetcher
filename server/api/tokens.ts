import type { TokensDto } from "~/types/tokens";

export default defineEventHandler(() => {
  return ((global as any).tokens ?? {}) as TokensDto;
});
