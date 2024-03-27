import fs from "fs";
import { test as base, expect } from "@playwright/test";
import Fixture from "../fixture/fixture";

const test = base.extend<{ fixture: Fixture }>({
  fixture: async ({ page, context }, use) => {
    await use(new Fixture(page, context));
  },
});

test.describe(`conf`, () => {
  test.beforeEach(async ({ fixture }) => {
    await fixture.initConf();
  });
  test(`page - init`, async ({ page }) => {
    await expect(page).toHaveURL(`/list1111111111111/conf`);
    await expect(page.getByTestId(`ConfDown`)).toHaveCount(1);
    await expect(page.getByTestId(`ConfTitle`)).toHaveText(`設定`);
    await expect(page.getByTestId(`ConfName`)).toContainText(`Memotea`);
    await expect(page.getByTestId(`ConfItem`)).toHaveCount(9);
    await expect(page.getByTestId(`ConfSizeTitle`)).toHaveText(`文字サイズ`);
    await expect(page.getByTestId(`ConfSizeValue`)).toHaveValue(`2`);
    await expect(page.getByTestId(`ConfSizeName`)).toHaveText(`中`);
    await expect(page.getByTestId(`ConfSpeedTitle`)).toHaveText(`アニメ速度`);
    await expect(page.getByTestId(`ConfSpeedValue`)).toHaveValue(`2`);
    await expect(page.getByTestId(`ConfSpeedName`)).toHaveText(`中`);
    await expect(page.getByTestId(`ConfVolumeTitle`)).toHaveText(`音量`);
    await expect(page.getByTestId(`ConfVolumeValue`)).toHaveValue(`1`);
    await expect(page.getByTestId(`ConfVolumeName`)).toHaveText(`小`);
    await expect(page.getByTestId(`ConfVibrateTitle`)).toHaveText(`振動`);
    await expect(page.getByTestId(`ConfVibrateOff`)).not.toBeChecked();
    await expect(page.getByTestId(`ConfVibrateOn`)).toBeChecked();
    await expect(page.getByTestId(`InputRadioLabel`).nth(0)).toHaveText(`無`);
    await expect(page.getByTestId(`InputRadioLabel`).nth(1)).toHaveText(`有`);
    await expect(page.getByTestId(`ConfThemeTitle`)).toHaveText(`テーマ`);
    await expect(page.getByTestId(`ConfThemeLight`)).not.toBeChecked();
    await expect(page.getByTestId(`ConfThemeDark`)).toBeChecked();
    await expect(page.getByTestId(`InputRadioLabel`).nth(2)).toHaveText(`明`);
    await expect(page.getByTestId(`InputRadioLabel`).nth(3)).toHaveText(`暗`);
    await expect(page.getByTestId(`ConfLangTitle`)).toHaveText(`言語`);
    await expect(page.getByTestId(`ConfLangEn`)).not.toBeChecked();
    await expect(page.getByTestId(`ConfLangJa`)).toBeChecked();
    await expect(page.getByTestId(`InputRadioLabel`).nth(4)).toHaveText(`英語`);
    await expect(page.getByTestId(`InputRadioLabel`).nth(5)).toHaveText(`日本語`);
    await expect(page.getByTestId(`ConfSaveTitle`)).toHaveText(`自動保存`);
    await expect(page.getByTestId(`ConfSaveLocal`)).toBeChecked();
    await expect(page.getByTestId(`ConfSaveRest`)).not.toBeChecked();
    await expect(page.getByTestId(`ConfSaveGql`)).not.toBeChecked();
    await expect(page.getByTestId(`InputRadioLabel`).nth(6)).toHaveText(`LOCAL`);
    await expect(page.getByTestId(`InputRadioLabel`).nth(7)).toHaveText(`REST`);
    await expect(page.getByTestId(`InputRadioLabel`).nth(8)).toHaveText(`GQL`);
    await expect(page.getByTestId(`ConfBackupTitle`)).toHaveText(`保存ファイル`);
    await expect(page.getByTestId(`ConfBackupDownload`)).toHaveText(`保存`);
    await expect(page.getByTestId(`InputFileLabel`)).toHaveText(`復元`);
    await expect(page.getByTestId(`ConfResetTitle`)).toHaveText(`初期化`);
    await expect(page.getByTestId(`ConfResetConf`)).toHaveText(`設定`);
    await expect(page.getByTestId(`ConfResetList`)).toHaveText(`メモ`);
  });
  test(`page - swipe`, async ({ page, fixture }) => {
    await fixture.dragDrop(page.getByTestId(`ConfBack`), page.getByTestId(`ConfResetTitle`));
    await expect(page).toHaveURL(`/list1111111111111`);
  });
  test(`page - back`, async ({ page }) => {
    await page.getByTestId(`ConfDown`).click();
    await expect(page).toHaveURL(`/list1111111111111`);
  });
  test(`item - size`, async ({ page }) => {
    await page.getByTestId(`ConfSizeValue`).fill(`3`);
    await expect(page.getByTestId(`ConfSizeName`)).toHaveText(`大`);
  });
  test(`item - speed`, async ({ page }) => {
    await page.getByTestId(`ConfSpeedValue`).fill(`3`);
    await expect(page.getByTestId(`ConfSpeedName`)).toHaveText(`高`);
  });
  test(`item - volume`, async ({ page }) => {
    await page.getByTestId(`ConfVolumeValue`).fill(`3`);
    await expect(page.getByTestId(`ConfVolumeName`)).toHaveText(`大`);
  });
  test(`item - vibrate`, async ({ page }) => {
    await page.getByTestId(`ConfVibrateOff`).check();
    await expect(page.getByTestId(`ConfVibrateOff`)).toBeChecked();
    await expect(page.getByTestId(`ConfVibrateOn`)).not.toBeChecked();
  });
  test(`item - theme`, async ({ page }) => {
    await page.getByTestId(`ConfThemeLight`).check();
    await expect(page.getByTestId(`ConfThemeLight`)).toBeChecked();
    await expect(page.getByTestId(`ConfThemeDark`)).not.toBeChecked();
  });
  test(`item - lang`, async ({ page }) => {
    await page.getByTestId(`ConfLangEn`).check();
    await expect(page.getByTestId(`ConfLangEn`)).toBeChecked();
    await expect(page.getByTestId(`ConfLangJa`)).not.toBeChecked();
  });
  test(`item - save`, async ({ page }) => {
    await page.getByTestId(`ConfSaveGql`).check();
    await expect(page.getByTestId(`ConfSaveLocal`)).not.toBeChecked();
    await expect(page.getByTestId(`ConfSaveRest`)).not.toBeChecked();
    await expect(page.getByTestId(`ConfSaveGql`)).toBeChecked();
  });
  test(`item - download`, async ({ page }) => {
    let download = ``;
    const downloadPromise = page.waitForEvent(`download`);
    await page.getByTestId(`ConfBackupDownload`).click();
    const stream = await (await downloadPromise).createReadStream();
    for await (const chunk of stream) {
      download += chunk;
    }
    const upload = fs.readFileSync(`./test/memotea.bak`, `utf8`);
    await expect(download).toBe(upload);
  });
  test(`item - upload`, async ({ page }) => {
    await page.getByTestId(`ConfThemeLight`).check();
    await page.getByTestId(`ConfBackupUpload`).setInputFiles(`./test/memotea.bak`);
    await expect(page.getByTestId(`ConfThemeLight`)).not.toBeChecked();
    await expect(page.getByTestId(`ConfThemeDark`)).toBeChecked();
  });
  test(`item - reset.conf`, async ({ page }) => {
    await page.getByTestId(`ConfResetConf`).click();
    await page.getByTestId(`DialogOk`).click();
    await expect(page.getByTestId(`ConfThemeLight`)).toBeChecked();
    await expect(page.getByTestId(`ConfThemeDark`)).not.toBeChecked();
  });
  test(`item - reset.memo`, async ({ page }) => {
    await page.getByTestId(`ConfResetList`).click();
    await page.getByTestId(`DialogOk`).click();
    await expect(page.getByTestId(`MainItem`)).toHaveCount(1);
  });
});
