import base from "@/utils/const/base";
import store from "@/stores";

export const list: typeof store.list.state.data = {
  sort: [base.id.inbox, base.id.trash],
  data: {
    [base.id.inbox]: { title: `Inbox` },
    [base.id.trash]: { title: `Trash` },
  },
};

export const main: typeof store.main.state.data = {
  [base.id.inbox]: {
    sort: [base.id.main],
    data: { [base.id.main]: { check: false, title: `サンプル`, date: ``, time: ``, alarm: [], task: true } },
  },
  [base.id.trash]: { sort: [], data: {} },
};

export const sub: typeof store.sub.state.data = {
  [base.id.inbox]: {
    data: { [base.id.main]: { sort: [base.id.sub], data: { [base.id.sub]: { check: false, title: `` } } } },
  },
  [base.id.trash]: { data: {} },
};

export const conf: typeof store.conf.state.data = {
  size: 2,
  speed: 2,
  theme: `light`,
  lang: `ja`,
  vibrate: `on`,
  save: `local`,
};

export const calendar: typeof store.calendar.state = {
  open: false,
  select: ``,
  current: ``,
  cancel: ``,
  clear: ``,
};

export const clock: typeof store.clock.state = {
  open: false,
  hour: 0,
  minute: 0,
  cancel: ``,
  clear: ``,
  ok: ``,
};

export const dialog: typeof store.dialog.state = {
  open: false,
  init: true,
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
};

export const notice: typeof store.notice.state = {
  open: false,
  message: ``,
  button: ``,
};

export default {
  list,
  main,
  sub,
  conf,
  calendar,
  clock,
  dialog,
  notice,
};
