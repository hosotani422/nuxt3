import { test as base, expect } from "@playwright/test";
import Fixture from "../fixture/fixture";

const test = base.extend<{ fixture: Fixture }>({
  fixture: async ({ page, context }, use) => {
    await use(new Fixture(page, context));
  },
});

test.describe(`list`, () => {
  test.beforeEach(async ({ fixture }) => {
    await fixture.initList();
  });
  test(`page - init`, async ({ page }) => {
    await expect(page).toHaveURL(`/list1111111111111/list`);
    await expect(page.getByTestId(`ListPlus`)).toHaveCount(1);
    await expect(page.getByTestId(`ListTitle`)).toHaveText(`Memosuku`);
    await expect(page.getByTestId(`ListLeft`)).toHaveCount(1);
    await expect(page.getByTestId(`ListItem`)).toHaveCount(3);
    await expect(page.getByTestId(`ListIcon`).nth(0).locator(`title`)).toHaveId(`list`);
    await expect(page.getByTestId(`ListIcon`).nth(1).locator(`title`)).toHaveId(`inbox`);
    await expect(page.getByTestId(`ListIcon`).nth(2).locator(`title`)).toHaveId(`trash`);
    await expect(page.getByTestId(`ListTask`).nth(0)).toHaveText(`list1`);
    await expect(page.getByTestId(`ListTask`).nth(1)).toHaveText(`Inbox`);
    await expect(page.getByTestId(`ListTask`).nth(2)).toHaveText(`Trash`);
    await expect(page.getByTestId(`ListCount`).nth(0)).toHaveText(`1/2`);
    await expect(page.getByTestId(`ListCount`).nth(1)).toHaveText(`0/0`);
    await expect(page.getByTestId(`ListCount`).nth(2)).toHaveText(`0/0`);
  });
  test(`page - swipe`, async ({ page, fixture }) => {
    await fixture.dragDrop(page.getByTestId(`ListBack`), page.getByTestId(`ListPlus`));
    await expect(page).toHaveURL(`/list1111111111111`);
  });
  test(`page - back`, async ({ page }) => {
    await page.getByTestId(`ListLeft`).click();
    await expect(page).toHaveURL(`/list1111111111111`);
  });
  test(`page - select`, async ({ page }) => {
    await page.getByTestId(`ListItem`).nth(2).click();
    await expect(page).toHaveURL(`/list9999999999999`);
  });
  test(`item - create`, async ({ page }) => {
    await page.getByTestId(`ListPlus`).click();
    await page.getByTestId(`DialogText`).fill(`list2`);
    await page.getByTestId(`DialogOk`).click();
    await expect(page.getByTestId(`ListItem`)).toHaveCount(4);
    await expect(page.getByTestId(`ListIcon`).nth(0).locator(`title`)).toHaveId(`list`);
    await expect(page.getByTestId(`ListTask`).nth(0)).toHaveText(`list2`);
    await expect(page.getByTestId(`ListCount`).nth(0)).toHaveText(`0/0`);
  });
  test(`item - select`, async ({ page }) => {
    await page.getByTestId(`ListItem`).nth(1).click();
    await page.getByTestId(`MainList`).click();
    await expect(page.getByTestId(`ListItem`).nth(1)).toHaveClass(/ select/);
  });
  test(`item - title`, async ({ page }) => {
    await page.getByTestId(`ListItem`).nth(0).click();
    await page.getByTestId(`MainTitle`).fill(`list0`);
    await page.getByTestId(`MainList`).click();
    await expect(page.getByTestId(`ListTask`).nth(0)).toHaveText(`list0`);
  });
  test(`item - count`, async ({ page }) => {
    await page.getByTestId(`ListItem`).nth(0).click();
    await page.getByTestId(`MainCheck`).nth(0).check();
    await page.getByTestId(`MainList`).click();
    await expect(page.getByTestId(`ListCount`).nth(0)).toHaveText(`0/2`);
  });
  test(`item - limit`, async ({ page }) => {
    await page.getByTestId(`ListItem`).nth(0).click();
    await page.getByTestId(`MainItem`).nth(0).click();
    await page.getByTestId(`SubCalendar`).click();
    await page.getByTestId(`CalendarClear`).click();
    await page.getByTestId(`SubRight`).click();
    await page.getByTestId(`MainList`).click();
    await expect(page.getByTestId(`ListTask`).nth(0)).not.toHaveClass(/text-theme-warn/);
    await expect(page.getByTestId(`ListCount`).nth(0)).not.toHaveClass(/text-theme-warn/);
  });
  test(`item - clone`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`ListItem`).nth(0));
    await page.getByTestId(`ListClone`).nth(0).click();
    await expect(page.getByTestId(`ListItem`)).toHaveCount(4);
    await expect(page.getByTestId(`ListIcon`).nth(1).locator(`title`)).toHaveId(`list`);
    await expect(page.getByTestId(`ListTask`).nth(1)).toHaveText(`list1`);
    await expect(page.getByTestId(`ListCount`).nth(1)).toHaveText(`1/2`);
  });
  test(`item - delete`, async ({ page, fixture }) => {
    await page.getByTestId(`ListItem`).nth(1).click();
    await page.getByTestId(`MainList`).click();
    await fixture.longClick(page.getByTestId(`ListItem`).nth(0));
    await page.getByTestId(`ListTrash`).click();
    await page.getByTestId(`DialogOk`).click();
    await expect(page.getByTestId(`ListItem`)).toHaveCount(2);
    await expect(page.getByTestId(`ListCount`).nth(1)).toHaveText(`1/2`);
    await page.getByTestId(`NoticeBack`).click();
    await expect(page.getByTestId(`ListItem`)).toHaveCount(3);
    await expect(page.getByTestId(`ListCount`).nth(2)).toHaveText(`0/0`);
  });
  test(`item - drag`, async ({ page, fixture }) => {
    await fixture.dragDrop(page.getByTestId(`ListItem`).nth(0), page.getByTestId(`ListItem`).nth(1));
    await expect(page.getByTestId(`ListTask`).nth(1)).toHaveText(`list1`);
  });
  test(`item - edit`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`ListItem`).nth(1));
    await expect(page.getByTestId(`ListItem`).nth(1)).toHaveClass(/ edit/);
    await page.getByTestId(`ListTitle`).click();
    await expect(page.getByTestId(`ListItem`).nth(1)).not.toHaveClass(/ edit/);
  });
  test(`item - current`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`ListItem`).nth(0));
    await expect(page.getByTestId(`ListClone`)).toHaveCount(2);
    await expect(page.getByTestId(`ListTrash`)).toHaveCount(1);
  });
  test(`item - normal`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`ListItem`).nth(1));
    await expect(page.getByTestId(`ListClone`)).toHaveCount(2);
    await expect(page.getByTestId(`ListTrash`)).toHaveCount(1);
  });
  test(`item - trash`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`ListItem`).nth(2));
    await expect(page.getByTestId(`ListClone`)).toHaveCount(2);
    await expect(page.getByTestId(`ListTrash`)).toHaveCount(1);
  });
});
