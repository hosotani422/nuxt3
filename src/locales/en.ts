import { Locale } from "@/utils/type/i18next";

export const en: Locale = {
  button: {
    cancel: `Cancel`,
    clear: `Clear`,
    ok: `OK`,
  },
  placeholder: {
    list: `list`,
    main: `task`,
    sub: `subtask`,
    memo: `memo`,
    date: `date`,
    time: `time`,
    alarm: `alarm`,
  },
  dialog: {
    title: {
      insert: `Sign up`,
      move: `Destination selection`,
      delete: `Do you really want to delete this`,
      reset: `Do you really want to reset`,
      backup: `Backup completed`,
      backupError: `Backup failure`,
      fileError: `File format is different`,
      alarm: `Memotea Alarm`,
    },
    select: {
      all: `Select all`,
      none: `Unselected`,
    },
    alarm: {
      title: `Selection of notification timing`,
      sort: `12`,
      data1: { label: `On time`, value: 0 },
      data2: { label: `5 minutes ago`, value: 5 },
      data3: { label: `10 minutes ago`, value: 10 },
      data4: { label: `15 minutes ago`, value: 15 },
      data5: { label: `30 minutes ago`, value: 30 },
      data6: { label: `1 hour ago`, value: 60 },
      data7: { label: `2 hour ago`, value: 120 },
      data8: { label: `3 hour ago`, value: 180 },
      data9: { label: `6 hour ago`, value: 360 },
      data10: { label: `12 hour ago`, value: 720 },
      data11: { label: `1 day ago`, value: 1440 },
      data12: { label: `2 day ago`, value: 2880 },
    },
  },
  calendar: {
    sort: `7`,
    week1: `Sun`,
    week2: `Mon`,
    week3: `Tue`,
    week4: `Wed`,
    week5: `Thu`,
    week6: `Fri`,
    week7: `Sat`,
  },
  notice: {
    message: `The deletion is complete`,
    button: `Restore`,
  },
  conf: {
    title: `Configuration`,
    size: {
      title: `Font size`,
      value: {
        "1": `S`,
        "2": `M`,
        "3": `L`,
      },
    },
    speed: {
      title: `Anime speed`,
      value: {
        "1": `S`,
        "2": `N`,
        "3": `F`,
      },
    },
    volume: {
      title: `Volume`,
      value: {
        "0": `X`,
        "1": `S`,
        "2": `M`,
        "3": `L`,
      },
    },
    vibrate: {
      title: `Vibrate`,
      value: {
        off: `off`,
        on: `on`,
      },
    },
    theme: {
      title: `Theme`,
      value: {
        light: `Light`,
        dark: `Dark`,
      },
    },
    lang: {
      title: `Language`,
      value: {
        en: `English`,
        ja: `Japanese`,
      },
    },
    save: {
      title: `AutoSave`,
      value: {
        local: `LOCAL`,
        rest: `REST`,
        gql: `GQL`,
      },
    },
    backup: {
      title: `SaveFile`,
      download: `Download`,
      upload: `Upload`,
    },
    reset: {
      title: `Reset`,
      conf: `Config`,
      list: `Memo`,
    },
  },
  validation: {
    noempty: `Please enter one or more non-blank strings.`,
  },
} as const;