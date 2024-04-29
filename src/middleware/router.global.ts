import Api from "@/api/api";
import app from "@/stores/page/app";

export default defineNuxtRouteMiddleware(async () => {
  if (process.client) {
    if (app.temp.routeStart) {
      useRouter().push(`/${await Api.readRoute()}`);
      app.temp.routeStart = false;
    } else if (app.temp.backId) {
      useRouter().replace(`/${app.temp.backId}`);
      app.temp.backId = ``;
    }
  }
});
