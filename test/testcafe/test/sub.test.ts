import { test, fixture } from "testcafe";
import Page from "../model/page";

fixture(`sub`).beforeEach(async () => {
  await Page.initSub();
});
test(`page - init`, async (t) => {
  await t.expect(await Page.getUrl()).eql(`/list1111111111111/sub/main1111111111111`);
  await t.expect(Page.getByTestId(`SubRight`).count).eql(1);
  await t.expect(Page.getByTestId(`SubTitle`).value).eql(`main1`);
  await t.expect(Page.getByTestId(`SubMode`).count).eql(1);
  await t.expect(Page.getByTestId(`SubItem`).count).eql(2);
  await t.expect(Page.getByTestId(`SubCheck`).nth(0).checked).eql(false);
  await t.expect(Page.getByTestId(`SubCheck`).nth(1).checked).eql(true);
  await t.expect(Page.getByTestId(`SubTask`).nth(0).textContent).eql(`sub1`);
  await t.expect(Page.getByTestId(`SubTask`).nth(1).textContent).eql(`sub2`);
  await t.expect(Page.getByTestId(`SubItem`).nth(0).find(`[data-testid="SubDrag"]`).count).eql(1);
  await t.expect(Page.getByTestId(`SubItem`).nth(1).find(`[data-testid="SubDrag"]`).count).eql(1);
  await t.expect(Page.getByTestId(`SubItem`).nth(0).find(`[data-testid="SubTrash"]`).count).eql(0);
  await t.expect(Page.getByTestId(`SubItem`).nth(1).find(`[data-testid="SubTrash"]`).count).eql(0);
  await t.expect(Page.getByTestId(`SubCalendar`).value).eql(`2000/01/01`);
  await t.expect(Page.getByTestId(`SubClock`).value).eql(`00:00`);
  await t.expect(Page.getByTestId(`SubDialog`).value).eql(`5分前,1時間前`);
});
test(`page - swipe`, async (t) => {
  await Page.dragDrop(Page.getByTestId(`SubBack`).nth(0), 100, 0);
  await t.expect(await Page.getUrl()).eql(`/list1111111111111`);
});
test(`page - back`, async (t) => {
  await t.click(Page.getByTestId(`SubRight`));
  await t.expect(await Page.getUrl()).eql(`/list1111111111111`);
});
test(`item - check`, async (t) => {
  await t.click(Page.getByTestId(`SubCheck`).nth(0));
  await t.expect(Page.getByTestId(`SubCheck`).nth(0).checked).eql(true);
  await t.expect(Page.getByTestId(`SubTask`).nth(0).textContent).eql(`sub2`);
  await t.click(Page.getByTestId(`SubCheck`).nth(1));
  await t.expect(Page.getByTestId(`SubCheck`).nth(0).checked).eql(false);
  await t.expect(Page.getByTestId(`SubTask`).nth(0).textContent).eql(`sub1`);
});
test(`item - select`, async (t) => {
  await t.click(Page.getByTestId(`SubTask`).nth(0));
  await t.expect(Page.getByTestId(`SubItem`).nth(0).classNames).contains(`edit`);
});
test(`item - edit`, async (t) => {
  await t.click(Page.getByTestId(`SubTask`).nth(0));
  await t.pressKey(`enter`);
  await t.expect(Page.getByTestId(`SubItem`).count).eql(3);
  await t.expect(Page.getByTestId(`SubTask`).nth(1).value).eql(``);
  await t.pressKey(`backspace`);
  await t.expect(Page.getByTestId(`SubItem`).count).eql(2);
  await t.expect(Page.getByTestId(`SubTask`).nth(1).value).eql(`sub2`);
});
test(`item - delete`, async (t) => {
  await t.click(Page.getByTestId(`SubTask`).nth(0));
  await t.dispatchEvent(Page.getByTestId(`SubTrash`), `touchstart`);
  await t.expect(Page.getByTestId(`SubItem`).count).eql(1);
  await t.expect(Page.getByTestId(`SubTask`).nth(0).value).eql(`sub2`);
  await t.click(Page.getByTestId(`NoticeBack`));
  await t.expect(Page.getByTestId(`SubItem`).count).eql(2);
  await t.expect(Page.getByTestId(`SubTask`).nth(0).value).eql(`sub1`);
});
test(`item - mode`, async (t) => {
  await t.click(Page.getByTestId(`SubMode`));
  await t.expect(Page.getByTestId(`SubMemo`).value).eql(`sub1\nsub2`);
  await t.typeText(Page.getByTestId(`SubMemo`), `sub1\nsub2\nsub3`, { replace: true });
  await t.click(Page.getByTestId(`SubMode`));
  await t.expect(Page.getByTestId(`SubItem`).count).eql(3);
  await t.expect(Page.getByTestId(`SubCheck`).nth(0).checked).eql(false);
  await t.expect(Page.getByTestId(`SubCheck`).nth(1).checked).eql(false);
  await t.expect(Page.getByTestId(`SubCheck`).nth(2).checked).eql(false);
  await t.expect(Page.getByTestId(`SubTask`).nth(0).textContent).eql(`sub1`);
  await t.expect(Page.getByTestId(`SubTask`).nth(1).textContent).eql(`sub2`);
  await t.expect(Page.getByTestId(`SubTask`).nth(2).textContent).eql(`sub3`);
  await t.expect(Page.getByTestId(`SubItem`).nth(0).find(`[data-testid="SubDrag"]`).count).eql(1);
  await t.expect(Page.getByTestId(`SubItem`).nth(1).find(`[data-testid="SubDrag"]`).count).eql(1);
  await t.expect(Page.getByTestId(`SubItem`).nth(2).find(`[data-testid="SubDrag"]`).count).eql(1);
  await t.expect(Page.getByTestId(`SubItem`).nth(0).find(`[data-testid="SubTrash"]`).count).eql(0);
  await t.expect(Page.getByTestId(`SubItem`).nth(1).find(`[data-testid="SubTrash"]`).count).eql(0);
  await t.expect(Page.getByTestId(`SubItem`).nth(2).find(`[data-testid="SubTrash"]`).count).eql(0);
});
test(`item - drag`, async (t) => {
  await Page.dragDrop(Page.getByTestId(`SubDrag`).nth(0), 0, 100);
  await t.expect(Page.getByTestId(`SubTask`).nth(1).textContent).eql(`sub1`);
});
test(`option - calendar`, async (t) => {
  await t.click(Page.getByTestId(`SubCalendar`));
  await t.click(Page.getByTestId(`CalendarDay`).nth(41));
  await t.expect(Page.getByTestId(`SubCalendar`).value).eql(`2000/01/02`);
  await t.click(Page.getByTestId(`SubCalendar`));
  await t.click(Page.getByTestId(`CalendarClear`));
  await t.expect(Page.getByTestId(`SubCalendar`).value).eql(``);
});
test(`option - clock`, async (t) => {
  await t.click(Page.getByTestId(`SubClock`));
  await t.click(Page.getByTestId(`ClockOk`));
  await t.expect(Page.getByTestId(`SubClock`).value).eql(`00:00`);
  await t.click(Page.getByTestId(`SubClock`));
  await t.click(Page.getByTestId(`ClockClear`));
  await t.expect(Page.getByTestId(`SubClock`).value).eql(``);
});
test(`option - dialog`, async (t) => {
  await t.click(Page.getByTestId(`SubDialog`));
  await t.click(Page.getByTestId(`DialogCheck`).nth(11));
  await t.click(Page.getByTestId(`DialogOk`));
  await t.expect(Page.getByTestId(`SubDialog`).value).eql(`5分前,1時間前,2日前`);
});
test(`option - limit`, async (t) => {
  await t.click(Page.getByTestId(`SubCalendar`));
  await t.click(Page.getByTestId(`CalendarClear`));
  await t.expect(Page.getByTestId(`SubCalendar`).classNames).notContains(`text-theme-warn`);
  await t.expect(Page.getByTestId(`SubClock`).classNames).notContains(`text-theme-warn`);
  await t.expect(Page.getByTestId(`SubDialog`).classNames).notContains(`text-theme-warn`);
});
