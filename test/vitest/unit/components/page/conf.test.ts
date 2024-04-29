import { describe, test, expect } from "vitest";
import { VueWrapper } from "@vue/test-utils";
import fixture from "../../../fixture/page/conf";

const it = test.extend<{ wrapper: VueWrapper }>({
  wrapper: async ({}, use) => {
    await fixture.init();
    await fixture.loadData();
    await use(fixture.getWrapper());
  },
});

describe(`dom`, () => {
  it(`header`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ConfDown`)).toHaveLength(1);
    expect(wrapper.findByTestIdAll(`ConfTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfTitle`).text()).toBe(`設定`);
    expect(wrapper.findByTestIdAll(`ConfName`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfName`).text()).toBe(`Memosuku 1.0.0`);
  });
  it(`range`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ConfSizeTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfSizeTitle`).text()).toBe(`文字サイズ`);
    expect(wrapper.findByTestIdAll(`ConfSizeValue`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfSizeValue`).element.value).toBe(`2`);
    expect(wrapper.findByTestIdAll(`ConfSizeName`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfSizeName`).text()).toBe(`中`);
    expect(wrapper.findByTestIdAll(`ConfSpeedTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfSpeedTitle`).text()).toBe(`アニメ速度`);
    expect(wrapper.findByTestIdAll(`ConfSpeedValue`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfSpeedValue`).element.value).toBe(`2`);
    expect(wrapper.findByTestIdAll(`ConfSpeedName`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfSpeedName`).text()).toBe(`中`);
  });
  it(`radio`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ConfThemeTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfThemeTitle`).text()).toBe(`テーマ`);
    expect(wrapper.findByTestIdAll(`ConfThemeLight`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfThemeLight`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`ConfThemeLight`).element.parentElement?.textContent).toBe(`明`);
    expect(wrapper.findByTestIdAll(`ConfThemeDark`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfThemeDark`).element.checked).toBe(true);
    expect(wrapper.findByTestId(`ConfThemeDark`).element.parentElement?.textContent).toBe(`暗`);
    expect(wrapper.findByTestIdAll(`ConfLangTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfLangTitle`).text()).toBe(`言語`);
    expect(wrapper.findByTestIdAll(`ConfLangEn`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfLangEn`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`ConfLangEn`).element.parentElement?.textContent).toBe(`英語`);
    expect(wrapper.findByTestIdAll(`ConfLangJa`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfLangJa`).element.checked).toBe(true);
    expect(wrapper.findByTestId(`ConfLangJa`).element.parentElement?.textContent).toBe(`日本語`);
    expect(wrapper.findByTestIdAll(`ConfVibrateTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfVibrateTitle`).text()).toBe(`振動`);
    expect(wrapper.findByTestIdAll(`ConfVibrateOff`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfVibrateOff`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`ConfVibrateOff`).element.parentElement?.textContent).toBe(`無`);
    expect(wrapper.findByTestIdAll(`ConfVibrateOn`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfVibrateOn`).element.checked).toBe(true);
    expect(wrapper.findByTestId(`ConfVibrateOn`).element.parentElement?.textContent).toBe(`有`);
    expect(wrapper.findByTestIdAll(`ConfSaveTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfSaveTitle`).text()).toBe(`自動保存`);
    expect(wrapper.findByTestIdAll(`ConfSaveLocal`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfSaveLocal`).element.checked).toBe(true);
    expect(wrapper.findByTestId(`ConfSaveLocal`).element.parentElement?.textContent).toBe(`LOCAL`);
    expect(wrapper.findByTestIdAll(`ConfSaveRest`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfSaveRest`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`ConfSaveRest`).element.parentElement?.textContent).toBe(`REST`);
    expect(wrapper.findByTestIdAll(`ConfSaveGql`)).toHaveLength(1);
    expect(wrapper.findByTestId<HTMLInputElement>(`ConfSaveGql`).element.checked).toBe(false);
    expect(wrapper.findByTestId(`ConfSaveGql`).element.parentElement?.textContent).toBe(`GQL`);
  });
  it(`button`, ({ wrapper }) => {
    expect(wrapper.findByTestIdAll(`ConfBackupTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfBackupTitle`).text()).toBe(`保存ファイル`);
    expect(wrapper.findByTestIdAll(`ConfBackupDownload`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfBackupDownload`).text()).toBe(`保存`);
    expect(wrapper.findByTestIdAll(`ConfBackupUpload`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfBackupUpload`).element.parentElement?.textContent).toBe(`復元`);
    expect(wrapper.findByTestIdAll(`ConfResetTitle`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfResetTitle`).text()).toBe(`初期化`);
    expect(wrapper.findByTestIdAll(`ConfResetConf`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfResetConf`).text()).toBe(`設定`);
    expect(wrapper.findByTestIdAll(`ConfResetList`)).toHaveLength(1);
    expect(wrapper.findByTestId(`ConfResetList`).text()).toBe(`メモ`);
  });
});

describe(`event`, () => {
  it(`root`, ({ wrapper }) => {
    wrapper.findByTestId(`ConfRoot`).trigger(`touchmove`, { changedTouches: [{ clientX: 1, clientY: 1 }] });
    wrapper.findByTestId(`ConfRoot`).trigger(`mousemove`, { clientX: 2, clientY: 2 });
    expect(wrapper.emitted(`swipeStart`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeStart`)).toEqual([[{ x: 1, y: 1 }], [{ x: 2, y: 2 }]]);
    expect(wrapper.emitted(`swipeMove`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeMove`)).toEqual([[{ y: 1 }], [{ y: 2 }]]);
    wrapper.findByTestId(`ConfRoot`).trigger(`touchend`, { changedTouches: [{ clientY: 1 }] });
    wrapper.findByTestId(`ConfRoot`).trigger(`mouseup`, { clientY: 2 });
    expect(wrapper.emitted(`swipeEnd`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeEnd`)).toEqual([[{ y: 1 }], [{ y: 2 }]]);
    wrapper.findByTestId(`ConfBack`).trigger(`touchstart`, { changedTouches: [{ clientX: 1, clientY: 1 }] });
    wrapper.findByTestId(`ConfBack`).trigger(`mousedown`, { clientX: 2, clientY: 2 });
    expect(wrapper.emitted(`swipeInit`)).toHaveLength(2);
    expect(wrapper.emitted(`swipeInit`)).toEqual([[{ x: 1, y: 1 }], [{ x: 2, y: 2 }]]);
  });
  it(`header`, ({ wrapper }) => {
    wrapper.findByTestId(`ConfDown`).trigger(`click`);
    expect(wrapper.emitted(`routerBack`)).toHaveLength(1);
    expect(wrapper.emitted(`routerBack`)).toEqual([[]]);
  });
  it(`button`, ({ wrapper }) => {
    wrapper.findByTestId(`ConfBackupDownload`).trigger(`click`);
    expect(wrapper.emitted(`downloadBackup`)).toHaveLength(1);
    wrapper.findByTestId(`ConfBackupUpload`).trigger(`change`);
    expect(wrapper.emitted(`uploadBackup`)).toHaveLength(1);
    wrapper.findByTestId(`ConfResetConf`).trigger(`click`);
    expect(wrapper.emitted(`resetConf`)).toHaveLength(1);
    expect(wrapper.emitted(`resetConf`)).toEqual([[]]);
    wrapper.findByTestId(`ConfResetList`).trigger(`click`);
    expect(wrapper.emitted(`resetList`)).toHaveLength(1);
    expect(wrapper.emitted(`resetList`)).toEqual([[]]);
  });
});
