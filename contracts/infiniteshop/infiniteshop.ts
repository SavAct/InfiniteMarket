// =====================================================
// WARNING: GENERATED FILE
//
// Any changes you make will be overwritten by Lamington
// =====================================================

import { Account, Contract, GetTableRowsOptions, ExtendedAsset, ExtendedSymbol, ActorPermission, Asset, TableRowsResult } from 'lamington';

// Table row types
export interface InfiniteshopAdditem {
	seller: string;
	category: number | string | bigint;
	title: string;
	imgs: Array<string>;
	pp: Array<InfiniteshopPiecesPrice>;
	prepT: number;
	fromR: string;
	excl: string;
	shipTo: Array<InfiniteshopToRegion>;
	opts: Array<string>;
	descr: string;
	note: string;
	available: boolean;
	expired: number;
}

export interface InfiniteshopBan {
	user: string;
	ban: boolean;
}

export interface InfiniteshopDeleteuser {
	user: string;
}

export interface InfiniteshopIdAndCategory {
	id: number | string | bigint;
	category: number | string | bigint;
}

export interface InfiniteshopItemTable {
	id: number | string | bigint;
	seller: string;
	available: boolean;
	title: string;
	imgs: Array<string>;
	pp: Array<InfiniteshopPiecesPrice>;
	prepT: number;
	fromR: string;
	shipTo: Array<InfiniteshopToRegion>;
	excl: string;
	opts: Array<string>;
	descr: string;
	note: string;
	expired: number;
}

export interface InfiniteshopItemstate {
	id: number | string | bigint;
	category: number | string | bigint;
	available: boolean;
	expired: number;
}

export interface InfiniteshopPiecesPrice {
	p: number | string | bigint;
	pcs: number;
}

export interface InfiniteshopRemoveitem {
	id: number | string | bigint;
	category: number | string | bigint;
}

export interface InfiniteshopRmexpired {
	category: number | string | bigint;
}

export interface InfiniteshopToRegion {
	t: number;
	p: number;
	rs: string;
}

export interface InfiniteshopTokenSymbol {
	sym: string;
	contr: string;
	chain: string;
}

export interface InfiniteshopUpdateuser {
	user: string;
	contact: Array<string>;
	allowed: Array<InfiniteshopTokenSymbol>;
	active: boolean;
	pgp: string;
	note: string;
}

export interface InfiniteshopUserTable {
	user: string;
	contact: Array<string>;
	allowed: Array<InfiniteshopTokenSymbol>;
	active: boolean;
	lastUpdate: number;
	items: Array<InfiniteshopIdAndCategory>;
	banned: boolean;
	pgp: string;
	note: string;
}

// Added Types

// Variants

export interface Infiniteshop extends Contract {
	// Actions
	additem(seller: string, category: number | string | bigint, title: string, imgs: Array<string>, pp: Array<InfiniteshopPiecesPrice>, prepT: number, fromR: string, excl: string, shipTo: Array<InfiniteshopToRegion>, opts: Array<string>, descr: string, note: string, available: boolean, expired: number, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	ban(user: string, ban: boolean, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	deleteuser(user: string, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	itemstate(id: number | string | bigint, category: number | string | bigint, available: boolean, expired: number, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	removeitem(id: number | string | bigint, category: number | string | bigint, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	rmexpired(category: number | string | bigint, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	updateuser(user: string, contact: Array<string>, allowed: Array<InfiniteshopTokenSymbol>, active: boolean, pgp: string, note: string, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	// Actions with object params. (This is WIP and not ready for use)
	additem_object_params(params: {seller: string, category: number | string | bigint, title: string, imgs: Array<string>, pp: Array<InfiniteshopPiecesPrice>, prepT: number, fromR: string, excl: string, shipTo: Array<InfiniteshopToRegion>, opts: Array<string>, descr: string, note: string, available: boolean, expired: number}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	ban_object_params(params: {user: string, ban: boolean}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	deleteuser_object_params(params: {user: string}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	itemstate_object_params(params: {id: number | string | bigint, category: number | string | bigint, available: boolean, expired: number}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	removeitem_object_params(params: {id: number | string | bigint, category: number | string | bigint}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	rmexpired_object_params(params: {category: number | string | bigint}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	updateuser_object_params(params: {user: string, contact: Array<string>, allowed: Array<InfiniteshopTokenSymbol>, active: boolean, pgp: string, note: string}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	
	// Tables
	itemTable(options?: GetTableRowsOptions): Promise<TableRowsResult<InfiniteshopItemTable>>;
	userTable(options?: GetTableRowsOptions): Promise<TableRowsResult<InfiniteshopUserTable>>;
}

