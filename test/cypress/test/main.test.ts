import Fixture from "../fixture/fixture";

Cypress.on(`uncaught:exception`, () => false);
const fixture = new Fixture(cy);

describe(`main`, () => {
  beforeEach(() => {
    fixture.initMain();
  });
  it(`page - init`, () => {
    cy.location(`pathname`).should(`eq`, `/list1111111111111`);
    fixture.getByTestId(`MainList`).should(`have.length`, 1);
    fixture.getByTestId(`MainTitle`).should(`have.value`, `list1`);
    fixture.getByTestId(`MainConf`).should(`have.length`, 1);
    fixture.getByTestId(`MainPlus`).should(`have.length`, 1);
    fixture.getByTestId(`MainItem`).should(`have.length`, 2);
    fixture.getByTestId(`MainCheck`).eq(0).should(`not.be.checked`);
    fixture.getByTestId(`MainCheck`).eq(1).should(`be.checked`);
    fixture.getByTestId(`MainTask`).eq(0).should(`have.text`, `main1`);
    fixture.getByTestId(`MainTask`).eq(1).should(`have.text`, `main2`);
    fixture.getByTestId(`MainCount`).eq(0).should(`have.text`, `1/2`);
    fixture.getByTestId(`MainCount`).eq(1).should(`have.text`, `0/0`);
  });
  it(`page - list`, () => {
    fixture.getByTestId(`MainList`).click();
    cy.location(`pathname`).should(`eq`, `/list1111111111111/list`);
  });
  it(`page - conf`, () => {
    fixture.getByTestId(`MainConf`).click();
    cy.location(`pathname`).should(`eq`, `/list1111111111111/conf`);
  });
  it(`page - select`, () => {
    fixture.getByTestId(`MainItem`).eq(0).click();
    cy.location(`pathname`).should(`eq`, `/list1111111111111/sub/main1111111111111`);
  });
  it(`item - create`, () => {
    fixture.getByTestId(`MainPlus`).click();
    fixture.getByTestId(`DialogText`).type(`main3`);
    fixture.getByTestId(`DialogOk`).click();
    fixture.getByTestId(`MainItem`).should(`have.length`, 3);
    fixture.getByTestId(`MainCheck`).eq(0).should(`not.be.checked`);
    fixture.getByTestId(`MainTask`).eq(0).should(`have.text`, `main3`);
    fixture.getByTestId(`MainCount`).eq(0).should(`have.text`, `1/1`);
  });
  it(`item - select`, () => {
    fixture.getByTestId(`MainItem`).eq(0).click();
    fixture.getByTestId(`MainItem`).eq(0).invoke(`attr`, `class`).should(`contains`, ` select`);
    fixture.getByTestId(`SubRight`).click();
    fixture.getByTestId(`MainItem`).eq(0).invoke(`attr`, `class`).should(`not.contains`, ` select`);
  });
  it(`item - check`, () => {
    fixture.getByTestId(`MainCheck`).eq(0).check();
    fixture.getByTestId(`MainCheck`).eq(0).should(`be.checked`);
    fixture.getByTestId(`MainCheck`).eq(0).uncheck();
    fixture.getByTestId(`MainCheck`).eq(0).should(`not.be.checked`);
  });
  it(`item - title`, () => {
    fixture.getByTestId(`MainItem`).eq(0).click();
    fixture.getByTestId(`SubTitle`).type(`{selectall}main0`);
    fixture.getByTestId(`SubRight`).click();
    fixture.getByTestId(`MainTask`).eq(0).should(`have.text`, `main0`);
  });
  it(`item - count`, () => {
    fixture.getByTestId(`MainItem`).eq(0).click();
    fixture.getByTestId(`SubCheck`).eq(0).check();
    fixture.getByTestId(`SubRight`).click();
    fixture.getByTestId(`MainCount`).eq(0).should(`have.text`, `0/2`);
  });
  it(`item - limit`, () => {
    fixture.getByTestId(`MainItem`).eq(0).click();
    fixture.getByTestId(`SubCalendar`).click();
    fixture.getByTestId(`CalendarClear`).click();
    fixture.getByTestId(`SubRight`).click();
    fixture.getByTestId(`MainTask`).eq(0).invoke(`attr`, `class`).should(`not.contains`, ` text-theme-warn`);
  });
  it(`item - clone`, () => {
    fixture.longClick(fixture.getByTestId(`MainItem`).eq(0));
    fixture.getByTestId(`MainClone`).eq(0).click();
    fixture.getByTestId(`MainItem`).should(`have.length`, 3);
    fixture.getByTestId(`MainCheck`).eq(1).should(`not.be.checked`);
    fixture.getByTestId(`MainTask`).eq(1).should(`have.text`, `main1`);
    fixture.getByTestId(`MainCount`).eq(1).should(`have.text`, `1/2`);
  });
  it(`item - move`, () => {
    fixture.longClick(fixture.getByTestId(`MainItem`).eq(0));
    fixture.getByTestId(`MainMove`).eq(0).click();
    fixture.getByTestId(`DialogRadio`).eq(0).check();
    fixture.getByTestId(`DialogOk`).click();
    fixture.getByTestId(`MainItem`).should(`have.length`, 1);
    fixture.getByTestId(`MainList`).click();
    fixture.getByTestId(`ListItem`).eq(1).click();
    fixture.getByTestId(`MainItem`).should(`have.length`, 1);
    fixture.getByTestId(`MainCheck`).eq(0).should(`not.be.checked`);
    fixture.getByTestId(`MainTask`).eq(0).should(`have.text`, `main1`);
    fixture.getByTestId(`MainCount`).eq(0).should(`have.text`, `1/2`);
  });
  it(`item - delete`, () => {
    fixture.longClick(fixture.getByTestId(`MainItem`).eq(0));
    fixture.getByTestId(`MainTrash`).eq(0).click();
    fixture.getByTestId(`MainItem`).should(`have.length`, 1);
    fixture.getByTestId(`MainList`).click();
    fixture.getByTestId(`ListItem`).eq(2).click();
    fixture.getByTestId(`MainItem`).should(`have.length`, 1);
    fixture.getByTestId(`MainCheck`).eq(0).should(`not.be.checked`);
    fixture.getByTestId(`MainTask`).eq(0).should(`have.text`, `main1`);
    fixture.getByTestId(`MainCount`).eq(0).should(`have.text`, `1/2`);
    fixture.getByTestId(`NoticeBack`).click();
    fixture.getByTestId(`MainItem`).should(`have.length`, 0);
    fixture.getByTestId(`MainList`).click();
    fixture.getByTestId(`ListItem`).eq(0).click();
    fixture.getByTestId(`MainItem`).should(`have.length`, 2);
    fixture.getByTestId(`MainCheck`).eq(0).should(`not.be.checked`);
    fixture.getByTestId(`MainTask`).eq(0).should(`have.text`, `main1`);
    fixture.getByTestId(`MainCount`).eq(0).should(`have.text`, `1/2`);
  });
  it(`item - drag`, () => {
    fixture.dragDrop(fixture.getByTestId(`MainItem`).eq(0), 500, 0, 200);
    fixture.getByTestId(`MainTask`).eq(1).should(`have.text`, `main1`);
  });
  it(`item - edit`, () => {
    fixture.longClick(fixture.getByTestId(`MainItem`).eq(1));
    fixture.getByTestId(`MainItem`).eq(1).invoke(`attr`, `class`).should(`contains`, ` edit`);
    fixture.getByTestId(`MainTitle`).click();
    fixture.getByTestId(`MainItem`).eq(1).invoke(`attr`, `class`).should(`not.contains`, ` edit`);
  });
});
