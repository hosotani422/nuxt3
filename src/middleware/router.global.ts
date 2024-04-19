import Api from "@/api/api";
import app from "@/stores/page/app";

export default defineNuxtRouteMiddleware(async () => {
  if (process.client) {
    if (!app.state.initClient) {
      app.state.initClient = true;
      return navigateTo(`/${await Api.readRoute()}`);
    } else if (app.state.backId) {
      const backId = app.state.backId;
      app.state.backId = ``;
      return navigateTo(`/${backId}`, { replace: true });
    }
  }
});
