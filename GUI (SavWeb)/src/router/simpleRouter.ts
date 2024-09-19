import { routes } from "./routes";

export interface RouteLocation {
  name: string;
  query?: Object;
  title?: string;
  color?: string;
}

export declare interface NavigationHook {
  (to: RouteLocation, from?: RouteLocation): any;
}

let afterEachRouteChange: NavigationHook;
let beforeEachRouteChange: NavigationHook;

/**
 * Simple route object that mimics some functions of Vue route
 */
export const route = Vue.reactive({
  name: Vue.computed(() => {
    return recordIndex.value >= 0 && record.length > 0
      ? record[recordIndex.value].name
      : "";
  }),
  query: Vue.computed(() => {
    return recordIndex.value >= 0 && record.length > 0
      ? record[recordIndex.value].query
      : undefined;
  }),
  title: Vue.computed(() => {
    return recordIndex.value >= 0 && record.length > 0
      ? record[recordIndex.value].title
      : undefined;
  }),
  color: Vue.computed(() => {
    return recordIndex.value >= 0 && record.length > 0
      ? record[recordIndex.value].color
      : undefined;
  }),
});

const _recordIndex = Vue.ref<number>(-1);
const recordIndex = Vue.computed({
  get: () => {
    return _recordIndex.value;
  },
  set: (value) => {
    const from = router.currentRoute();
    const to = record[value];
    if (
      typeof beforeEachRouteChange !== "function" ||
      beforeEachRouteChange(to, from) !== false
    ) {
      // At first remove the current page and then load it, to force a reload if the page name keeps the same
      _recordIndex.value = -1;
      setTimeout(() => (_recordIndex.value = value), 0);
    }
    (async () => {
      if (typeof afterEachRouteChange == "function") {
        afterEachRouteChange(to, from);
      }
    })();
  },
});

const record = new Array<RouteLocation>();

function getQueryFromString(query_str: string): { [key: string]: any } {
  // TODO: parse also hash
  const sq = query_str.split("&");
  const query: { [key: string]: any } = {};
  for (let q of sq) {
    const q2 = q.split("=");
    if (q2.length == 2) {
      let v: any;
      switch (q2[1]) {
        case "true":
          v = true;
          break;
        case "false":
          v = false;
          break;
        default:
          v = isNaN(Number(q2[1])) ? q2[1] : Number(q2[1]);
          break;
      }
      query[q2[0]] = v;
    } else {
      query[q2[0]] = true;
    }
  }
  return query;
}

const normalizeRoute = (to: RouteLocation | string) => {
  let norm: RouteLocation | undefined = undefined;
  if (typeof to == "string") {
    // just a string as input
    const sf = to.indexOf("?");
    const sh = to.indexOf("#");
    let query: { [key: string]: any } | undefined = {};
    let path: string;
    let s: number;
    if (sf > 0 && sh > 0) {
      s = Math.min(sf, sh);
      path = to.substring(0, s);
      const query_str = to.substring(s + 1);
      query = getQueryFromString(query_str);
    } else {
      s = -1;
      path = to;
    }
    norm = routes.find((v) => path == v.name);
    if (norm) norm.query = query;
  } else {
    // object as input
    if ("name" in to) {
      norm = routes.find((v) => to.name == v.name);
    }
    if (norm !== undefined) {
      if ("query" in to) {
        norm.query = to.query;
      } else {
        norm.query = {};
      }
    }
  }

  if (norm) {
    return {
      name: norm.name,
      title: norm.title,
      color: norm.color,
      query: typeof norm.query === "object" ? norm.query : {},
    };
  }
  return undefined;
};

/**
 * Simple router that mimics some functions of Vue router
 */
export const router = {
  push: (to: RouteLocation | string) => {
    const n_to = normalizeRoute(to);
    if (n_to) {
      record.splice(
        recordIndex.value + 1,
        record.length - recordIndex.value - 1,
        n_to
      );
      recordIndex.value = record.length - 1;
    }
  },
  replace: (to: RouteLocation | string) => {
    const n_to = normalizeRoute(to);
    if (n_to) {
      if (recordIndex.value >= 0 && record.length) {
        record[recordIndex.value] = n_to;
      }
    }
  },
  back: () => {
    if (recordIndex.value > 0 && record.length > 0) {
      console.log("back", recordIndex.value, recordIndex.value - 1, record);
      if(record[recordIndex.value].name === 'buy'){
        if(!confirm('Are you sure you want to leave the payment process?')){
          return false;
        }
      }
      recordIndex.value--;
      return true;
    }
    return false;
  },
  forward: () => {
    if (recordIndex.value < record.length - 1) {
      console.log("forward", recordIndex.value, recordIndex.value + 1, record);
      if(record[recordIndex.value].name === 'buy'){
        if(!confirm('Are you sure you want to leave the payment process?')){
          return false;
        }
      }
      recordIndex.value++;
      return true;
    }
    return false;
  },
  go: (delta: number) => {
    const index = recordIndex.value + delta;
    if (index >= 0 && index < record.length - 1) {
      recordIndex.value = index;
      return true;
    }
    return false;
  },
  afterEach: (guard: NavigationHook) => {
    afterEachRouteChange = guard;
  },
  beforeEach: (guard: NavigationHook) => {
    beforeEachRouteChange = guard;
  },
  getRoutes: () => {
    return [...record];
  },
  currentRoute: () => {
    return recordIndex.value >= 0 && record.length
      ? record[recordIndex.value]
      : undefined;
  },
  canBack: Vue.computed(() => {
    return recordIndex.value > 0 && record.length > 0;
  }),
  canForward: Vue.computed(() => {
    return recordIndex.value < record.length - 1;
  }),
};
