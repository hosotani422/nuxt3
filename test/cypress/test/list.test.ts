import Fixture from "../fixture/fixture";

Cypress.on(`uncaught:exception`, () => false);
const fixture = new Fixture(cy);

describe(`list`, () => {
  beforeEach(() => {
    fixture.initList();
  });
  it(`page - init`, () => {
    cy.location(`pathname`).should(`eq`, `/list1111111111111/list`);
    fixture.getByTestId(`ListPlus`).should(`have.length`, 1);
    fixture.getByTestId(`ListTitle`).should(`have.text`, `Memosuku`);
    fixture.getByTestId(`ListLeft`).should(`have.length`, 1);
    fixture.getByTestId(`ListItem`).should(`have.length`, 3);
    fixture.getByTestId(`ListIcon`).eq(0).find(`title`).invoke(`attr`, `id`).should(`eq`, `list`);
    fixture.getByTestId(`ListIcon`).eq(1).find(`title`).invoke(`attr`, `id`).should(`eq`, `inbox`);
    fixture.getByTestId(`ListIcon`).eq(2).find(`title`).invoke(`attr`, `id`).should(`eq`, `trash`);
    fixture.getByTestId(`ListTask`).eq(0).should(`have.text`, `list1`);
    fixture.getByTestId(`ListTask`).eq(1).should(`have.text`, `Inbox`);
    fixture.getByTestId(`ListTask`).eq(2).should(`have.text`, `Trash`);
    fixture.getByTestId(`ListCount`).eq(0).should(`have.text`, `1/2`);
    fixture.getByTestId(`ListCount`).eq(1).should(`have.text`, `0/0`);
    fixture.getByTestId(`ListCount`).eq(2).should(`have.text`, `0/0`);
  });
  it(`page - swipe`, () => {
    fixture.dragDrop(fixture.getByTestId(`ListBack`), 0, -200);
    cy.location(`pathname`).should(`eq`, `/list1111111111111`);
  });
  it(`page - back`, () => {
    fixture.getByTestId(`ListLeft`).click();
    cy.location(`pathname`).should(`eq`, `/list1111111111111`);
  });
  it(`page - select`, () => {
    fixture.getByTestId(`ListItem`).eq(2).click();
    cy.location(`pathname`).should(`eq`, `/list9999999999999`);
  });
  it(`item - create`, () => {
    fixture.getByTestId(`ListPlus`).click();
    fixture.getByTestId(`DialogText`).type(`list2`);
    fixture.getByTestId(`DialogOk`).click();
    fixture.getByTestId(`ListItem`).should(`have.length`, 4);
    fixture.getByTestId(`ListIcon`).eq(0).find(`title`).invoke(`attr`, `id`).should(`eq`, `list`);
    fixture.getByTestId(`ListTask`).eq(0).should(`have.text`, `list2`);
    fixture.getByTestId(`ListCount`).eq(0).should(`have.text`, `0/0`);
  });
  it(`item - select`, () => {
    fixture.getByTestId(`ListItem`).eq(1).click();
    fixture.getByTestId(`MainList`).click();
    fixture.getByTestId(`ListItem`).eq(1).invoke(`attr`, `class`).should(`contains`, ` select`);
  });
  it(`item - title`, () => {
    fixture.getByTestId(`ListItem`).eq(0).click();
    fixture.getByTestId(`MainTitle`).type(`{selectall}list0`);
    fixture.getByTestId(`MainList`).click();
    fixture.getByTestId(`ListTask`).eq(0).should(`have.text`, `list0`);
  });
  it(`item - count`, () => {
    fixture.getByTestId(`ListItem`).eq(0).click();
    fixture.getByTestId(`MainCheck`).eq(0).check();
    fixture.getByTestId(`MainList`).click();
    fixture.getByTestId(`ListCount`).eq(0).should(`have.text`, `0/2`);
  });
  it(`item - limit`, () => {
    fixture.getByTestId(`ListItem`).eq(0).click();
    fixture.getByTestId(`MainItem`).eq(0).click();
    fixture.getByTestId(`SubCalendar`).click();
    fixture.getByTestId(`CalendarClear`).click();
    fixture.getByTestId(`SubRight`).click();
    fixture.getByTestId(`MainList`).click();
    fixture.getByTestId(`ListTask`).eq(0).invoke(`attr`, `class`).should(`not.contains`, ` text-theme-warn`);
    fixture.getByTestId(`ListCount`).eq(0).invoke(`attr`, `class`).should(`not.contains`, ` text-theme-warn`);
  });
  it(`item - clone`, () => {
    fixture.longClick(fixture.getByTestId(`ListItem`).eq(0));
    fixture.getByTestId(`ListClone`).eq(0).click();
    fixture.getByTestId(`ListItem`).should(`have.length`, 4);
    fixture.getByTestId(`ListIcon`).eq(1).find(`title`).invoke(`attr`, `id`).should(`eq`, `list`);
    fixture.getByTestId(`ListTask`).eq(1).should(`have.text`, `list1`);
    fixture.getByTestId(`ListCount`).eq(1).should(`have.text`, `1/2`);
  });
  it(`item - delete`, () => {
    fixture.getByTestId(`ListItem`).eq(1).click();
    fixture.getByTestId(`MainList`).click();
    fixture.longClick(fixture.getByTestId(`ListItem`).eq(0));
    fixture.getByTestId(`ListTrash`).click();
    fixture.getByTestId(`DialogOk`).click();
    fixture.getByTestId(`ListItem`).should(`have.length`, 2);
    fixture.getByTestId(`ListCount`).eq(1).should(`have.text`, `1/2`);
    fixture.getByTestId(`NoticeBack`).click();
    fixture.getByTestId(`ListItem`).should(`have.length`, 3);
    fixture.getByTestId(`ListCount`).eq(2).should(`have.text`, `0/0`);
  });
  it(`item - drag`, () => {
    fixture.dragDrop(fixture.getByTestId(`ListItem`).eq(0), 500, 0, 200);
    fixture.getByTestId(`ListTask`).eq(1).should(`have.text`, `list1`);
  });
  it(`item - edit`, () => {
    fixture.longClick(fixture.getByTestId(`ListItem`).eq(1));
    fixture.getByTestId(`ListItem`).eq(1).invoke(`attr`, `class`).should(`contains`, ` edit`);
    fixture.getByTestId(`ListTitle`).click();
    fixture.getByTestId(`ListItem`).eq(1).invoke(`attr`, `class`).should(`not.contains`, ` edit`);
  });
  it(`item - current`, () => {
    fixture.longClick(fixture.getByTestId(`ListItem`).eq(0));
    fixture.getByTestId(`ListClone`).should(`have.length`, 2);
    fixture.getByTestId(`ListTrash`).should(`have.length`, 1);
  });
  it(`item - normal`, () => {
    fixture.longClick(fixture.getByTestId(`ListItem`).eq(1));
    fixture.getByTestId(`ListClone`).should(`have.length`, 2);
    fixture.getByTestId(`ListTrash`).should(`have.length`, 1);
  });
  it(`item - trash`, () => {
    fixture.longClick(fixture.getByTestId(`ListItem`).eq(2));
    fixture.getByTestId(`ListClone`).should(`have.length`, 2);
    fixture.getByTestId(`ListTrash`).should(`have.length`, 1);
  });
});
