import { test, fixture } from "testcafe";
import Page from "../model/page";

fixture(`list`).beforeEach(async () => {
  await Page.initList();
});
test(`page - init`, async (t) => {
  await t.expect(await Page.getUrl()).eql(`/list1111111111111/list`);
  await t.expect(Page.getByTestId(`ListPlus`).count).eql(1);
  await t.expect(Page.getByTestId(`ListTitle`).textContent).eql(`Memotea`);
  await t.expect(Page.getByTestId(`ListLeft`).count).eql(1);
  await t.expect(Page.getByTestId(`ListItem`).count).eql(3);
  await t.expect(Page.getByTestId(`ListIcon`).nth(0).find(`title`).getAttribute(`id`)).eql(`list`);
  await t.expect(Page.getByTestId(`ListIcon`).nth(1).find(`title`).getAttribute(`id`)).eql(`inbox`);
  await t.expect(Page.getByTestId(`ListIcon`).nth(2).find(`title`).getAttribute(`id`)).eql(`trash`);
  await t.expect(Page.getByTestId(`ListTask`).nth(0).textContent).eql(`list1`);
  await t.expect(Page.getByTestId(`ListTask`).nth(1).textContent).eql(`Inbox`);
  await t.expect(Page.getByTestId(`ListTask`).nth(2).textContent).eql(`Trash`);
  await t.expect(Page.getByTestId(`ListCount`).nth(0).textContent).eql(`1/2`);
  await t.expect(Page.getByTestId(`ListCount`).nth(1).textContent).eql(`0/0`);
  await t.expect(Page.getByTestId(`ListCount`).nth(2).textContent).eql(`0/0`);
});
test(`page - swipe`, async (t) => {
  await Page.dragDrop(Page.getByTestId(`ListBack`).nth(0), -100, 0);
  await t.expect(await Page.getUrl()).eql(`/list1111111111111`);
});
test(`page - back`, async (t) => {
  await t.click(Page.getByTestId(`ListLeft`));
  await t.expect(await Page.getUrl()).eql(`/list1111111111111`);
});
test(`page - select`, async (t) => {
  await t.click(Page.getByTestId(`ListItem`).nth(2));
  await t.expect(await Page.getUrl()).eql(`/list9999999999999`);
});
test(`item - create`, async (t) => {
  await t.click(Page.getByTestId(`ListPlus`));
  await t.typeText(Page.getByTestId(`DialogText`), `list2`, { replace: true });
  await t.click(Page.getByTestId(`DialogOk`));
  await t.expect(Page.getByTestId(`ListItem`).count).eql(4);
  await t.expect(Page.getByTestId(`ListIcon`).nth(0).find(`title`).getAttribute(`id`)).eql(`list`);
  await t.expect(Page.getByTestId(`ListTask`).nth(0).textContent).eql(`list2`);
  await t.expect(Page.getByTestId(`ListCount`).nth(0).textContent).eql(`0/0`);
});
test(`item - select`, async (t) => {
  await t.click(Page.getByTestId(`ListItem`).nth(1));
  await t.click(Page.getByTestId(`MainList`));
  await t.expect(Page.getByTestId(`ListItem`).nth(1).classNames).contains(`select`);
});
test(`item - title`, async (t) => {
  await t.click(Page.getByTestId(`ListItem`).nth(0));
  await t.typeText(Page.getByTestId(`MainTitle`), `list0`, { replace: true });
  await t.click(Page.getByTestId(`MainList`));
  await t.expect(Page.getByTestId(`ListTask`).nth(0).textContent).eql(`list0`);
});
test(`item - count`, async (t) => {
  await t.click(Page.getByTestId(`ListItem`).nth(0));
  await t.click(Page.getByTestId(`MainCheck`).nth(0));
  await t.click(Page.getByTestId(`MainList`));
  await t.expect(Page.getByTestId(`ListCount`).nth(0).textContent).eql(`0/2`);
});
test(`item - limit`, async (t) => {
  await t.click(Page.getByTestId(`ListItem`).nth(0));
  await t.click(Page.getByTestId(`MainItem`).nth(0));
  await t.click(Page.getByTestId(`SubCalendar`));
  await t.click(Page.getByTestId(`CalendarClear`));
  await t.click(Page.getByTestId(`SubRight`));
  await t.click(Page.getByTestId(`MainList`));
  await t.expect(Page.getByTestId(`ListTask`).nth(0).classNames).notContains(`text-theme-warn`);
  await t.expect(Page.getByTestId(`ListCount`).nth(0).classNames).notContains(`text-theme-warn`);
});
test(`item - clone`, async (t) => {
  await Page.longClick(Page.getByTestId(`ListItem`).nth(0));
  await t.click(Page.getByTestId(`ListClone`));
  await t.expect(Page.getByTestId(`ListItem`).count).eql(4);
  await t.expect(Page.getByTestId(`ListIcon`).nth(0).find(`title`).getAttribute(`id`)).eql(`list`);
  await t.expect(Page.getByTestId(`ListTask`).nth(0).textContent).eql(`list1`);
  await t.expect(Page.getByTestId(`ListCount`).nth(0).textContent).eql(`1/2`);
});
test(`item - delete`, async (t) => {
  await t.click(Page.getByTestId(`ListItem`).nth(1));
  await t.click(Page.getByTestId(`MainList`));
  await Page.longClick(Page.getByTestId(`ListItem`).nth(0));
  await t.click(Page.getByTestId(`ListTrash`));
  await t.click(Page.getByTestId(`DialogOk`));
  await t.expect(Page.getByTestId(`ListItem`).count).eql(2);
  await t.expect(Page.getByTestId(`ListCount`).nth(1).textContent).eql(`1/2`);
  await t.click(Page.getByTestId(`NoticeBack`));
  await t.expect(Page.getByTestId(`ListItem`).count).eql(3);
  await t.expect(Page.getByTestId(`ListCount`).nth(2).textContent).eql(`0/0`);
});
test(`item - drag`, async (t) => {
  await Page.dragDrop(Page.getByTestId(`ListItem`).nth(0), 0, 100);
  await t.expect(Page.getByTestId(`ListTask`).nth(1).textContent).eql(`list1`);
});
test(`item - edit`, async (t) => {
  await Page.longClick(Page.getByTestId(`ListItem`).nth(1));
  await t.expect(Page.getByTestId(`ListItem`).nth(1).classNames).contains(`edit`);
  await t.click(Page.getByTestId(`ListTitle`));
  await t.expect(Page.getByTestId(`ListItem`).nth(1).classNames).notContains(`edit`);
});
test(`item - current`, async (t) => {
  await Page.longClick(Page.getByTestId(`ListItem`).nth(0));
  await t.expect(Page.getByTestId(`ListClone`).count).eql(1);
  await t.expect(Page.getByTestId(`ListTrash`).count).eql(0);
});
test(`item - normal`, async (t) => {
  await Page.longClick(Page.getByTestId(`ListItem`).nth(1));
  await t.expect(Page.getByTestId(`ListClone`).count).eql(1);
  await t.expect(Page.getByTestId(`ListTrash`).count).eql(1);
});
test(`item - trash`, async (t) => {
  await Page.longClick(Page.getByTestId(`ListItem`).nth(2));
  await t.expect(Page.getByTestId(`ListClone`).count).eql(0);
  await t.expect(Page.getByTestId(`ListTrash`).count).eql(0);
});
