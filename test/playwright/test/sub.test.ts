import { test as base, expect } from "@playwright/test";
import Fixture from "../fixture/fixture";

const test = base.extend<{ fixture: Fixture }>({
  fixture: async ({ page, context }, use) => {
    await use(new Fixture(page, context));
  },
});

test.describe(`sub`, () => {
  test.beforeEach(async ({ fixture }) => {
    await fixture.initSub();
  });
  test(`page - init`, async ({ page }) => {
    await expect(page).toHaveURL(`/list1111111111111/sub/main1111111111111`);
    await expect(page.getByTestId(`SubRight`)).toHaveCount(1);
    await expect(page.getByTestId(`SubTitle`)).toHaveValue(`main1`);
    await expect(page.getByTestId(`SubMode`)).toHaveCount(1);
    await expect(page.getByTestId(`SubItem`)).toHaveCount(2);
    await expect(page.getByTestId(`SubCheck`).nth(0)).not.toBeChecked();
    await expect(page.getByTestId(`SubCheck`).nth(1)).toBeChecked();
    await expect(page.getByTestId(`SubTask`).nth(0)).toHaveText(`sub1`);
    await expect(page.getByTestId(`SubTask`).nth(1)).toHaveText(`sub2`);
    await expect(page.getByTestId(`SubItem`).nth(0).getByTestId(`SubDrag`)).toHaveCount(1);
    await expect(page.getByTestId(`SubItem`).nth(1).getByTestId(`SubDrag`)).toHaveCount(1);
    await expect(page.getByTestId(`SubItem`).nth(0).getByTestId(`SubTrash`)).toHaveCount(0);
    await expect(page.getByTestId(`SubItem`).nth(1).getByTestId(`SubTrash`)).toHaveCount(0);
    await expect(page.getByTestId(`SubCalendar`)).toHaveValue(`2000/01/01`);
    await expect(page.getByTestId(`SubClock`)).toHaveValue(`00:00`);
    await expect(page.getByTestId(`SubDialog`)).toHaveValue(`5分前,1時間前`);
  });
  test(`page - swipe`, async ({ page, fixture }) => {
    await fixture.dragDrop(page.getByTestId(`SubBack`), page.getByTestId(`SubMode`));
    await expect(page).toHaveURL(`/list1111111111111`);
  });
  test(`page - back`, async ({ page }) => {
    await page.getByTestId(`SubRight`).click();
    await expect(page).toHaveURL(`/list1111111111111`);
  });
  test(`item - check`, async ({ page }) => {
    await page.getByTestId(`SubCheck`).nth(0).check();
    await expect(page.getByTestId(`SubCheck`).nth(0)).toBeChecked();
    await expect(page.getByTestId(`SubTask`).nth(0)).toHaveText(`sub2`);
    await page.getByTestId(`SubCheck`).nth(1).uncheck();
    await expect(page.getByTestId(`SubCheck`).nth(0)).not.toBeChecked();
    await expect(page.getByTestId(`SubTask`).nth(0)).toHaveText(`sub1`);
  });
  test(`item - select`, async ({ page }) => {
    await page.getByTestId(`SubTask`).nth(0).click();
    await expect(page.getByTestId(`SubItem`).nth(0)).toHaveClass(/ edit/);
  });
  test(`item - edit`, async ({ page }) => {
    await page.getByTestId(`SubTask`).nth(0).press(`Enter`);
    await expect(page.getByTestId(`SubItem`)).toHaveCount(3);
    await expect(page.getByTestId(`SubTask`).nth(0)).toHaveText(``);
    await page.getByTestId(`SubTask`).nth(1).press(`Backspace`);
    await expect(page.getByTestId(`SubItem`)).toHaveCount(2);
    await expect(page.getByTestId(`SubTask`).nth(0)).toHaveText(`sub1`);
  });
  test(`item - delete`, async ({ page }) => {
    await page.getByTestId(`SubTask`).nth(0).click();
    await page.getByTestId(`SubTrash`).dispatchEvent(`touchstart`);
    await expect(page.getByTestId(`SubItem`)).toHaveCount(1);
    await expect(page.getByTestId(`SubTask`).nth(0)).toHaveText(`sub2`);
    await page.getByTestId(`NoticeBack`).click();
    await expect(page.getByTestId(`SubItem`)).toHaveCount(2);
    await expect(page.getByTestId(`SubTask`).nth(0)).toHaveText(`sub1`);
  });
  test(`item - mode`, async ({ page }) => {
    await page.getByTestId(`SubMode`).click();
    await expect(page.getByTestId(`SubMemo`)).toHaveValue(`sub1\nsub2`);
    await page.getByTestId(`SubMemo`).fill(`sub1\nsub2\nsub3`);
    await page.getByTestId(`SubMode`).click();
    await expect(page.getByTestId(`SubItem`)).toHaveCount(3);
    await expect(page.getByTestId(`SubCheck`).nth(0)).not.toBeChecked();
    await expect(page.getByTestId(`SubCheck`).nth(1)).not.toBeChecked();
    await expect(page.getByTestId(`SubCheck`).nth(2)).not.toBeChecked();
    await expect(page.getByTestId(`SubTask`).nth(0)).toHaveText(`sub1`);
    await expect(page.getByTestId(`SubTask`).nth(1)).toHaveText(`sub2`);
    await expect(page.getByTestId(`SubTask`).nth(2)).toHaveText(`sub3`);
    await expect(page.getByTestId(`SubItem`).nth(0).getByTestId(`SubDrag`)).toHaveCount(1);
    await expect(page.getByTestId(`SubItem`).nth(1).getByTestId(`SubDrag`)).toHaveCount(1);
    await expect(page.getByTestId(`SubItem`).nth(2).getByTestId(`SubDrag`)).toHaveCount(1);
    await expect(page.getByTestId(`SubItem`).nth(0).getByTestId(`SubTrash`)).toHaveCount(0);
    await expect(page.getByTestId(`SubItem`).nth(1).getByTestId(`SubTrash`)).toHaveCount(0);
    await expect(page.getByTestId(`SubItem`).nth(2).getByTestId(`SubTrash`)).toHaveCount(0);
  });
  test(`item - drag`, async ({ page, fixture }) => {
    await fixture.dragDrop(page.getByTestId(`SubDrag`).nth(0), page.getByTestId(`SubDrag`).nth(1));
    await expect(page.getByTestId(`SubTask`).nth(1)).toHaveValue(`sub1`);
  });
  test(`option - calendar`, async ({ page }) => {
    await page.getByTestId(`SubCalendar`).click();
    await page.getByTestId(`CalendarDay`).nth(41).click();
    await expect(page.getByTestId(`SubCalendar`)).toHaveValue(`2000/01/02`);
    await page.getByTestId(`SubCalendar`).click();
    await page.getByTestId(`CalendarClear`).click();
    await expect(page.getByTestId(`SubCalendar`)).toHaveValue(``);
  });
  test(`option - clock`, async ({ page }) => {
    await page.getByTestId(`SubClock`).click();
    await page.getByTestId(`ClockOk`).click();
    await expect(page.getByTestId(`SubClock`)).toHaveValue(`00:00`);
    await page.getByTestId(`SubClock`).click();
    await page.getByTestId(`ClockClear`).click();
    await expect(page.getByTestId(`SubClock`)).toHaveValue(``);
  });
  test(`option - dialog`, async ({ page }) => {
    await page.getByTestId(`SubDialog`).click();
    await page.getByTestId(`DialogCheck`).nth(11).check();
    await page.getByTestId(`DialogOk`).click();
    await expect(page.getByTestId(`SubDialog`)).toHaveValue(`5分前,1時間前,2日前`);
  });
  test(`option - limit`, async ({ page }) => {
    await page.getByTestId(`SubCalendar`).click();
    await page.getByTestId(`CalendarClear`).click();
    await expect(page.getByTestId(`SubCalendar`)).not.toHaveClass(/ text-theme-warn/);
    await expect(page.getByTestId(`SubClock`)).not.toHaveClass(/ text-theme-warn/);
    await expect(page.getByTestId(`SubDialog`)).not.toHaveClass(/ text-theme-warn/);
  });
});
