import Fixture from "../fixture/fixture";

Cypress.on(`uncaught:exception`, () => false);
const fixture = new Fixture(cy);

describe(`sub`, () => {
  beforeEach(() => {
    fixture.initSub();
  });
  it(`page - init`, () => {
    cy.location(`pathname`).should(`eq`, `/list1111111111111/sub/main1111111111111`);
    fixture.getByTestId(`SubRight`).should(`have.length`, 1);
    fixture.getByTestId(`SubTitle`).should(`have.value`, `main1`);
    fixture.getByTestId(`SubMode`).should(`have.length`, 1);
    fixture.getByTestId(`SubItem`).should(`have.length`, 2);
    fixture.getByTestId(`SubCheck`).eq(0).should(`not.be.checked`);
    fixture.getByTestId(`SubCheck`).eq(1).should(`be.checked`);
    fixture.getByTestId(`SubTask`).eq(0).should(`have.value`, `sub1`);
    fixture.getByTestId(`SubTask`).eq(1).should(`have.value`, `sub2`);
    fixture.getByTestId(`SubItem`).eq(0).find(`[data-testid="SubDrag"]`).should(`have.length`, 1);
    fixture.getByTestId(`SubItem`).eq(1).find(`[data-testid="SubDrag"]`).should(`have.length`, 1);
    fixture.getByTestId(`SubItem`).eq(0).find(`[data-testid="SubTrash"]`).should(`have.length`, 1);
    fixture.getByTestId(`SubItem`).eq(1).find(`[data-testid="SubTrash"]`).should(`have.length`, 1);
    fixture.getByTestId(`SubCalendar`).should(`have.value`, `2000/01/01`);
    fixture.getByTestId(`SubClock`).should(`have.value`, `00:00`);
    fixture.getByTestId(`SubDialog`).should(`have.value`, `5分前,1時間前`);
  });
  it(`page - swipe`, () => {
    fixture.dragDrop(fixture.getByTestId(`SubBack`), 0, 200);
    cy.location(`pathname`).should(`eq`, `/list1111111111111`);
  });
  it(`page - back`, () => {
    fixture.getByTestId(`SubRight`).click();
    cy.location(`pathname`).should(`eq`, `/list1111111111111`);
  });
  it(`item - check`, () => {
    fixture.getByTestId(`SubCheck`).eq(0).check();
    fixture.getByTestId(`SubCheck`).eq(0).should(`be.checked`);
    fixture.getByTestId(`SubCheck`).eq(0).uncheck();
    fixture.getByTestId(`SubCheck`).eq(0).should(`not.be.checked`);
  });
  it(`item - edit`, () => {
    fixture.getByTestId(`SubTask`).eq(0).type(`{enter}`);
    fixture.getByTestId(`SubItem`).should(`have.length`, 3);
    fixture.getByTestId(`SubTask`).eq(1).should(`have.value`, ``);
    fixture.getByTestId(`SubTask`).eq(1).type(`{backspace}`);
    fixture.getByTestId(`SubItem`).should(`have.length`, 2);
    fixture.getByTestId(`SubTask`).eq(1).should(`have.value`, `sub2`);
  });
  it(`item - delete`, () => {
    fixture.getByTestId(`SubTask`).eq(0).click();
    fixture.getByTestId(`SubTrash`).eq(0).trigger(`click`);
    fixture.getByTestId(`SubItem`).should(`have.length`, 1);
    fixture.getByTestId(`SubTask`).eq(0).should(`have.value`, `sub2`);
    fixture.getByTestId(`NoticeBack`).click();
    fixture.getByTestId(`SubItem`).should(`have.length`, 2);
    fixture.getByTestId(`SubTask`).eq(0).should(`have.value`, `sub1`);
  });
  it(`item - mode`, () => {
    fixture.getByTestId(`SubMode`).click();
    fixture.getByTestId(`SubMemo`).should(`have.value`, `sub1\nsub2`);
    fixture.getByTestId(`SubMemo`).type(`{selectall}sub1\nsub2\nsub3`);
    fixture.getByTestId(`SubMode`).click();
    fixture.getByTestId(`SubItem`).should(`have.length`, 3);
    fixture.getByTestId(`SubCheck`).eq(0).should(`not.be.checked`);
    fixture.getByTestId(`SubCheck`).eq(1).should(`not.be.checked`);
    fixture.getByTestId(`SubCheck`).eq(2).should(`not.be.checked`);
    fixture.getByTestId(`SubTask`).eq(0).should(`have.value`, `sub1`);
    fixture.getByTestId(`SubTask`).eq(1).should(`have.value`, `sub2`);
    fixture.getByTestId(`SubTask`).eq(2).should(`have.value`, `sub3`);
    fixture.getByTestId(`SubItem`).eq(0).find(`[data-testid="SubDrag"]`).should(`have.length`, 1);
    fixture.getByTestId(`SubItem`).eq(1).find(`[data-testid="SubDrag"]`).should(`have.length`, 1);
    fixture.getByTestId(`SubItem`).eq(2).find(`[data-testid="SubDrag"]`).should(`have.length`, 1);
    fixture.getByTestId(`SubItem`).eq(0).find(`[data-testid="SubTrash"]`).should(`have.length`, 1);
    fixture.getByTestId(`SubItem`).eq(1).find(`[data-testid="SubTrash"]`).should(`have.length`, 1);
    fixture.getByTestId(`SubItem`).eq(2).find(`[data-testid="SubTrash"]`).should(`have.length`, 1);
  });
  it(`item - drag`, () => {
    fixture.dragDrop(fixture.getByTestId(`SubDrag`).eq(0), 0, 0, 200);
    fixture.getByTestId(`SubTask`).eq(1).should(`have.value`, `sub1`);
  });
  it(`option - calendar`, () => {
    fixture.getByTestId(`SubCalendar`).click();
    fixture.getByTestId(`CalendarDay`).eq(41).click();
    fixture.getByTestId(`SubCalendar`).should(`have.value`, `2000/01/02`);
    fixture.getByTestId(`SubCalendar`).click();
    fixture.getByTestId(`CalendarClear`).click();
    fixture.getByTestId(`SubCalendar`).should(`have.value`, ``);
  });
  it(`option - clock`, () => {
    fixture.getByTestId(`SubClock`).click();
    fixture.getByTestId(`ClockOk`).click();
    fixture.getByTestId(`SubClock`).should(`have.value`, `00:00`);
    fixture.getByTestId(`SubClock`).click();
    fixture.getByTestId(`ClockClear`).click();
    fixture.getByTestId(`SubClock`).should(`have.value`, ``);
  });
  it(`option - dialog`, () => {
    fixture.getByTestId(`SubDialog`).click();
    fixture.getByTestId(`DialogCheck`).eq(11).click();
    fixture.getByTestId(`DialogOk`).click();
    fixture.getByTestId(`SubDialog`).should(`have.value`, `5分前,1時間前,2日前`);
  });
  it(`option - limit`, () => {
    fixture.getByTestId(`SubCalendar`).click();
    fixture.getByTestId(`CalendarClear`).click();
    fixture.getByTestId(`SubCalendar`).invoke(`attr`, `class`).should(`not.contains`, ` text-theme-warn`);
    fixture.getByTestId(`SubClock`).invoke(`attr`, `class`).should(`not.contains`, ` text-theme-warn`);
    fixture.getByTestId(`SubDialog`).invoke(`attr`, `class`).should(`not.contains`, ` text-theme-warn`);
  });
});
