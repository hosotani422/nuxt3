import { test, fixture } from "testcafe";
import Page from "../model/page";

fixture(`conf`).beforeEach(async () => {
  await Page.initConf();
});
test(`page - init`, async (t) => {
  await t.expect(await Page.getUrl()).eql(`/list1111111111111/conf`);
  await t.expect(Page.getByTestId(`ConfDown`).count).eql(1);
  await t.expect(Page.getByTestId(`ConfTitle`).textContent).eql(`設定`);
  await t.expect(Page.getByTestId(`ConfName`).textContent).contains(`Memosuku`);
  await t.expect(Page.getByTestId(`ConfItem`).count).eql(8);
  await t.expect(Page.getByTestId(`ConfSizeTitle`).textContent).eql(`文字サイズ`);
  await t.expect(Page.getByTestId(`ConfSizeValue`).value).eql(`2`);
  await t.expect(Page.getByTestId(`ConfSizeName`).textContent).eql(`中`);
  await t.expect(Page.getByTestId(`ConfSpeedTitle`).textContent).eql(`アニメ速度`);
  await t.expect(Page.getByTestId(`ConfSpeedValue`).value).eql(`2`);
  await t.expect(Page.getByTestId(`ConfSpeedName`).textContent).eql(`中`);
  await t.expect(Page.getByTestId(`ConfThemeTitle`).textContent).eql(`テーマ`);
  await t.expect(Page.getByTestId(`ConfThemeLight`).checked).eql(false);
  await t.expect(Page.getByTestId(`ConfThemeDark`).checked).eql(true);
  await t.expect(Page.getByTestId(`InputRadioLabel`).nth(0).textContent).eql(`明`);
  await t.expect(Page.getByTestId(`InputRadioLabel`).nth(1).textContent).eql(`暗`);
  await t.expect(Page.getByTestId(`ConfLangTitle`).textContent).eql(`言語`);
  await t.expect(Page.getByTestId(`ConfLangEn`).checked).eql(false);
  await t.expect(Page.getByTestId(`ConfLangJa`).checked).eql(true);
  await t.expect(Page.getByTestId(`InputRadioLabel`).nth(2).textContent).eql(`英語`);
  await t.expect(Page.getByTestId(`InputRadioLabel`).nth(3).textContent).eql(`日本語`);
  await t.expect(Page.getByTestId(`ConfVibrateTitle`).textContent).eql(`振動`);
  await t.expect(Page.getByTestId(`ConfVibrateOff`).checked).eql(false);
  await t.expect(Page.getByTestId(`ConfVibrateOn`).checked).eql(true);
  await t.expect(Page.getByTestId(`InputRadioLabel`).nth(4).textContent).eql(`無`);
  await t.expect(Page.getByTestId(`InputRadioLabel`).nth(5).textContent).eql(`有`);
  await t.expect(Page.getByTestId(`ConfSaveTitle`).textContent).eql(`自動保存`);
  await t.expect(Page.getByTestId(`ConfSaveLocal`).checked).eql(true);
  await t.expect(Page.getByTestId(`ConfSaveRest`).checked).eql(false);
  await t.expect(Page.getByTestId(`ConfSaveGql`).checked).eql(false);
  await t.expect(Page.getByTestId(`InputRadioLabel`).nth(6).textContent).eql(`LOCAL`);
  await t.expect(Page.getByTestId(`InputRadioLabel`).nth(7).textContent).eql(`REST`);
  await t.expect(Page.getByTestId(`InputRadioLabel`).nth(8).textContent).eql(`GQL`);
  await t.expect(Page.getByTestId(`ConfBackupTitle`).textContent).eql(`保存ファイル`);
  await t.expect(Page.getByTestId(`ConfBackupDownload`).textContent).eql(`保存`);
  await t.expect(Page.getByTestId(`InputFileLabel`).textContent).eql(`復元`);
  await t.expect(Page.getByTestId(`ConfResetTitle`).textContent).eql(`初期化`);
  await t.expect(Page.getByTestId(`ConfResetConf`).textContent).eql(`設定`);
  await t.expect(Page.getByTestId(`ConfResetList`).textContent).eql(`メモ`);
});
test(`page - swipe`, async (t) => {
  await Page.dragDrop(Page.getByTestId(`ConfBack`).nth(0), 0, 100);
  await t.expect(await Page.getUrl()).eql(`/list1111111111111`);
});
test(`page - back`, async (t) => {
  await t.click(Page.getByTestId(`ConfDown`));
  await t.expect(await Page.getUrl()).eql(`/list1111111111111`);
});
test(`item - size`, async (t) => {
  await t.typeText(Page.getByTestId(`ConfSizeValue`), `3`, { replace: true });
  await t.expect(Page.getByTestId(`ConfSizeName`).textContent).eql(`大`);
});
test(`item - speed`, async (t) => {
  await t.typeText(Page.getByTestId(`ConfSpeedValue`), `3`, { replace: true });
  await t.expect(Page.getByTestId(`ConfSpeedName`).textContent).eql(`高`);
});
test(`item - vibrate`, async (t) => {
  await t.click(Page.getByTestId(`ConfVibrateOff`));
  await t.expect(Page.getByTestId(`ConfVibrateOff`).checked).eql(true);
  await t.expect(Page.getByTestId(`ConfVibrateOn`).checked).eql(false);
});
test(`item - theme`, async (t) => {
  await t.click(Page.getByTestId(`ConfThemeLight`));
  await t.expect(Page.getByTestId(`ConfThemeLight`).checked).eql(true);
  await t.expect(Page.getByTestId(`ConfThemeDark`).checked).eql(false);
});
test(`item - lang`, async (t) => {
  await t.click(Page.getByTestId(`ConfLangEn`));
  await t.expect(Page.getByTestId(`ConfLangEn`).checked).eql(true);
  await t.expect(Page.getByTestId(`ConfLangJa`).checked).eql(false);
});
test(`item - save`, async (t) => {
  await t.click(Page.getByTestId(`ConfSaveGql`));
  await t.expect(Page.getByTestId(`ConfSaveLocal`).checked).eql(false);
  await t.expect(Page.getByTestId(`ConfSaveRest`).checked).eql(false);
  await t.expect(Page.getByTestId(`ConfSaveGql`).checked).eql(true);
});
test(`item - upload`, async (t) => {
  await t.click(Page.getByTestId(`ConfThemeLight`));
  await t.setFilesToUpload(Page.getByTestId(`ConfBackupUpload`), `../../memosuku.bak`);
  await t.expect(Page.getByTestId(`ConfThemeLight`).checked).eql(false);
  await t.expect(Page.getByTestId(`ConfThemeDark`).checked).eql(true);
});
test(`item - reset.conf`, async (t) => {
  await t.click(Page.getByTestId(`ConfResetConf`));
  await t.click(Page.getByTestId(`DialogOk`));
  await t.expect(Page.getByTestId(`ConfThemeLight`).checked).eql(true);
  await t.expect(Page.getByTestId(`ConfThemeDark`).checked).eql(false);
});
test(`item - reset.memo`, async (t) => {
  await t.click(Page.getByTestId(`ConfResetList`));
  await t.click(Page.getByTestId(`DialogOk`));
  await t.expect(Page.getByTestId(`MainItem`).count).eql(1);
});
