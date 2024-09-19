export interface UserTable {
  user: string;
  contact: Array<string>;
  allowed: Array<TokenSymbol>;
  active: boolean;
  lastUpdate: number;
  items: Array<IdAndCategory>;
  banned: boolean;
  pgp: string;
  note: string;
}

export interface ItemTable {
  id: number | string | bigint;
  seller: string;
  available: boolean;
  title: string;
  imgs: Array<string>;
  pp: Array<PiecesPrice>;
  prepT: number;
  fromR: string;
  shipTo: Array<ToRegion>;
  excl: string;
  opts: Array<string>;
  descr: string;
  note: string;
  expired: number;
}

export interface AddItem {
  seller: string;
  category: number | string | bigint;
  title: string;
  imgs: Array<string>;
  pp: Array<PiecesPrice>;
  prepT: number;
  fromR: string;
  excl: string;
  shipTo: Array<ToRegion>;
  opts: Array<string>;
  descr: string;
  note: string;
  available: boolean;
  expired: number;
}

export interface Ban {
  user: string;
  ban: boolean;
}

export interface Deleteuser {
  user: string;
}

export interface IdAndCategory {
  id: number | string | bigint;
  category: number | string | bigint;
}

export interface PiecesPrice {
  p: number | string | bigint;
  pcs: number;
}

export interface Itemstate {
  id: number | string | bigint;
  category: number | string | bigint;
  available: boolean;
  expired: number;
}

export interface Removeitem {
  id: number | string | bigint;
  category: number | string | bigint;
}

export interface Rmexpired {
  category: number | string | bigint;
}

export interface ToRegion {
  t: number; // shipping duration in seconds
  p: number; // shipping price
  rs: string; // region names
}

export interface TokenSymbol {
  sym: string;
  contr: string;
  chain: string;
}

export interface Updateuser {
  user: string;
  contact: Array<string>;
  allowed: Array<TokenSymbol>;
  active: boolean;
  pgp: string;
  note: string;
}
