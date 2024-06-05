import Fixture from "../fixture/fixture";

Cypress.on(`uncaught:exception`, () => false);
const fixture = new Fixture(cy);

describe(`conf`, () => {
  beforeEach(() => {
    fixture.initConf();
  });
  it(`page - init`, () => {
    cy.location(`pathname`).should(`eq`, `/list1111111111111/conf`);
    fixture.getByTestId(`ConfDown`).should(`have.length`, 1);
    fixture.getByTestId(`ConfTitle`).should(`have.text`, `設定`);
    fixture.getByTestId(`ConfName`).should(`have.length`, 1);
    fixture.getByTestId(`ConfItem`).should(`have.length`, 8);
    fixture.getByTestId(`ConfSizeTitle`).should(`have.text`, `文字サイズ`);
    fixture.getByTestId(`ConfSizeValue`).should(`have.value`, `2`);
    fixture.getByTestId(`ConfSizeName`).should(`have.text`, `中`);
    fixture.getByTestId(`ConfSpeedTitle`).should(`have.text`, `アニメ速度`);
    fixture.getByTestId(`ConfSpeedValue`).should(`have.value`, `2`);
    fixture.getByTestId(`ConfSpeedName`).should(`have.text`, `中`);
    fixture.getByTestId(`ConfThemeTitle`).should(`have.text`, `テーマ`);
    fixture.getByTestId(`ConfThemeLight`).should(`not.be.checked`);
    fixture.getByTestId(`ConfThemeDark`).should(`be.checked`);
    fixture.getByTestId(`InputRadioLabel`).eq(0).should(`have.text`, `明`);
    fixture.getByTestId(`InputRadioLabel`).eq(1).should(`have.text`, `暗`);
    fixture.getByTestId(`ConfLangTitle`).should(`have.text`, `言語`);
    fixture.getByTestId(`ConfLangEn`).should(`not.be.checked`);
    fixture.getByTestId(`ConfLangJa`).should(`be.checked`);
    fixture.getByTestId(`InputRadioLabel`).eq(2).should(`have.text`, `英語`);
    fixture.getByTestId(`InputRadioLabel`).eq(3).should(`have.text`, `日本語`);
    fixture.getByTestId(`ConfVibrateTitle`).should(`have.text`, `振動`);
    fixture.getByTestId(`ConfVibrateOff`).should(`not.be.checked`);
    fixture.getByTestId(`ConfVibrateOn`).should(`be.checked`);
    fixture.getByTestId(`InputRadioLabel`).eq(4).should(`have.text`, `無`);
    fixture.getByTestId(`InputRadioLabel`).eq(5).should(`have.text`, `有`);
    fixture.getByTestId(`ConfSaveTitle`).should(`have.text`, `自動保存`);
    fixture.getByTestId(`ConfSaveLocal`).should(`be.checked`);
    fixture.getByTestId(`ConfSaveRest`).should(`not.be.checked`);
    fixture.getByTestId(`ConfSaveGql`).should(`not.be.checked`);
    fixture.getByTestId(`InputRadioLabel`).eq(6).should(`have.text`, `LOCAL`);
    fixture.getByTestId(`InputRadioLabel`).eq(7).should(`have.text`, `REST`);
    fixture.getByTestId(`InputRadioLabel`).eq(8).should(`have.text`, `GQL`);
    fixture.getByTestId(`ConfBackupTitle`).should(`have.text`, `保存ファイル`);
    fixture.getByTestId(`ConfBackupDownload`).should(`have.text`, `保存`);
    fixture.getByTestId(`InputFileLabel`).should(`have.text`, `復元`);
    fixture.getByTestId(`ConfResetTitle`).should(`have.text`, `初期化`);
    fixture.getByTestId(`ConfResetConf`).should(`have.text`, `設定`);
    fixture.getByTestId(`ConfResetList`).should(`have.text`, `メモ`);
  });
  it(`page - swipe`, () => {
    fixture.dragDrop(fixture.getByTestId(`ConfBack`), 0, 0, -200);
    cy.location(`pathname`).should(`eq`, `/list1111111111111`);
  });
  it(`page - back`, () => {
    fixture.getByTestId(`ConfDown`).click();
    cy.location(`pathname`).should(`eq`, `/list1111111111111`);
  });
  it(`item - size`, () => {
    fixture.getByTestId(`ConfSizeValue`).invoke(`val`, `3`).trigger(`change`);
    fixture.getByTestId(`ConfSizeName`).should(`have.text`, `大`);
  });
  it(`item - speed`, () => {
    fixture.getByTestId(`ConfSpeedValue`).invoke(`val`, `3`).trigger(`change`);
    fixture.getByTestId(`ConfSpeedName`).should(`have.text`, `高`);
  });
  it(`item - vibrate`, () => {
    fixture.getByTestId(`ConfVibrateOff`).check();
    fixture.getByTestId(`ConfVibrateOff`).should(`be.checked`);
    fixture.getByTestId(`ConfVibrateOn`).should(`not.be.checked`);
  });
  it(`item - theme`, () => {
    fixture.getByTestId(`ConfThemeLight`).check();
    fixture.getByTestId(`ConfThemeLight`).should(`be.checked`);
    fixture.getByTestId(`ConfThemeDark`).should(`not.be.checked`);
  });
  it(`item - lang`, () => {
    fixture.getByTestId(`ConfLangEn`).check();
    fixture.getByTestId(`ConfLangEn`).should(`be.checked`);
    fixture.getByTestId(`ConfLangJa`).should(`not.be.checked`);
  });
  it(`item - save`, () => {
    fixture.getByTestId(`ConfSaveGql`).check();
    fixture.getByTestId(`ConfSaveLocal`).should(`not.be.checked`);
    fixture.getByTestId(`ConfSaveRest`).should(`not.be.checked`);
    fixture.getByTestId(`ConfSaveGql`).should(`be.checked`);
  });
  it(`item - upload`, () => {
    fixture.getByTestId(`ConfThemeLight`).check();
    fixture.getByTestId(`ConfBackupUpload`).selectFile(`./test/memosuku.bak`);
    fixture.getByTestId(`ConfThemeLight`).should(`not.be.checked`);
    fixture.getByTestId(`ConfThemeDark`).should(`be.checked`);
  });
  it(`item - reset.conf`, () => {
    fixture.getByTestId(`ConfResetConf`).click();
    fixture.getByTestId(`DialogOk`).click();
    fixture.getByTestId(`ConfThemeLight`).should(`be.checked`);
    fixture.getByTestId(`ConfThemeDark`).should(`not.be.checked`);
  });
  it(`item - reset.memo`, () => {
    fixture.getByTestId(`ConfResetList`).click();
    fixture.getByTestId(`DialogOk`).click();
    fixture.getByTestId(`MainItem`).should(`have.length`, 1);
  });
});
