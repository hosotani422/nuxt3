import { vi } from "vitest";
import fs from "fs";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";

export default class Base {
  public static async loadData(): Promise<void> {
    const backup = fs.readFileSync(`./test/memotea.bak`, `utf-8`).split(`\n`);
    app.state.backId = backup[0]!;
    list.state.data = JSON.parse(backup[1]!);
    main.state.data = JSON.parse(backup[2]!);
    sub.state.data = JSON.parse(backup[3]!);
    conf.state.data = JSON.parse(backup[4]!);
  }
  public static async loadLang(): Promise<void> {
    await app.action.initI18n();
  }
  public static setRouter(): void {
    vi.mock(`vue-router`, () => ({
      useRoute: () => ({
        params: { listId: `list1111111111111`, mainId: `main1111111111111` },
      }),
    }));
  }
}
