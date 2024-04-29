import { mount, flushPromises, VueWrapper } from "@vue/test-utils";
import Base from "../base";
import PageApp from "@/app.vue";

export default class App extends Base {
  public static async getWrapper(): Promise<VueWrapper> {
    const wrapper = mount(
      {
        components: { PageApp },
        template: `<Suspense><PageApp /></Suspense>`,
      },
      {
        global: {
          stubs: {
            Html: { template: `<html><slot /></html>` },
            Head: { template: `<head><slot /></head>` },
            Title: { template: `<title>Memosuku</title>` },
            Meta: true,
            Link: true,
            NoScript: { template: `<noscript>JavaScript is required</noscript>` },
            Body: { template: `<body><slot /></body>` },
            NuxtPage: true,
            PopupCalendar: true,
            PopupClock: true,
            PopupDialog: true,
            PopupNotice: true,
          },
          directives: {
            focus: () => ``,
          },
        },
      },
    );
    await flushPromises();
    return wrapper;
  }
}
