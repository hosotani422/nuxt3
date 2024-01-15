import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import fs from "fs";
import * as Api from "@/api/api";
import lang from "@/utils/lang/lang";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";

beforeEach(async () => {
  const backup = fs.readFileSync(`./test/memotea.bak`, `utf-8`).split(`\n`);
  app.state.backId = backup[0]!;
  list.state.data = JSON.parse(backup[1]!);
  main.state.data = JSON.parse(backup[2]!);
  sub.state.data = JSON.parse(backup[3]!);
  conf.state.data = JSON.parse(backup[4]!);
  vi.mock(`vue-router`, () => ({
    useRoute: () => ({
      params: { listId: `list1111111111111`, mainId: `main1111111111111` },
    }),
    useRouter: () => ``,
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe(`getter`, () => {
  it(`isApp`, () => {
    expect(app.getter.isApp()).toBe(true);
  });
  it(`listId`, () => {
    expect(app.getter.listId()).toBe(`list1111111111111`);
  });
  it(`mainId`, () => {
    expect(app.getter.mainId()).toBe(`main1111111111111`);
  });
  it(`lang`, () => {
    expect(app.getter.lang()).toBe(lang[conf.state.data.lang]);
  });
  it(`classTop`, () => {
    expect(app.getter.classTop()).toBe(`${conf.state.data.theme} speed2 text-base`);
  });
  it(`classBottom`, () => {
    expect(app.getter.classBottom()).toBe(`flex-[0_0_50px]`);
  });
});

describe(`action`, () => {
  it(`initPage`, async () => {
    vi.spyOn(conf.action, `initPage`).mockResolvedValue();
    vi.spyOn(sub.action, `initPage`).mockResolvedValue();
    vi.spyOn(main.action, `initPage`).mockResolvedValue();
    vi.spyOn(list.action, `initPage`).mockResolvedValue();
    vi.spyOn(app.action, `clearTrash`).mockReturnValue();
    vi.spyOn(conf.action, `actPage`).mockReturnValue();
    vi.spyOn(sub.action, `actPage`).mockReturnValue();
    vi.spyOn(main.action, `actPage`).mockReturnValue();
    vi.spyOn(list.action, `actPage`).mockReturnValue();
    await app.action.initPage();
    expect(conf.action.initPage).toBeCalledTimes(1);
    expect(sub.action.initPage).toBeCalledTimes(1);
    expect(main.action.initPage).toBeCalledTimes(1);
    expect(list.action.initPage).toBeCalledTimes(1);
    expect(app.action.clearTrash).toBeCalledTimes(1);
    expect(conf.action.actPage).toBeCalledTimes(1);
    expect(sub.action.actPage).toBeCalledTimes(1);
    expect(main.action.actPage).toBeCalledTimes(1);
    expect(list.action.actPage).toBeCalledTimes(1);
  });
  it(`saveRoute`, () => {
    vi.spyOn(Api, `writeRoute`).mockReturnValue();
    app.action.saveRoute({ listId: `list1111111111111` });
    expect(Api.writeRoute).toBeCalledTimes(1);
    expect(Api.writeRoute).toBeCalledWith(`list1111111111111`);
  });
  it(`routerList`, async () => {
    const pushRouterMock = await (async () => {
      const mock = vi.fn();
      vi.spyOn(await import(`vue-router`), `useRouter`).mockReturnValue({
        push: mock,
      } as ReturnType<typeof useRouter>);
      return mock;
    })();
    app.action.routerList();
    expect(pushRouterMock).toBeCalledTimes(1);
    expect(pushRouterMock).toBeCalledWith(`/list1111111111111/list`);
  });
  it(`routerMain`, async () => {
    const pushRouterMock = await (async () => {
      const mock = vi.fn();
      vi.spyOn(await import(`vue-router`), `useRouter`).mockReturnValue({
        push: mock,
      } as ReturnType<typeof useRouter>);
      return mock;
    })();
    app.action.routerMain({ listId: `list1111111111111` });
    expect(pushRouterMock).toBeCalledTimes(1);
    expect(pushRouterMock).toBeCalledWith(`/list1111111111111`);
  });
  it(`routerSub`, async () => {
    const pushRouterMock = await (async () => {
      const mock = vi.fn();
      vi.spyOn(await import(`vue-router`), `useRouter`).mockReturnValue({
        push: mock,
      } as ReturnType<typeof useRouter>);
      return mock;
    })();
    app.action.routerSub({ mainId: `main1111111111111` });
    expect(pushRouterMock).toBeCalledTimes(1);
    expect(pushRouterMock).toBeCalledWith(`/list1111111111111/sub/main1111111111111`);
  });
  it(`routerConf`, async () => {
    const pushRouterMock = await (async () => {
      const mock = vi.fn();
      vi.spyOn(await import(`vue-router`), `useRouter`).mockReturnValue({
        push: mock,
      } as ReturnType<typeof useRouter>);
      return mock;
    })();
    app.action.routerConf();
    expect(pushRouterMock).toBeCalledTimes(1);
    expect(pushRouterMock).toBeCalledWith(`/list1111111111111/conf`);
  });
  it(`routerBack`, async () => {
    vi.spyOn(app.action, `saveRoute`).mockReturnValue();
    const backRouterMock = await (async () => {
      const mock = vi.fn();
      vi.spyOn(await import(`vue-router`), `useRouter`).mockReturnValue({
        back: mock,
      } as ReturnType<typeof useRouter>);
      return mock;
    })();
    app.action.routerBack();
    expect(app.state.backId).toBe(``);
    expect(app.action.saveRoute).toBeCalledTimes(0);
    expect(backRouterMock).toBeCalledTimes(1);
    app.action.routerBack({ listId: `list0000000000000` });
    expect(app.state.backId).toBe(`list0000000000000`);
    expect(app.action.saveRoute).toBeCalledTimes(1);
    expect(app.action.saveRoute).toBeCalledWith({ listId: `list0000000000000` });
    expect(backRouterMock).toBeCalledTimes(2);
  });
  it(`clearTrash`, () => {
    app.action.clearTrash();
    expect(main.state.data[`list9999999999999`]).toEqual({ sort: [], data: {} });
    expect(sub.state.data[`list9999999999999`]).toEqual({ data: {} });
  });
});
