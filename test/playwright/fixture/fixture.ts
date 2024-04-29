import fs from "fs";
import { Page, Locator, BrowserContext } from "@playwright/test";

export default class Fixture {
  public constructor(
    private readonly page: Page,
    private readonly contest: BrowserContext,
  ) {}
  private async loadData(): Promise<void> {
    const backup = fs.readFileSync(`./test/memosuku.bak`, `utf8`).split(`\n`);
    this.contest.addInitScript((backup) => {
      window.localStorage.setItem(`route`, backup[0]!);
      window.localStorage.setItem(`list`, backup[1]!);
      window.localStorage.setItem(`main`, backup[2]!);
      window.localStorage.setItem(`sub`, backup[3]!);
      window.localStorage.setItem(`conf`, backup[4]!);
    }, backup);
  }
  private async openPage(): Promise<void> {
    await this.page.goto(`/list1111111111111`);
  }
  public async initList(): Promise<void> {
    await this.loadData();
    await this.openPage();
    await this.page.getByTestId(`MainList`).click();
  }
  public async initMain(): Promise<void> {
    await this.loadData();
    await this.openPage();
  }
  public async initSub(): Promise<void> {
    await this.loadData();
    await this.openPage();
    await this.page.getByTestId(`MainItem`).nth(0).click();
  }
  public async initConf(): Promise<void> {
    await this.loadData();
    await this.openPage();
    await this.page.getByTestId(`MainConf`).click();
  }
  public async longClick(locator: Locator): Promise<void> {
    await locator.dispatchEvent(`touchstart`);
    await this.page.waitForTimeout(500);
    await locator.dispatchEvent(`touchend`);
  }
  public async dragDrop(from: Locator, to: Locator): Promise<void> {
    await from.hover();
    await this.page.mouse.down();
    await this.page.waitForTimeout(500);
    await to.hover();
    await this.page.mouse.up();
  }
}
