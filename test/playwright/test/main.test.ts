import { test as base, expect } from "@playwright/test";
import Fixture from "../fixture/fixture";

const test = base.extend<{ fixture: Fixture }>({
  fixture: async ({ page, context }, use) => {
    await use(new Fixture(page, context));
  },
});

test.describe(`main`, () => {
  test.beforeEach(async ({ fixture }) => {
    await fixture.initMain();
  });
  test(`page - init`, async ({ page }) => {
    await expect(page).toHaveURL(`/list1111111111111`);
    await expect(page.getByTestId(`MainList`)).toHaveCount(1);
    await expect(page.getByTestId(`MainTitle`)).toHaveValue(`list1`);
    await expect(page.getByTestId(`MainConf`)).toHaveCount(1);
    await expect(page.getByTestId(`MainPlus`)).toHaveCount(1);
    await expect(page.getByTestId(`MainItem`)).toHaveCount(2);
    await expect(page.getByTestId(`MainCheck`).nth(0)).not.toBeChecked();
    await expect(page.getByTestId(`MainCheck`).nth(1)).toBeChecked();
    await expect(page.getByTestId(`MainTask`).nth(0)).toHaveText(`main1`);
    await expect(page.getByTestId(`MainTask`).nth(1)).toHaveText(`main2`);
    await expect(page.getByTestId(`MainCount`).nth(0)).toHaveText(`1/2`);
    await expect(page.getByTestId(`MainCount`).nth(1)).toHaveText(`0/0`);
  });
  test(`page - list`, async ({ page }) => {
    await page.getByTestId(`MainList`).click();
    await expect(page).toHaveURL(`/list1111111111111/list`);
  });
  test(`page - conf`, async ({ page }) => {
    await page.getByTestId(`MainConf`).click();
    await expect(page).toHaveURL(`/list1111111111111/conf`);
  });
  test(`page - select`, async ({ page }) => {
    await page.getByTestId(`MainItem`).nth(0).click();
    await expect(page).toHaveURL(`/list1111111111111/sub/main1111111111111`);
  });
  test(`item - create`, async ({ page }) => {
    await page.getByTestId(`MainPlus`).click();
    await page.getByTestId(`DialogText`).fill(`main3`);
    await page.getByTestId(`DialogOk`).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(3);
    await expect(page.getByTestId(`MainCheck`).nth(0)).not.toBeChecked();
    await expect(page.getByTestId(`MainTask`).nth(0)).toHaveText(`main3`);
    await expect(page.getByTestId(`MainCount`).nth(0)).toHaveText(`1/1`);
  });
  test(`item - select`, async ({ page }) => {
    await page.getByTestId(`MainItem`).nth(0).click();
    await expect(page.getByTestId(`MainItem`).nth(0)).toHaveClass(/ select/);
    await page.getByTestId(`SubRight`).click();
    await expect(page.getByTestId(`MainItem`).nth(0)).not.toHaveClass(/ select/);
  });
  test(`item - check`, async ({ page }) => {
    await page.getByTestId(`MainCheck`).nth(0).check();
    await expect(page.getByTestId(`MainCheck`).nth(0)).toBeChecked();
    await page.getByTestId(`MainCheck`).nth(0).uncheck();
    await expect(page.getByTestId(`MainCheck`).nth(0)).not.toBeChecked();
  });
  test(`item - title`, async ({ page }) => {
    await page.getByTestId(`MainItem`).nth(0).click();
    await page.getByTestId(`SubTitle`).fill(`main0`);
    await page.getByTestId(`SubRight`).click();
    await expect(page.getByTestId(`MainTask`).nth(0)).toHaveText(`main0`);
  });
  test(`item - count`, async ({ page }) => {
    await page.getByTestId(`MainItem`).nth(0).click();
    await page.getByTestId(`SubCheck`).nth(0).check();
    await page.getByTestId(`SubRight`).click();
    await expect(page.getByTestId(`MainCount`).nth(0)).toHaveText(`0/2`);
  });
  test(`item - limit`, async ({ page }) => {
    await page.getByTestId(`MainItem`).nth(0).click();
    await page.getByTestId(`SubCalendar`).click();
    await page.getByTestId(`CalendarClear`).click();
    await page.getByTestId(`SubRight`).click();
    await expect(page.getByTestId(`MainTask`).nth(0)).not.toHaveClass(/text-theme-warn/);
  });
  test(`item - clone`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`MainItem`).nth(0));
    await page.getByTestId(`MainClone`).nth(0).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(3);
    await expect(page.getByTestId(`MainCheck`).nth(1)).not.toBeChecked();
    await expect(page.getByTestId(`MainTask`).nth(1)).toHaveText(`main1`);
    await expect(page.getByTestId(`MainCount`).nth(1)).toHaveText(`1/2`);
  });
  test(`item - move`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`MainItem`).nth(0));
    await page.getByTestId(`MainMove`).nth(0).click();
    await page.getByTestId(`DialogRadio`).nth(0).check();
    await page.getByTestId(`DialogOk`).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(1);
    await page.getByTestId(`MainList`).click();
    await page.getByTestId(`ListItem`).nth(1).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(1);
    await expect(page.getByTestId(`MainCheck`).nth(0)).not.toBeChecked();
    await expect(page.getByTestId(`MainTask`).nth(0)).toHaveText(`main1`);
    await expect(page.getByTestId(`MainCount`).nth(0)).toHaveText(`1/2`);
  });
  test(`item - delete`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`MainItem`).nth(0));
    await page.getByTestId(`MainTrash`).nth(0).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(1);
    await page.getByTestId(`MainList`).click();
    await page.getByTestId(`ListItem`).nth(2).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(1);
    await expect(page.getByTestId(`MainCheck`).nth(0)).not.toBeChecked();
    await expect(page.getByTestId(`MainTask`).nth(0)).toHaveText(`main1`);
    await expect(page.getByTestId(`MainCount`).nth(0)).toHaveText(`1/2`);
    await page.getByTestId(`NoticeBack`).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(0);
    await page.getByTestId(`MainList`).click();
    await page.getByTestId(`ListItem`).nth(0).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(2);
    await expect(page.getByTestId(`MainCheck`).nth(0)).not.toBeChecked();
    await expect(page.getByTestId(`MainTask`).nth(0)).toHaveText(`main1`);
    await expect(page.getByTestId(`MainCount`).nth(0)).toHaveText(`1/2`);
  });
  test(`item - drag`, async ({ page, fixture }) => {
    await fixture.dragDrop(page.getByTestId(`MainItem`).nth(0), page.getByTestId(`MainItem`).nth(1));
    await expect(page.getByTestId(`MainTask`).nth(1)).toHaveText(`main1`);
  });
  test(`item - edit`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`MainItem`).nth(1));
    await expect(page.getByTestId(`MainItem`).nth(1)).toHaveClass(/ edit/);
    await page.getByTestId(`MainTitle`).click();
    await expect(page.getByTestId(`MainItem`).nth(1)).not.toHaveClass(/ edit/);
  });
});
