export default defineI18nConfig(() => ({
  legacy: false,
  locale: `ja`,
  defaultLocale: `ja`,
  messages: {
    ja: {
      button: {
        cancel: "キャンセル",
        clear: "クリア",
        ok: "決定",
      },
      placeholder: {
        list: "リスト",
        main: "タスク",
        sub: "サブタスク",
        memo: "メモ",
        date: "日付",
        time: "時刻",
        alarm: "アラーム",
      },
      dialog: {
        title: {
          insert: "新規登録",
          move: "移動先の選択",
          delete: "本当に削除しますか",
          reset: "本当にリセットしますか",
          backup: "バックアップが完了しました",
          backupError: "バックアップが失敗しました",
          fileError: "ファイルの形式が違います",
          alarm: "Memotea アラーム",
        },
        select: {
          all: "全選択",
          none: "未選択",
        },
        alarm: {
          title: "通知タイミングの選択",
          sort: "12",
          data1: { label: "時刻通り", value: 0 },
          data2: { label: "5分前", value: 5 },
          data3: { label: "10分前", value: 10 },
          data4: { label: "15分前", value: 15 },
          data5: { label: "30分前", value: 30 },
          data6: { label: "1時間前", value: 60 },
          data7: { label: "2時間前", value: 120 },
          data8: { label: "3時間前", value: 180 },
          data9: { label: "6時間前", value: 360 },
          data10: { label: "12時間前", value: 720 },
          data11: { label: "1日前", value: 1440 },
          data12: { label: "2日前", value: 2880 },
        },
      },
      calendar: {
        sort: "7",
        week1: "日",
        week2: "月",
        week3: "火",
        week4: "水",
        week5: "木",
        week6: "金",
        week7: "土",
      },
      notice: {
        message: "削除が完了しました",
        button: "元に戻す",
      },
      conf: {
        title: "設定",
        size: {
          title: "文字サイズ",
          value: {
            "1": "小",
            "2": "中",
            "3": "大",
          },
        },
        speed: {
          title: "アニメ速度",
          value: {
            "1": "低",
            "2": "中",
            "3": "高",
          },
        },
        volume: {
          title: "音量",
          value: {
            "0": "無",
            "1": "小",
            "2": "中",
            "3": "大",
          },
        },
        vibrate: {
          title: "振動",
          value: {
            off: "無",
            on: "有",
          },
        },
        theme: {
          title: "テーマ",
          value: {
            light: "明",
            dark: "暗",
          },
        },
        lang: {
          title: "言語",
          value: {
            en: "英語",
            ja: "日本語",
          },
        },
        save: {
          title: "自動保存",
          value: {
            local: "LOCAL",
            rest: "REST",
            gql: "GQL",
          },
        },
        backup: {
          title: "保存ファイル",
          download: "保存",
          upload: "復元",
        },
        reset: {
          title: "初期化",
          conf: "設定",
          list: "メモ",
        },
      },
    },
    en: {
      button: {
        cancel: "Cancel",
        clear: "Clear",
        ok: "OK",
      },
      placeholder: {
        list: "list",
        main: "task",
        sub: "subtask",
        memo: "memo",
        date: "date",
        time: "time",
        alarm: "alarm",
      },
      dialog: {
        title: {
          insert: "Sign up",
          move: "Destination selection",
          delete: "Do you really want to delete this",
          reset: "Do you really want to reset",
          backup: "Backup completed",
          backupError: "Backup failure",
          fileError: "File format is different",
          alarm: "Memotea Alarm",
        },
        select: {
          all: "Select all",
          none: "Unselected",
        },
        alarm: {
          title: "Selection of notification timing",
          sort: "12",
          data1: { label: "On time", value: 0 },
          data2: { label: "5 minutes ago", value: 5 },
          data3: { label: "10 minutes ago", value: 10 },
          data4: { label: "15 minutes ago", value: 15 },
          data5: { label: "30 minutes ago", value: 30 },
          data6: { label: "1 hour ago", value: 60 },
          data7: { label: "2 hour ago", value: 120 },
          data8: { label: "3 hour ago", value: 180 },
          data9: { label: "6 hour ago", value: 360 },
          data10: { label: "12 hour ago", value: 720 },
          data11: { label: "1 day ago", value: 1440 },
          data12: { label: "2 day ago", value: 2880 },
        },
      },
      calendar: {
        sort: "7",
        week1: "Sun",
        week2: "Mon",
        week3: "Tue",
        week4: "Wed",
        week5: "Thu",
        week6: "Fri",
        week7: "Sat",
      },
      notice: {
        message: "The deletion is complete",
        button: "Restore",
      },
      conf: {
        title: "Configuration",
        size: {
          title: "Font size",
          value: {
            "1": "S",
            "2": "M",
            "3": "L",
          },
        },
        speed: {
          title: "Anime speed",
          value: {
            "1": "S",
            "2": "N",
            "3": "F",
          },
        },
        volume: {
          title: "Volume",
          value: {
            "0": "X",
            "1": "S",
            "2": "M",
            "3": "L",
          },
        },
        vibrate: {
          title: "Vibrate",
          value: {
            off: "off",
            on: "on",
          },
        },
        theme: {
          title: "Theme",
          value: {
            light: "Light",
            dark: "Dark",
          },
        },
        lang: {
          title: "Language",
          value: {
            en: "English",
            ja: "Japanese",
          },
        },
        save: {
          title: "AutoSave",
          value: {
            local: "LOCAL",
            rest: "REST",
            gql: "GQL",
          },
        },
        backup: {
          title: "SaveFile",
          download: "Download",
          upload: "Upload",
        },
        reset: {
          title: "Reset",
          conf: "Config",
          list: "Memo",
        },
      },
    },
  },
}));
