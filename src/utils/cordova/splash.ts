/**
 * 表示
 */
export const show = (): void => {
  navigator.splashscreen?.show();
};

/**
 * 非表示
 */
export const hide = (): void => {
  navigator.splashscreen?.hide();
};

/**
 * 非表示（マウント時）
 */
export const hideMount = (): void => {
  document.addEventListener(`deviceready`, () => {
    hide();
  });
};

export default {
  show,
  hide,
  hideMount,
};
