import {
  GetTableByScopeResult,
  GetTableByScopeResultRow,
} from "eosjs/dist/eosjs-rpc-interfaces";
import {
  AssetSymbol,
  Token,
  nameToBigInt,
} from "../Components/AntelopeHelpers";
import { get_available_tokens } from "../Components/AvailableTokens";
import {
  AddItem,
  ItemTable,
  UserTable,
} from "../Components/ContractInterfaces";
import { PublicAccount } from "../Components/SavWeb";
import { savWeb } from "./connect";

export interface ExtendedTokenSymbol {
  symbol: AssetSymbol;
  contract: string;
  chain: string;
}

export interface User extends Omit<UserTable, "allowed"> {
  allowed: Array<ExtendedTokenSymbol>;
}

export interface MarketContract {
  account: string;
  chain: string;
  actions: {
    addItem: string;
    removeItem: string;
    removeExpired: string;
    updateItemState: string;
    updateUser: string;
    deleteUser: string;
    banUser: string;
  };
  tables: {
    user: string;
    item: string;
  };
}

export interface CategoryCacheEntry {
  list: CategoryList;
  last: LastBoundaryInfo;
}

interface ItemCacheEntry {
  time: number;
  entry: ItemTable;
}

interface CategoryList {
  [key: number]: ItemCacheEntry;
}

interface LastBoundaryInfo {
  upper: { id: number; hasMore: boolean };
  lower: { id: number; hasMore: boolean };
}

const contract: MarketContract = {
  account: "infiniteshop",
  chain: "lamington",
  actions: {
    addItem: "additem",
    removeItem: "removeitem",
    removeExpired: "rmexpired",
    updateItemState: "itemstate",
    updateUser: "updateuser",
    deleteUser: "deleteuser",
    banUser: "ban",
  },
  tables: {
    user: "user",
    item: "item",
  },
};

const savpayContract = {
  account: "savactsavpay",
  chain: "eos",
  tables: {
    tokens: "tokens",
  },
};

const defaultValue = {
  startPage: {
    name: "home",
    query: undefined//{ id: 0, category: 792915009393917952n }, // {}
  },
  prepDuration: 3600 * 24 * 2 * 1000, // 2 days
  shipDuration: 3600 * 24 * 5 * 1000, // 5 days
  expireDuration: 3600 * 24 * 30 * 1000, // 30 days
};

// Dark style
const darkStyle = Vue.computed({
  get: () => {
    return Quasar.Dark.isActive;
  },
  set: (value) => {
    Quasar.Dark.set(value);
  },
});

const indexPageCategory = Vue.ref<bigint>(0n);

/**
 * Get the key for the articles by category cache
 * @param data Article data
 * @returns key
 */
function getArticlesByCategoryKey(data: {
  chain: string;
  account: string;
  category: string | bigint | number;
}) {
  return `${String(BigInt(data.category))}_${data.chain}_${data.account}`;
}

/**
 * Get the key for the article cache
 * @param data Article data
 * @returns key
 */
function getUserKey(user: string, marketContract: MarketContract) {
  return `${user}_${marketContract.account}_${marketContract.chain}`;
}

function resetBoundaries() {
  return {
    upper: { id: -1, hasMore: true },
    lower: { id: Number.MAX_VALUE, hasMore: true },
  };
}

// Articles
const articleLists = new Map<string, CategoryCacheEntry>(); // category + chain data -> article id -> article

// Users
const userEntry = new Map<string, { time: number; entry: UserTable }>();

/**
 * Get article from cache or blockchain
 * @param id Article id
 * @param category Article data
 * @param forceUpdate Update the cache of this article
 * @returns Article otherwise undefined
 */
async function getArticle(
  data: {
    id: number;
    category: bigint;
  } & MarketContract,
  forceUpdate = false
): Promise<ItemTable | undefined> {
  const keyByCat = getArticlesByCategoryKey(data);
  let aList = articleLists.get(keyByCat);
  if (aList === undefined) {
    aList = { list: {}, last: resetBoundaries() };
    articleLists.set(keyByCat, aList);
  }
  const art = aList.list[data.id];

  if (!forceUpdate && art !== undefined && art.time + 1800000 > Date.now()) {
    // Update at least after 30 minutes
    return art.entry;
  } else {
    const category = BigInt(data.category);
    const result = await savWeb.getTableRows({
      chain: data.chain,
      code: data.account,
      table: data.tables.item,
      scope: String(category),
      entry: data.id,
    });
    if (result && "rows" in result && result.rows.length > 0) {
      const entry = result.rows[0];
      aList.list[data.id] = { time: Date.now(), entry };
      return entry;
    }
  }
  return undefined;
}

export enum GetArticleMode {
  upper,
  lower,
  reset,
}

/**
 * Get articles from cache or blockchain
 * @param category Article data
 * @param marketContract Market contract
 * @param mode Mode to get articles
 * @returns Articles otherwise undefined
 */
async function getArticles(
  data: { category: bigint } & MarketContract,
  mode?: GetArticleMode
) {
  const limit = 100;
  let upper_bound: string | undefined = undefined;
  let lower_bound: string | undefined = undefined;

  const keyByCat = getArticlesByCategoryKey(data);
  let aList = articleLists.get(keyByCat);
  if (aList === undefined) {
    aList = { list: {}, last: resetBoundaries() };
    articleLists.set(keyByCat, aList);
  }

  switch (mode) {
    case GetArticleMode.reset: // Reset boundaries
      aList.last = resetBoundaries();
      aList.list = {};
      break;
    case GetArticleMode.upper: // Expand upper boundary
      if (aList.last.upper.id !== -1) {
        upper_bound = String(aList.last.upper.id + limit - 1);
        lower_bound = String(aList.last.upper.id);
      }
      break;
    case GetArticleMode.lower: // Expand lower boundary
      if (aList.last.lower.id !== Number.MAX_VALUE) {
        upper_bound = String(aList.last.lower.id);
        const lower = aList.last.lower.id - limit + 1;
        lower_bound = String(lower < 0 ? 0 : lower);
      }
      break;
  }

  const result = await savWeb.getTableRows({
    chain: data.chain,
    code: data.account,
    table: data.tables.item,
    scope: String(data.category),
    limit,
    upper_bound,
    lower_bound,
  });
  if (result && "rows" in result && result.rows.length > 0) {
    // Add articles to cache
    const inListIds = new Set<number>();
    for (const art of result.rows) {
      aList.list[art.id] = { time: Date.now(), entry: art };
      inListIds.add(art.id);
    }

    // Remove articles that are not in the result within the requested boundaries
    if (
      lower_bound !== undefined &&
      upper_bound !== undefined &&
      (mode === GetArticleMode.upper || mode === GetArticleMode.lower)
    ) {
      const start = Number(lower_bound);
      const end = Number(upper_bound);
      for (let id = start; id <= end; id++) {
        if (!inListIds.has(id)) {
          delete aList.list[id];
        }
      }
    }

    // Expand already requested boundaries
    const lastEntry = result.rows[result.rows.length - 1];
    const firstEntry = result.rows[0];
    setBoundaries(aList.last, firstEntry.id, lastEntry.id);
  }

  return articleLists.get(keyByCat);
}

function setBoundaries(
  last: LastBoundaryInfo,
  firstId: number,
  lastId: number
) {
  if (last.lower.id > lastId) {
    last.lower.id = lastId;
  }
  if (last.lower.id > firstId) {
    last.lower.id = firstId;
  }
  if (last.upper.id < lastId) {
    last.upper.id = lastId;
  }
  if (last.upper.id < firstId) {
    last.upper.id = firstId;
  }
}

/**
 * Get user from cache or blockchain
 * @param user User account name
 * @param marketContract Market contract
 * @param forceUpdate Update the cache of this user
 * @returns
 */
async function getUser(
  user: string,
  marketContract: MarketContract,
  forceUpdate = false
): Promise<UserTable | undefined> {
  const key = getUserKey(user, marketContract);
  const seUser = userEntry.get(key);

  if (
    !forceUpdate &&
    seUser !== undefined &&
    seUser.time + 1800000 > Date.now()
  ) {
    // Update at least after 30 minutes
    return seUser.entry;
  } else {
    const result = await savWeb.getTableRows({
      chain: marketContract.chain,
      code: marketContract.account,
      table: marketContract.tables.user,
      scope: marketContract.account,
      entry: user,
    });
    if (result && "rows" in result && result.rows.length > 0) {
      const user = result.rows[0];
      userEntry.set(key, { time: Date.now(), entry: user });
      return user;
    }
  }
  return undefined;
}

// Allowed tokens
const isGettingAvailableTokens = Vue.ref<boolean>(false);
let allowedTokens: Array<Token> = [];
let loadedAllTokensWithError = true;
async function getAvailableTokens(callback: (hasError?: boolean) => void) {
  if (loadedAllTokensWithError) {
    const aTokens = await get_available_tokens(
      isGettingAvailableTokens,
      (hasError0: boolean) => {
        loadedAllTokensWithError = hasError0;
        callback(hasError0);
      }
    );
    allowedTokens = aTokens ? aTokens : [];
  }
  return allowedTokens;
}

// Get categories
const usedCategories = Vue.ref<Map<bigint, number>>(new Map<bigint, number>());
const usedCategoriesLastUpdate = Vue.ref<number>(0);
let isUpdatingUsedCategories = false;
let nextCategoriesLowerBound: bigint | undefined = 0n;
/**
 * Load categories that are in use
 * @param loadAll it loads all categories if true otherwise only the next 100
 * @returns
 */
async function updateUsedCategories(loadAll: boolean) {
  if (isUpdatingUsedCategories) return undefined;
  isUpdatingUsedCategories = true;
  try {
    do {
      const limit = 100;
      const result = await savWeb.getTableByScope({
        chain: contract.chain,
        code: contract.account,
        table: contract.tables.item,
        limit,
        lower_bound:
          nextCategoriesLowerBound !== undefined
            ? String(nextCategoriesLowerBound)
            : undefined,
      });
      if (result && "rows" in result) {
        for (const row of result.rows as GetTableByScopeResultRow[]) {
          const cat = nameToBigInt(row.scope);
          usedCategories.value.set(cat, Number(row.count));
        }
        const more = (result as unknown as GetTableByScopeResult).more;

        nextCategoriesLowerBound =
          more !== undefined && more !== "" ? nameToBigInt(more) : undefined;
      } else {
        return false;
      }
      // Sleep 1 second to not overload the server
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (loadAll && nextCategoriesLowerBound !== undefined);
    usedCategoriesLastUpdate.value = Date.now();
  } catch (e) {
    console.log("Error while getting the used categories", e);
    return false;
  }
  isUpdatingUsedCategories = false;
  return undefined;
}

const loginUser = Vue.ref<PublicAccount | undefined>(undefined);
const user = Vue.ref<User>({
  user: "",
  contact: [],
  allowed: [],
  active: false,
  lastUpdate: 0,
  items: [],
  banned: false,
  pgp: "",
  note: "",
});

const defaultUserName = Vue.computed(() => {
  if (user.value.user === undefined || user.value.user === "") {
    if (loginUser.value?.name !== undefined) {
      return loginUser.value?.name;
    }
    return "";
  }
  return user.value.user;
});

const uploadPageInputs = Vue.ref<AddItem | undefined>(undefined);

// Elements of the main header to calculate the window height
const mainHeaderRef = Vue.ref<{ $el: HTMLElement } | null>(null);

const thumbStyle: any = {
  borderRadius: "7px",
  backgroundColor: "#4994EC", //#4994EC
  opacity: 0.7,
};

const barStyle: any = {
  borderRadius: "9px",
  backgroundColor: "white",
  opacity: 0.2,
};

export const state = {
  DISABLE_ENCRYPTION: true,
  contract,
  savpayContract,
  loginUser,
  user,
  defaultUserName,
  darkStyle,
  mainHeaderRef,
  thumbStyle,
  barStyle,
  getAvailableTokens,
  isGettingAvailableTokens,
  uploadPageInputs,
  defaultValue,
  getArticle,
  getArticles,
  getUser,
  indexPageCategory,
  updateUsedCategories,
  usedCategories,
  usedCategoriesLastUpdate,
};
