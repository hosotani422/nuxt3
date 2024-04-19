/**
 * 通知登録
 *
 * @param msgs 通知内容
 * @param callback コールバック関数
 * @param scope コールバック関数のスコープ
 * @param args オプション
 */
export const insert = (
  msgs: { title: string; message: string; date: Date },
  callback?: () => void,
  scope?: object,
  args?: object,
): void => {
  window.cordova?.plugins.notification.local.schedule(
    {
      title: msgs.title,
      text: msgs.message,
      trigger: {
        at: msgs.date,
      },
    },
    callback,
    scope,
    args,
  );
};

/**
 * 通知削除
 *
 * @param ids IDリスト
 * @param callback コールバック関数
 * @param scope コールバック関数のスコープ
 */
export const remove = (ids: number[], callback?: () => void, scope?: object): void => {
  window.cordova?.plugins.notification.local.cancel(ids, callback, scope);
};

/**
 * 全通知削除
 *
 * @param callback コールバック関数
 * @param scope コールバック関数のスコープ
 */
export const removeAll = (callback?: () => void, scope?: object): void => {
  window.cordova?.plugins.notification.local.cancelAll(callback, scope);
};

export default {
  insert,
  remove,
  removeAll,
};
