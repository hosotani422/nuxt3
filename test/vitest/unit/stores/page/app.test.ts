import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import i18next from "i18next";
import Api from "@/api/api";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import fixture from "../../../fixture/base";
import { ja } from "@/locales/ja";
import { en } from "@/locales/en";

beforeEach(async () => {
  await fixture.loadData();
  vi.mock(`vue-router`, () => ({
    useRoute: () => ({
      params: { listId: `list1111111111111`, mainId: `main1111111111111` },
    }),
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {} }),
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe(`action`, () => {
  it(`initPage`, async () => {
    const langMock = vi.spyOn(i18next, `init`);
    const confMock = vi.spyOn(conf.action, `init`).mockResolvedValue();
    const subMock = vi.spyOn(sub.action, `init`).mockResolvedValue();
    const mainMock = vi.spyOn(main.action, `init`).mockResolvedValue();
    const listMock = vi.spyOn(list.action, `init`).mockResolvedValue();
    const clearMock = vi.spyOn(app.action, `clearTrash`).mockReturnValue();
    await app.action.init();
    expect(langMock).toBeCalledTimes(1);
    expect(langMock).toBeCalledWith({
      lng: `ja`,
      resources: {
        ja: { translation: ja },
        en: { translation: en },
      },
    });
    expect(confMock).toBeCalledTimes(1);
    expect(confMock).toBeCalledWith();
    expect(subMock).toBeCalledTimes(1);
    expect(subMock).toBeCalledWith();
    expect(mainMock).toBeCalledTimes(1);
    expect(mainMock).toBeCalledWith();
    expect(listMock).toBeCalledTimes(1);
    expect(listMock).toBeCalledWith();
    expect(clearMock).toBeCalledTimes(1);
    expect(clearMock).toBeCalledWith();
  });
  it(`getDuration`, () => {
    conf.state.data.speed = 1;
    expect(app.action.getDuration()).toBe(500);
    conf.state.data.speed = 2;
    expect(app.action.getDuration()).toBe(250);
    conf.state.data.speed = 3;
    expect(app.action.getDuration()).toBe(100);
  });
  it(`routerList`, async () => {
    const routerMock = vi.spyOn(app.temp.router, `push`).mockReturnThis();
    app.action.routerList();
    expect(routerMock).toBeCalledTimes(1);
    expect(routerMock).toBeCalledWith(`/list1111111111111/list`);
  });
  it(`routerMain`, async () => {
    const routerMock = vi.spyOn(app.temp.router, `push`).mockReturnThis();
    app.action.routerMain({ listId: `list1111111111111` });
    expect(routerMock).toBeCalledTimes(1);
    expect(routerMock).toBeCalledWith(`/list1111111111111`);
  });
  it(`routerSub`, async () => {
    const routerMock = vi.spyOn(app.temp.router, `push`).mockReturnThis();
    app.action.routerSub({ mainId: `main1111111111111` });
    expect(routerMock).toBeCalledTimes(1);
    expect(routerMock).toBeCalledWith(`/list1111111111111/sub/main1111111111111`);
  });
  it(`routerConf`, async () => {
    const routerMock = vi.spyOn(app.temp.router, `push`).mockReturnThis();
    app.action.routerConf();
    expect(routerMock).toBeCalledTimes(1);
    expect(routerMock).toBeCalledWith(`/list1111111111111/conf`);
  });
  it(`routerBack`, async () => {
    const routerMock = vi.spyOn(app.temp.router, `back`).mockReturnThis();
    const writeMock = vi.spyOn(Api, `writeRoute`).mockReturnValue();
    app.action.routerBack();
    expect(app.temp.backId).toBe(``);
    expect(writeMock).toBeCalledTimes(0);
    expect(routerMock).toBeCalledTimes(1);
    expect(routerMock).toBeCalledWith();
    app.action.routerBack({ listId: `list0000000000000` });
    expect(app.temp.backId).toBe(`list0000000000000`);
    expect(writeMock).toBeCalledTimes(1);
    expect(writeMock).toBeCalledWith(`list0000000000000`);
    expect(routerMock).toBeCalledTimes(2);
    expect(routerMock).toBeCalledWith();
  });
  it(`clearTrash`, () => {
    app.action.clearTrash();
    expect(main.state.data[`list9999999999999`]).toEqual({ sort: [], data: {} });
    expect(sub.state.data[`list9999999999999`]).toEqual({ data: {} });
  });
  it(`forceUpdate`, () => {
    vi.setSystemTime(new Date(9465660000000));
    app.action.forceUpdate();
    expect(app.state.updateKey).toBe(`9465660000000`);
  });
});

describe(`getter`, () => {
  it(`listId`, () => {
    expect(app.getter.listId()).toBe(`list1111111111111`);
  });
  it(`mainId`, () => {
    expect(app.getter.mainId()).toBe(`main1111111111111`);
  });
  it(`attrClass`, () => {
    expect(app.getter.attrClass({ hoge: `hoge`, class: `class` })).toEqual({ class: `class` });
  });
  it(`attrAlmost`, () => {
    expect(app.getter.attrAlmost({ hoge: `hoge`, class: `class` })).toEqual({ hoge: `hoge` });
  });
  it(`classTheme`, () => {
    expect(app.getter.classTheme()).toBe(`dark`);
  });
  it(`classSize`, () => {
    conf.state.data.size = 1;
    expect(app.getter.classSize()).toBe(`text-sm`);
    conf.state.data.size = 2;
    expect(app.getter.classSize()).toBe(`text-base`);
    conf.state.data.size = 3;
    expect(app.getter.classSize()).toBe(`text-lg`);
  });
  it(`classSpeed`, () => {
    conf.state.data.speed = 1;
    expect(app.getter.classSpeed()).toBe(`slow`);
    conf.state.data.speed = 2;
    expect(app.getter.classSpeed()).toBe(`just`);
    conf.state.data.speed = 3;
    expect(app.getter.classSpeed()).toBe(`fast`);
  });
});
