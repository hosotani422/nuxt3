import { test as base, expect } from "@playwright/test";
import Fixture from "../fixture/fixture";

const test = base.extend<{ fixture: Fixture }>({
  fixture: async ({ page }, use) => {
    await use(new Fixture(page));
  },
});

test.describe(`main`, () => {
  test.beforeEach(async ({ fixture }) => {
    await fixture.initMain();
  });
  test(`create`, async ({ page, fixture }) => {
    await page.getByTestId(`MainPlus`).click();
    await fixture.textDialog(`main4`);
    await expect(page.getByTestId(`MainItem`)).toHaveCount(4);
  });
  test(`clone`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`MainItem`).first());
    await page.getByTestId(`MainClone`).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(3);
  });
  test(`edit`, async ({ page }) => {
    await page.getByTestId(`MainItem`).first().click();
    await page.getByTestId(`SubTitle`).fill(`main0`);
    await page.getByTestId(`SubRight`).click();
    await expect(page.getByTestId(`MainTask`).first()).toHaveText(`main0`);
  });
  test(`check`, async ({ page }) => {
    await page.getByTestId(`MainCheck`).first().check();
    await expect(page.getByTestId(`MainCheck`).first()).toBeChecked();
    await page.getByTestId(`MainCheck`).last().uncheck();
    await expect(page.getByTestId(`MainCheck`).first()).not.toBeChecked();
  });
  test(`move`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`MainItem`).first());
    await page.getByTestId(`MainMove`).click();
    await fixture.checkDialog(page.getByTestId(`DialogRadio`).last());
    await expect(page.getByTestId(`MainItem`)).toHaveCount(2);
  });
  test(`delete`, async ({ page, fixture }) => {
    await fixture.longClick(page.getByTestId(`MainItem`).first());
    await page.getByTestId(`MainTrash`).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(1);
    await page.getByTestId(`NoticeBack`).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(2);
  });
});
