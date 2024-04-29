import Validation from "@/validation/schema";
import constant from "@/utils/const";

const temp: {
  callback: {
    ok?: () => void;
    cancel?: () => void;
  };
} = {
  callback: {
    ok: () => ``,
    cancel: () => ``,
  },
};

const useStore = defineStore(`dialog`, () => {
  const state: {
    open: boolean;
    init: boolean;
    mode: `alert` | `confirm` | `text` | `check` | `radio`;
    title: string;
    message: string;
    text: {
      value: string;
      placeholder: string;
      error: string;
    };
    check: {
      all: boolean;
      sort: string[];
      data: {
        [K: string]: {
          check: boolean;
          title: string;
        };
      };
    };
    radio: {
      none: boolean;
      select: string;
      sort: string[];
      data: {
        [K: string]: {
          title: string;
        };
      };
    };
    ok?: string;
    cancel?: string;
  } = reactive(constant.init.dialog);

  const getter = reactive({
    stateCheckAll: computed(() => (): boolean => {
      return Object.values(state.check!.data).reduce((last, current) => last && current.check, true);
    }),
    errorValidation: computed(() => (): string => {
      if (state.mode === `text`) {
        return Validation.emptySchema().safeParse(state.text!.value).error?.errors[0]?.message || ``;
      } else if (state.mode === `radio`) {
        return Validation.emptySchema().safeParse(state.radio!.select).error?.errors[0]?.message || ``;
      }
      return ``;
    }),
  });

  const action = {
    open: (arg: {
      mode: typeof state.mode;
      title: typeof state.title;
      message: typeof state.message;
      text?: typeof state.text;
      check?: typeof state.check;
      radio?: typeof state.radio;
      ok?: typeof state.ok;
      cancel?: typeof state.cancel;
      callback?: typeof temp.callback;
    }): void => {
      state.init = true;
      state.open = true;
      state.mode = arg.mode;
      state.title = arg.title;
      state.message = arg.message;
      arg.text && (state.text = arg.text);
      arg.check && (state.check = arg.check);
      arg.radio && (state.radio = arg.radio);
      state.ok = arg.ok;
      state.cancel = arg.cancel;
      temp.callback = arg.callback!;
    },
    close: (): void => {
      state.open = false;
    },
    clickCheckAll: (arg: { check: boolean }): void => {
      Object.values(state.check!.data).forEach((data) => (data.check = arg.check));
    },
  };

  return { state, getter, action };
});

const store = useStore(createPinia());

export default { temp, state: store.state, getter: store.getter, action: store.action };
