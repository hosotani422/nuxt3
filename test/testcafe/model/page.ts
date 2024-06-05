import * as fs from "fs";
import { Selector, t, ClientFunction } from "testcafe";

export default class Page {
  private static async loadData(): Promise<void> {
    const backup = fs.readFileSync(`./test/memosuku.bak`, `utf8`).split(`\n`);
    await ClientFunction((route, list, main, sub, conf) => {
      localStorage.setItem(`route`, route);
      localStorage.setItem(`list`, list);
      localStorage.setItem(`main`, main);
      localStorage.setItem(`sub`, sub);
      localStorage.setItem(`conf`, conf);
    })(backup[0], backup[1], backup[2], backup[3], backup[4]);
  }
  private static async openPage(): Promise<void> {
    await t.navigateTo(`/list1111111111111`);
  }
  public static getByTestId(selector: string): Selector {
    return Selector(`[data-testid="${selector}"]`);
  }
  public static async getUrl(): Promise<string> {
    return await ClientFunction(() => location.pathname)();
  }
  public static async initList(): Promise<void> {
    await this.loadData();
    await this.openPage();
    await t.click(this.getByTestId(`MainList`));
  }
  public static async initMain(): Promise<void> {
    await this.loadData();
    await this.openPage();
  }
  public static async initSub(): Promise<void> {
    await this.loadData();
    await this.openPage();
    await t.click(this.getByTestId(`MainItem`).nth(0));
  }
  public static async initConf(): Promise<void> {
    await this.loadData();
    await this.openPage();
    await t.click(this.getByTestId(`MainConf`));
  }
  public static async longClick(
    selector:
      | string
      | Selector
      | NodeSnapshot
      | SelectorPromise
      | ((...args: unknown[]) => Node | Node[] | NodeList | HTMLCollection),
  ): Promise<void> {
    await t.dispatchEvent(selector, `touchstart`).wait(500).dispatchEvent(selector, `touchend`);
  }
  public static async dragDrop(
    selector:
      | string
      | Selector
      | NodeSnapshot
      | SelectorPromise
      | ((...args: unknown[]) => Node | Node[] | NodeList | HTMLCollection),
    clientX: number = 0,
    clientY: number = 0,
  ): Promise<void> {
    await t.dispatchEvent(selector, `mousedown`);
    await t.wait(500);
    await t.dispatchEvent(selector, `mousemove`, { clientX, clientY });
    await t.dispatchEvent(selector, `mouseup`);
  }
}
