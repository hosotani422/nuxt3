import constant from "@/utils/const";

const temp: {
  timeoutId: number;
  callback: () => void;
} = {
  timeoutId: 0,
  callback: () => ``,
};

const useStore = defineStore(`notice`, () => {
  const state: {
    open: boolean;
    message: string;
    button: string;
  } = reactive(constant.init.notice);

  const action = {
    open: (arg: {
      message: typeof state.message;
      button: typeof state.button;
      callback: typeof temp.callback;
    }): void => {
      state.open = true;
      state.message = arg.message;
      state.button = arg.button;
      temp.callback = arg.callback;
      clearTimeout(temp.timeoutId);
      temp.timeoutId = setTimeout(() => {
        action.close();
      }, 3000) as unknown as number;
    },
    close: (): void => {
      state.open = false;
    },
  };

  return { state, action };
});

const store = useStore(createPinia());

export default { temp, state: store.state, action: store.action };
