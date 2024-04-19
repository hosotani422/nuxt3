import * as base from "@/utils/const/base";
import lists from "@/stores/page/list";
import mains from "@/stores/page/main";
import subs from "@/stores/page/sub";
import confs from "@/stores/page/conf";
import calendars from "@/stores/popup/calendar";
import clocks from "@/stores/popup/clock";
import dialogs from "@/stores/popup/dialog";
import notices from "@/stores/popup/notice";

export const listId = base.id.inbox;

export const list: (typeof lists)[`state`][`data`] = {
  sort: [base.id.inbox, base.id.trash],
  data: {
    [base.id.inbox]: { title: `Inbox` },
    [base.id.trash]: { title: `Trash` },
  },
};

export const main: (typeof mains)[`state`][`data`] = {
  [base.id.inbox]: {
    sort: [base.id.main],
    data: {
      [base.id.main]: {
        check: false,
        title: `サンプル`,
        date: ``,
        time: ``,
        alarm: [],
        task: true,
      },
    },
  },
  [base.id.trash]: { sort: [], data: {} },
};

export const sub: (typeof subs)[`state`][`data`] = {
  [base.id.inbox]: {
    data: {
      [base.id.main]: { sort: [base.id.sub], data: { [base.id.sub]: { check: false, title: `` } } },
    },
  },
  [base.id.trash]: { data: {} },
};

export const conf: (typeof confs)[`state`][`data`] = {
  size: 2,
  speed: 2,
  volume: 1,
  vibrate: `on`,
  theme: `light`,
  lang: `ja`,
  save: `local`,
};

export const calendar: (typeof calendars)[`state`] = {
  open: false,
  select: ``,
  current: ``,
  cancel: ``,
  clear: ``,
  callback: () => ``,
};

export const clock: (typeof clocks)[`state`] = {
  open: false,
  hour: 0,
  minute: 0,
  cancel: ``,
  clear: ``,
  ok: ``,
  callback: () => ``,
};

export const dialog: (typeof dialogs)[`state`] = {
  open: false,
  mode: `alert`,
  title: ``,
  message: ``,
  text: {
    value: ``,
    placeholder: ``,
    error: ``,
  },
  check: {
    all: false,
    sort: [],
    data: {},
  },
  radio: {
    none: false,
    select: ``,
    sort: [],
    data: {},
  },
  ok: ``,
  cancel: ``,
  callback: {
    ok: () => ``,
    cancel: () => ``,
  },
};

export const notice: (typeof notices)[`state`] = {
  open: false,
  message: ``,
  button: ``,
  callback: () => ``,
  timeoutId: 0,
};

export default {
  listId,
  list,
  main,
  sub,
  conf,
  calendar,
  clock,
  dialog,
  notice,
};
