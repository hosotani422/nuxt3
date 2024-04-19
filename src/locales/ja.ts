import { Locale } from "@/utils/type/i18next";

export const ja: Locale = {
  button: {
    cancel: `キャンセル`,
    clear: `クリア`,
    ok: `決定`,
  },
  placeholder: {
    list: `リスト`,
    main: `タスク`,
    sub: `サブタスク`,
    memo: `メモ`,
    date: `日付`,
    time: `時刻`,
    alarm: `アラーム`,
  },
  dialog: {
    title: {
      insert: `新規登録`,
      move: `移動先の選択`,
      delete: `本当に削除しますか`,
      reset: `本当にリセットしますか`,
      backup: `バックアップが完了しました`,
      backupError: `バックアップが失敗しました`,
      fileError: `ファイルの形式が違います`,
      alarm: `Memotea アラーム`,
    },
    select: {
      all: `全選択`,
      none: `未選択`,
    },
    alarm: {
      title: `通知タイミングの選択`,
      sort: `12`,
      data1: { label: `時刻通り`, value: 0 },
      data2: { label: `5分前`, value: 5 },
      data3: { label: `10分前`, value: 10 },
      data4: { label: `15分前`, value: 15 },
      data5: { label: `30分前`, value: 30 },
      data6: { label: `1時間前`, value: 60 },
      data7: { label: `2時間前`, value: 120 },
      data8: { label: `3時間前`, value: 180 },
      data9: { label: `6時間前`, value: 360 },
      data10: { label: `12時間前`, value: 720 },
      data11: { label: `1日前`, value: 1440 },
      data12: { label: `2日前`, value: 2880 },
    },
  },
  calendar: {
    sort: `7`,
    week1: `日`,
    week2: `月`,
    week3: `火`,
    week4: `水`,
    week5: `木`,
    week6: `金`,
    week7: `土`,
  },
  notice: {
    message: `削除が完了しました`,
    button: `元に戻す`,
  },
  conf: {
    title: `設定`,
    size: {
      title: `文字サイズ`,
      value: {
        "1": `小`,
        "2": `中`,
        "3": `大`,
      },
    },
    speed: {
      title: `アニメ速度`,
      value: {
        "1": `低`,
        "2": `中`,
        "3": `高`,
      },
    },
    volume: {
      title: `音量`,
      value: {
        "0": `無`,
        "1": `小`,
        "2": `中`,
        "3": `大`,
      },
    },
    vibrate: {
      title: `振動`,
      value: {
        off: `無`,
        on: `有`,
      },
    },
    theme: {
      title: `テーマ`,
      value: {
        light: `明`,
        dark: `暗`,
      },
    },
    lang: {
      title: `言語`,
      value: {
        en: `英語`,
        ja: `日本語`,
      },
    },
    save: {
      title: `自動保存`,
      value: {
        local: `LOCAL`,
        rest: `REST`,
        gql: `GQL`,
      },
    },
    backup: {
      title: `保存ファイル`,
      download: `保存`,
      upload: `復元`,
    },
    reset: {
      title: `初期化`,
      conf: `設定`,
      list: `メモ`,
    },
  },
  validation: {
    noempty: `空白以外の文字列を１つ以上入力してください。`,
  },
} as const;