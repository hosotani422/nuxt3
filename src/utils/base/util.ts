/**
 * JSON判定
 * @param item 対象値
 * @returns 判定結果
 */
export const isJson = (item: unknown): boolean => {
  try {
    if (typeof item === `string`) {
      JSON.parse(item);
    } else {
      return false;
    }
  } catch {
    return false;
  }
  return true;
};

/**
 * タプル値生成
 * @param param パラメータ
 * @returns タプル値
 */
export const tuple = <T extends unknown[]>(...param: T): T => param;

/**
 * エラー補足
 */
// window.addEventListener(`error`, (_event: ErrorEvent) => {
//   alert(`${_event.error.toString()}\n${_event.error.stack}`);
// });

export default {
  isJson,
  tuple,
};
