import { test, fixture } from "testcafe";
import Page from "../model/page";

fixture(`main`).beforeEach(async () => {
  await Page.initMain();
});
test(`page - init`, async (t) => {
  await t.expect(await Page.getUrl()).eql(`/list1111111111111`);
  await t.expect(Page.getByTestId(`MainList`).count).eql(1);
  await t.expect(Page.getByTestId(`MainTitle`).value).eql(`list1`);
  await t.expect(Page.getByTestId(`MainConf`).count).eql(1);
  await t.expect(Page.getByTestId(`MainPlus`).count).eql(1);
  await t.expect(Page.getByTestId(`MainItem`).count).eql(2);
  await t.expect(Page.getByTestId(`MainCheck`).nth(0).checked).eql(false);
  await t.expect(Page.getByTestId(`MainCheck`).nth(1).checked).eql(true);
  await t.expect(Page.getByTestId(`MainTask`).nth(0).textContent).eql(`main1`);
  await t.expect(Page.getByTestId(`MainTask`).nth(1).textContent).eql(`main2`);
  await t.expect(Page.getByTestId(`MainCount`).nth(0).textContent).eql(`1/2`);
  await t.expect(Page.getByTestId(`MainCount`).nth(1).textContent).eql(`1/1`);
});
test(`page - list`, async (t) => {
  await t.click(Page.getByTestId(`MainList`));
  await t.expect(await Page.getUrl()).eql(`/list1111111111111/list`);
});
test(`page - conf`, async (t) => {
  await t.click(Page.getByTestId(`MainConf`));
  await t.expect(await Page.getUrl()).eql(`/list1111111111111/conf`);
});
test(`page - select`, async (t) => {
  await t.click(Page.getByTestId(`MainItem`).nth(0));
  await t.expect(await Page.getUrl()).eql(`/list1111111111111/sub/main1111111111111`);
});
test(`item - create`, async (t) => {
  await t.click(Page.getByTestId(`MainPlus`));
  await t.typeText(Page.getByTestId(`DialogText`), `main3`, { replace: true });
  await t.click(Page.getByTestId(`DialogOk`));
  await t.expect(Page.getByTestId(`MainItem`).count).eql(3);
  await t.expect(Page.getByTestId(`MainCheck`).nth(0).checked).eql(false);
  await t.expect(Page.getByTestId(`MainTask`).nth(0).textContent).eql(`main3`);
  await t.expect(Page.getByTestId(`MainCount`).nth(0).textContent).eql(`1/1`);
});
test(`item - select`, async (t) => {
  await t.click(Page.getByTestId(`MainItem`).nth(0));
  await t.expect(Page.getByTestId(`MainItem`).nth(0).classNames).contains(`select`);
  await t.click(Page.getByTestId(`SubRight`));
  await t.expect(Page.getByTestId(`MainItem`).nth(0).classNames).notContains(`select`);
});
test(`item - check`, async (t) => {
  await t.click(Page.getByTestId(`MainCheck`).nth(0));
  await t.expect(Page.getByTestId(`MainCheck`).nth(0).checked).eql(true);
  await t.expect(Page.getByTestId(`MainTask`).nth(0).textContent).eql(`main2`);
  await t.click(Page.getByTestId(`MainCheck`).nth(1));
  await t.expect(Page.getByTestId(`MainCheck`).nth(0).checked).eql(false);
  await t.expect(Page.getByTestId(`MainTask`).nth(0).textContent).eql(`main1`);
});
test(`item - title`, async (t) => {
  await t.click(Page.getByTestId(`MainItem`).nth(0));
  await t.typeText(Page.getByTestId(`SubTitle`), `main0`, { replace: true });
  await t.click(Page.getByTestId(`SubRight`));
  await t.expect(Page.getByTestId(`MainTask`).nth(0).textContent).eql(`main0`);
});
test(`item - count`, async (t) => {
  await t.click(Page.getByTestId(`MainItem`).nth(0));
  await t.click(Page.getByTestId(`SubCheck`).nth(0));
  await t.click(Page.getByTestId(`SubRight`));
  await t.expect(Page.getByTestId(`MainCount`).nth(0).textContent).eql(`0/2`);
});
test(`item - limit`, async (t) => {
  await t.click(Page.getByTestId(`MainItem`).nth(0));
  await t.click(Page.getByTestId(`SubCalendar`));
  await t.click(Page.getByTestId(`CalendarClear`));
  await t.click(Page.getByTestId(`SubRight`));
  await t.expect(Page.getByTestId(`MainTask`).nth(0).classNames).notContains(`text-theme-warn`);
});
test(`item - clone`, async (t) => {
  await Page.longClick(Page.getByTestId(`MainItem`).nth(0));
  await t.click(Page.getByTestId(`MainClone`));
  await t.expect(Page.getByTestId(`MainItem`).count).eql(3);
  await t.expect(Page.getByTestId(`MainCheck`).nth(1).checked).eql(false);
  await t.expect(Page.getByTestId(`MainTask`).nth(1).textContent).eql(`main1`);
  await t.expect(Page.getByTestId(`MainCount`).nth(1).textContent).eql(`1/2`);
});
test(`item - move`, async (t) => {
  await Page.longClick(Page.getByTestId(`MainItem`).nth(0));
  await t.click(Page.getByTestId(`MainMove`));
  await t.click(Page.getByTestId(`DialogRadio`).nth(1));
  await t.click(Page.getByTestId(`DialogOk`));
  await t.expect(Page.getByTestId(`MainItem`).count).eql(1);
  await t.click(Page.getByTestId(`MainList`));
  await t.click(Page.getByTestId(`ListItem`).nth(1));
  await t.expect(Page.getByTestId(`MainItem`).count).eql(1);
  await t.expect(Page.getByTestId(`MainCheck`).nth(0).checked).eql(false);
  await t.expect(Page.getByTestId(`MainTask`).nth(0).textContent).eql(`main1`);
  await t.expect(Page.getByTestId(`MainCount`).nth(0).textContent).eql(`1/2`);
});
test(`item - delete`, async (t) => {
  await Page.longClick(Page.getByTestId(`MainItem`).nth(0));
  await t.click(Page.getByTestId(`MainTrash`));
  await t.expect(Page.getByTestId(`MainItem`).count).eql(1);
  await t.click(Page.getByTestId(`MainList`));
  await t.click(Page.getByTestId(`ListItem`).nth(2));
  await t.expect(Page.getByTestId(`MainItem`).count).eql(1);
  await t.expect(Page.getByTestId(`MainCheck`).nth(0).checked).eql(false);
  await t.expect(Page.getByTestId(`MainTask`).nth(0).textContent).eql(`main1`);
  await t.expect(Page.getByTestId(`MainCount`).nth(0).textContent).eql(`1/2`);
  await t.click(Page.getByTestId(`NoticeBack`));
  await t.expect(Page.getByTestId(`MainItem`).count).eql(0);
  await t.click(Page.getByTestId(`MainList`));
  await t.click(Page.getByTestId(`ListItem`).nth(0));
  await t.expect(Page.getByTestId(`MainItem`).count).eql(2);
  await t.expect(Page.getByTestId(`MainCheck`).nth(0).checked).eql(false);
  await t.expect(Page.getByTestId(`MainTask`).nth(0).textContent).eql(`main1`);
  await t.expect(Page.getByTestId(`MainCount`).nth(0).textContent).eql(`1/2`);
});
test(`item - drag`, async (t) => {
  await Page.dragDrop(Page.getByTestId(`MainItem`).nth(0), 0, 100);
  await t.expect(Page.getByTestId(`MainTask`).nth(1).textContent).eql(`main1`);
});
test(`item - edit`, async (t) => {
  await Page.longClick(Page.getByTestId(`MainItem`).nth(1));
  await t.expect(Page.getByTestId(`MainItem`).nth(1).classNames).contains(`edit`);
  await t.click(Page.getByTestId(`MainTitle`));
  await t.expect(Page.getByTestId(`MainItem`).nth(1).classNames).notContains(`edit`);
});
