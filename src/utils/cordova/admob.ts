import constant from "@/utils/const";

// 基本設定
const BaseConfig: BaseConfig = {
  // 広告ユニットID
  id: constant.base.admobId,
  // テスト広告
  isTesting: false,
  // ロード時に自動表示
  autoShow: true,
  // 子供向け設定
  forChild: null,
  // 家族向け設計（Androidのみ）
  forFamily: null,
  // ロケーションターゲティング（Androidのみ）
  location: null,
};

// バナー設定
const BannerConfig: BannerConfig = {
  // 一番上に表示
  bannerAtTop: false,
  // オーバーラップ表示
  overlap: true,
  // ステータスバー重複回避（iOS7）
  offsetTopBar: false,
  // サイズ [`BANNER` | `IAB_BANNER` | `IAB_LEADERBOARD` |
  // `IAB_MRECT` | `LARGE_BANNER` | `SMART_BANNER` | `FLUID`]
  size: `SMART_BANNER`,
};

/**
 * バナー自動表示
 */
export const showBanner = (): void => {
  window.admob?.banner.config({ ...BaseConfig, ...BannerConfig });
  window.admob?.banner.prepare();
};

/**
 * バナー自動表示（マウント時）
 */
export const mountBanner = (): void => {
  document.addEventListener(`deviceready`, () => {
    showBanner();
  });
};

/**
 * 広告表示
 */
export const show = (): void => {
  window.admob?.banner.show();
};

/**
 * 広告非表示
 */
export const hide = (): void => {
  window.admob?.banner.hide();
};

/**
 * 広告削除
 */
export const remove = (): void => {
  window.admob?.banner.remove();
};

export default {
  showBanner,
  mountBanner,
  show,
  hide,
  remove,
};
