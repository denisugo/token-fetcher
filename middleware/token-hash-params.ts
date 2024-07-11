export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;
  if (window.location.hash) {
    const hash = window.location.hash.substring(1); // Remove the leading #
    const searchParams = new URLSearchParams(hash);

    const idToken = searchParams.get("id_token");
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    if (idToken || accessToken || refreshToken) {
      window.location.hash = "";
      return navigateTo(
        `/tokens?${buildQueryForTokens(accessToken, idToken, refreshToken)}`,
      );
    }
  }
});
