import Vue from "vue";
import constant from "@/utils/const";
import conf from "@/stores/page/conf";

const refer: {
  hour?: Vue.Ref<Vue.ComponentPublicInstance<HTMLCanvasElement> | undefined>;
  minute?: Vue.Ref<Vue.ComponentPublicInstance<HTMLCanvasElement> | undefined>;
} = {};

const useStore = defineStore(`clock`, () => {
  const state: {
    open: boolean;
    hour: number;
    minute: number;
    cancel: string;
    clear: string;
    ok: string;
    callback: (hour?: number, minute?: number) => void;
  } = reactive(constant.init.clock);

  const action = {
    open: async (payload: {
      hour: typeof state.hour;
      minute: typeof state.minute;
      cancel: typeof state.cancel;
      clear: typeof state.clear;
      ok: typeof state.ok;
      callback: typeof state.callback;
    }) => {
      state.open = true;
      state.hour = payload.hour;
      state.minute = payload.minute;
      state.cancel = payload.cancel;
      state.clear = payload.clear;
      state.ok = payload.ok;
      state.callback = payload.callback;
      await nextTick();
      action.drawHour({ target: refer.hour!.value! });
      action.drawMinute({ target: refer.minute!.value! });
    },
    close: (): void => {
      state.open = false;
    },
    inputHour: (payload: { target: HTMLElement; pageX: number; pageY: number }): void => {
      const target = payload.target as HTMLCanvasElement;
      const x = payload.pageX - target.getBoundingClientRect().left;
      const y = payload.pageY - target.getBoundingClientRect().top;
      const half = target.getBoundingClientRect().height / 2;
      const angle = (Math.atan((half - y) / (half - x)) * 360) / (Math.PI * 2) + (x >= half ? 90 : 270);
      const inner = Math.sqrt((half - x) ** 2 + (half - y) ** 2) < half * 0.66;
      let hour = Math.round(angle / 30) + (inner ? 12 : 0);
      hour % 12 === 0 && (hour = inner ? 0 : 12);
      state.hour = hour;
      action.drawHour({ target });
    },
    inputMinute: (payload: { target: HTMLElement; pageX: number; pageY: number }): void => {
      const target = payload.target as HTMLCanvasElement;
      const x = payload.pageX - target.getBoundingClientRect().left;
      const y = payload.pageY - target.getBoundingClientRect().top;
      const half = target.getBoundingClientRect().height / 2;
      const angle = (Math.atan((half - y) / (half - x)) * 360) / (Math.PI * 2) + (x >= half ? 90 : 270);
      const minute = Math.round(angle / 6) === 60 ? 0 : Math.round(angle / 6);
      state.minute = minute;
      action.drawMinute({ target });
    },
    drawHour: (payload: { target: HTMLCanvasElement }): void => {
      const ctx = payload.target.getContext(`2d`)!;
      const half = payload.target.getBoundingClientRect().height / 2;
      const hour = state.hour === 0 ? 24 : state.hour;
      ctx.canvas.setAttribute(`width`, `${half * 2}px`);
      ctx.canvas.setAttribute(`height`, `${half * 2}px`);
      // 基準位置
      ctx.translate(half, half);
      // 外側円
      action.drawCircle({
        ctx,
        x: 0,
        y: 0,
        half,
        color: conf.state.data.theme === `light` ? `#dddddd` : `#000000`,
      });
      // 中心円
      action.drawCircle({ ctx, x: 0, y: 0, half: 3, color: `#1188dd` });
      // 回転開始
      ctx.rotate(hour * 30 * (Math.PI / 180));
      // 選択円
      action.drawCircle({
        ctx,
        x: 0,
        y: half * (hour > 12 ? -0.52 : -0.82),
        half: half * 0.16,
        color: `#1188dd`,
      });
      // 選択線
      action.drawLine({
        ctx,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: half * (hour > 12 ? -0.52 : -0.82),
        width: 1,
        color: `#1188dd`,
      });
      // 回転終了
      ctx.rotate(-hour * 30 * (Math.PI / 180));
      // 外側文字
      action.drawChar({
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ctx,
        select: hour,
        size: `1rem`,
        range: half * 0.82,
        color: conf.state.data.theme === `dark` ? `#ffffff` : `#333333`,
      });
      // 内側文字
      action.drawChar({
        list: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        ctx,
        select: hour,
        size: `0.8rem`,
        range: half * 0.52,
        color: conf.state.data.theme === `dark` ? `#ffffff` : `#333333`,
      });
    },
    drawMinute: (payload: { target: HTMLCanvasElement }): void => {
      const ctx = payload.target.getContext(`2d`)!;
      const half = payload.target.getBoundingClientRect().height / 2;
      const minute = state.minute;
      ctx.canvas.setAttribute(`width`, `${half * 2}px`);
      ctx.canvas.setAttribute(`height`, `${half * 2}px`);
      // 基準位置
      ctx.translate(half, half);
      // 外側円
      action.drawCircle({
        ctx,
        x: 0,
        y: 0,
        half,
        color: conf.state.data.theme === `light` ? `#dddddd` : `#000000`,
      });
      // 中心円
      action.drawCircle({ ctx, x: 0, y: 0, half: 3, color: `#1188dd` });
      // 回転開始
      ctx.rotate(minute * 6 * (Math.PI / 180));
      // 選択円
      action.drawCircle({ ctx, x: 0, y: half * -0.82, half: half * 0.16, color: `#1188dd` });
      // 選択線
      action.drawLine({
        ctx,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: half * -0.82,
        width: 1,
        color: `#1188dd`,
      });
      // 回転終了
      ctx.rotate(-minute * 6 * (Math.PI / 180));
      // 文字
      action.drawChar({
        list: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 0],
        ctx,
        select: minute,
        size: `1rem`,
        range: half * 0.82,
        color: conf.state.data.theme === `dark` ? `#ffffff` : `#333333`,
      });
    },
    drawCircle: (payload: {
      ctx: CanvasRenderingContext2D;
      x: number;
      y: number;
      half: number;
      color: string;
    }): void => {
      payload.ctx.beginPath();
      payload.ctx.fillStyle = payload.color;
      payload.ctx.arc(payload.x, payload.y, payload.half, 0, 360 * (Math.PI / 180), false);
      payload.ctx.fill();
    },
    drawLine: (payload: {
      ctx: CanvasRenderingContext2D;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
      width: number;
      color: string;
    }): void => {
      payload.ctx.beginPath();
      payload.ctx.lineWidth = payload.width;
      payload.ctx.strokeStyle = payload.color;
      payload.ctx.moveTo(payload.fromX, payload.fromY);
      payload.ctx.lineTo(payload.toX, payload.toY);
      payload.ctx.stroke();
    },
    drawChar: (payload: {
      ctx: CanvasRenderingContext2D;
      list: number[];
      select: number;
      size: string;
      range: number;
      color: string;
    }): void => {
      payload.ctx.font = `normal ${payload.size} sans-serif`;
      payload.ctx.textAlign = `center`;
      payload.ctx.textBaseline = `middle`;
      for (const [i, item] of payload.list.entries()) {
        payload.ctx.fillStyle = item === payload.select ? `#ffffff` : payload.color;
        payload.ctx.fillText(
          String(item),
          payload.range * Math.sin((i + 7) * -30 * (Math.PI / 180)),
          payload.range * Math.cos((i + 7) * -30 * (Math.PI / 180)),
        );
      }
    },
  };

  return { state, action };
});

const store = useStore(createPinia());

export default { refer, state: store.state, action: store.action };
