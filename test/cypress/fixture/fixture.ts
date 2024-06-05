export default class Fixture {
  public constructor(private readonly cy: Cypress.cy & CyEventEmitter) {}
  private loadData(): void {
    this.cy.readFile(`./test/memosuku.bak`, `utf8`).then((result) => {
      const backup = result.split(`\n`);
      localStorage.setItem(`route`, backup[0]!);
      localStorage.setItem(`list`, backup[1]!);
      localStorage.setItem(`main`, backup[2]!);
      localStorage.setItem(`sub`, backup[3]!);
      localStorage.setItem(`conf`, backup[4]!);
    });
  }
  private openPage(): void {
    this.cy.visit(`/list1111111111111`);
    this.cy.wait(1000);
  }
  public initList(): void {
    this.loadData();
    this.openPage();
    this.getByTestId(`MainList`).click();
    this.cy.wait(1000);
  }
  public initMain(): void {
    this.loadData();
    this.openPage();
  }
  public initSub(): void {
    this.loadData();
    this.openPage();
    this.getByTestId(`MainItem`).eq(0).click();
    this.cy.wait(1000);
  }
  public initConf(): void {
    this.loadData();
    this.openPage();
    this.getByTestId(`MainConf`).eq(0).click();
  }
  public getByTestId(selector: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.cy.get(`[data-testid="${selector}"]`);
  }
  public longClick(locator: Cypress.Chainable<JQuery<HTMLElement>>): void {
    locator.trigger(`touchstart`);
    this.cy.wait(500);
    locator.trigger(`touchend`);
  }
  public dragDrop(
    locator: Cypress.Chainable<JQuery<HTMLElement>>,
    waitTime: number = 0,
    clientX: number = 0,
    clientY: number = 0,
  ): void {
    locator.trigger(`mousedown`, { which: 1, force: true });
    waitTime && this.cy.wait(waitTime);
    locator.trigger(`mousemove`, { which: 1, clientX, clientY, force: true });
    locator.trigger(`mouseup`, { force: true });
  }
}
