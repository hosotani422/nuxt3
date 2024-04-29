import constant from "@/utils/const";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";

export const readList = async (): Promise<typeof list.state.data> => {
  if (conf.state.data.save === `rest`) {
    const response = await useFetch<string>(`/read`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `text/plain` },
      method: `GET`,
      query: { name: `list` },
    });
    return JSON.parse(response.data.value!);
  } else if (conf.state.data.save === `gql`) {
    const response = await $fetch<{ data: { readList: string } }>(`/gql`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `application/json` },
      method: `POST`,
      body: JSON.stringify({ query: `query {readList}` }),
    });
    return JSON.parse(response.data.readList);
  } else if (process.client) {
    return JSON.parse(localStorage.getItem(`list`)!) || constant.init.list;
  }
  return constant.init.list;
};

export const writeList = (data: (typeof list)[`state`][`data`]): void => {
  if (conf.state.data.save === `rest`) {
    useFetch(`/write`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `text/plain` },
      method: `POST`,
      query: { name: `list` },
      body: data,
    });
  } else if (conf.state.data.save === `gql`) {
    useFetch(`http://localhost:3001/gql`, {
      method: `POST`,
      headers: { "Content-Type": `application/json` },
      body: JSON.stringify({
        query: `query GetWriteList($data: String!) {writeList(data: $data)}`,
        variables: { data: JSON.stringify(data) },
      }),
    });
  } else if (process.client) {
    localStorage.setItem(`list`, JSON.stringify(data));
  }
};

export const readMain = async (): Promise<typeof main.state.data> => {
  if (conf.state.data.save === `rest`) {
    const response = await useFetch<string>(`/read`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `text/plain` },
      method: `GET`,
      query: { name: `main` },
    });
    return JSON.parse(response.data.value!);
  } else if (conf.state.data.save === `gql`) {
    const response = await $fetch<{ data: { readMain: string } }>(`/gql`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `application/json` },
      method: `POST`,
      body: JSON.stringify({ query: `query {readMain}` }),
    });
    return JSON.parse(response.data.readMain);
  } else if (process.client) {
    return JSON.parse(localStorage.getItem(`main`)!) || constant.init.main;
  }
  return constant.init.main;
};

export const writeMain = (data: (typeof main)[`state`][`data`]): void => {
  if (conf.state.data.save === `rest`) {
    useFetch(`/write`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `text/plain` },
      method: `POST`,
      query: { name: `main` },
      body: data,
    });
  } else if (conf.state.data.save === `gql`) {
    useFetch(`http://localhost:3001/gql`, {
      method: `POST`,
      headers: { "Content-Type": `application/json` },
      body: JSON.stringify({
        query: `query GetWriteMain($data: String!) {writeMain(data: $data)}`,
        variables: { data: JSON.stringify(data) },
      }),
    });
  } else if (process.client) {
    localStorage.setItem(`main`, JSON.stringify(data));
  }
};

export const readSub = async (): Promise<typeof sub.state.data> => {
  if (conf.state.data.save === `rest`) {
    const response = await useFetch<string>(`/read`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `text/plain` },
      method: `GET`,
      query: { name: `sub` },
    });
    return JSON.parse(response.data.value!);
  } else if (conf.state.data.save === `gql`) {
    const response = await $fetch<{ data: { readSub: string } }>(`/gql`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `application/json` },
      method: `POST`,
      body: JSON.stringify({ query: `query {readSub}` }),
    });
    return JSON.parse(response.data.readSub);
  } else if (process.client) {
    return JSON.parse(localStorage.getItem(`sub`)!) || constant.init.sub;
  }
  return constant.init.sub;
};

export const writeSub = (data: (typeof sub)[`state`][`data`]): void => {
  if (conf.state.data.save === `rest`) {
    useFetch(`/write`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `text/plain` },
      method: `POST`,
      query: { name: `sub` },
      body: data,
    });
  } else if (conf.state.data.save === `gql`) {
    useFetch(`http://localhost:3001/gql`, {
      method: `POST`,
      headers: { "Content-Type": `application/json` },
      body: JSON.stringify({
        query: `query GetWriteSub($data: String!) {writeSub(data: $data)}`,
        variables: { data: JSON.stringify(data) },
      }),
    });
  } else if (process.client) {
    localStorage.setItem(`sub`, JSON.stringify(data));
  }
};

export const readConf = async (): Promise<typeof conf.state.data> => {
  if (conf.state.data.save === `rest`) {
    const response = await useFetch<string>(`/read`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `text/plain` },
      method: `GET`,
      query: { name: `conf` },
    });
    return JSON.parse(response.data.value!);
  } else if (conf.state.data.save === `gql`) {
    const response = await $fetch<{ data: { readConf: string } }>(`/gql`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `application/json` },
      method: `POST`,
      body: JSON.stringify({ query: `query {readConf}` }),
    });
    return JSON.parse(response.data.readConf);
  } else if (process.client) {
    return JSON.parse(localStorage.getItem(`conf`)!) || constant.init.conf;
  }
  return constant.init.conf;
};

export const writeConf = (data: (typeof conf)[`state`][`data`]): void => {
  if (conf.state.data.save === `rest`) {
    useFetch(`/write`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `text/plain` },
      method: `POST`,
      query: { name: `conf` },
      body: data,
    });
  } else if (conf.state.data.save === `gql`) {
    useFetch(`http://localhost:3001/gql`, {
      method: `POST`,
      headers: { "Content-Type": `application/json` },
      body: JSON.stringify({
        query: `query GetWriteConf($data: String!) {writeConf(data: $data)}`,
        variables: { data: JSON.stringify(data) },
      }),
    });
  } else if (process.client) {
    localStorage.setItem(`conf`, JSON.stringify(data));
  }
};

export const readRoute = async (): Promise<string> => {
  if (conf.state.data.save === `rest`) {
    const response = await useFetch<string>(`read`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `text/plain` },
      method: `GET`,
      query: { name: `route` },
    });
    return response.data.value!;
  } else if (conf.state.data.save === `gql`) {
    const response = await $fetch<{ data: { readRoute: string } }>(`/gql`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `application/json` },
      method: `POST`,
      body: JSON.stringify({ query: `query {readRoute}` }),
    });
    return JSON.parse(response.data.readRoute);
  } else if (process.client) {
    return localStorage.getItem(`route`) || constant.base.id.inbox;
  }
  return constant.base.id.inbox;
};

export const writeRoute = (data: string): void => {
  if (conf.state.data.save === `rest`) {
    useFetch(`/write`, {
      baseURL: `http://localhost:3001`,
      headers: { "Content-Type": `text/plain` },
      method: `POST`,
      query: { name: `route` },
      body: data,
    });
  } else if (conf.state.data.save === `gql`) {
    useFetch(`http://localhost:3001/gql`, {
      method: `POST`,
      headers: { "Content-Type": `application/json` },
      body: JSON.stringify({
        query: `query GetWriteRoute($data: String!) {writeRoute(data: $data)}`,
        variables: { data: JSON.stringify(data) },
      }),
    });
  } else if (process.client) {
    localStorage.setItem(`route`, data);
  }
};

export default {
  readList,
  writeList,
  readMain,
  writeMain,
  readSub,
  writeSub,
  readConf,
  writeConf,
  readRoute,
  writeRoute,
};
