import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: `ja`;
    resources: {
      ja: Locale;
      en: Locale;
    };
  }
}

type Locale = {
  button: {
    cancel: string;
    clear: string;
    ok: string;
  };
  placeholder: {
    list: string;
    main: string;
    sub: string;
    memo: string;
    date: string;
    time: string;
    alarm: string;
  };
  dialog: {
    title: {
      insert: string;
      move: string;
      delete: string;
      reset: string;
      backup: string;
      backupError: string;
      fileError: string;
      alarm: string;
    };
    select: {
      all: string;
      none: string;
    };
    alarm: {
      title: string;
      sort: string;
      data1: { label: string; value: number };
      data2: { label: string; value: number };
      data3: { label: string; value: number };
      data4: { label: string; value: number };
      data5: { label: string; value: number };
      data6: { label: string; value: number };
      data7: { label: string; value: number };
      data8: { label: string; value: number };
      data9: { label: string; value: number };
      data10: { label: string; value: number };
      data11: { label: string; value: number };
      data12: { label: string; value: number };
    };
  };
  calendar: {
    sort: string;
    week1: string;
    week2: string;
    week3: string;
    week4: string;
    week5: string;
    week6: string;
    week7: string;
  };
  notice: {
    message: string;
    button: string;
  };
  conf: {
    title: string;
    size: {
      title: string;
      value: { [L in `1` | `2` | `3`]: string };
    };
    speed: {
      title: string;
      value: { [L in `1` | `2` | `3`]: string };
    };
    volume: {
      title: string;
      value: { [L in `0` | `1` | `2` | `3`]: string };
    };
    vibrate: {
      title: string;
      value: { [L in `off` | `on`]: string };
    };
    theme: {
      title: string;
      value: { [L in `light` | `dark`]: string };
    };
    lang: {
      title: string;
      value: { [L in `en` | `ja`]: string };
    };
    save: {
      title: string;
      value: { [L in `local` | `rest` | `gql`]: string };
    };
    backup: {
      title: string;
      download: string;
      upload: string;
    };
    reset: {
      title: string;
      conf: string;
      list: string;
    };
  };
  validation: {
    noempty: string;
  };
};
