// =====================================================
// WARNING: GENERATED FILE
//
// Any changes you make will be overwritten by Lamington
// =====================================================

import { Account, Contract, GetTableRowsOptions, ExtendedAsset, ExtendedSymbol, ActorPermission, Asset, TableRowsResult } from 'lamington';

// Table row types
export interface InfiniteshopAdditem {
	seller: string;
	category: string;
	title: string;
	imgs: Array<string>;
	price: number | string | bigint;
	prepT: number;
	fromR: string;
	excl: string;
	shipTo: Array<InfiniteshopToRegion>;
	options: Array<string>;
	descr: string;
	note: string;
	available: boolean;
	expired: number;
}

export interface InfiniteshopBan {
	seller: string;
	ban: boolean;
}

export interface InfiniteshopDeleteseller {
	seller: string;
}

export interface InfiniteshopIdAndCategory {
	id: number | string | bigint;
	category: string;
}

export interface InfiniteshopItemTable {
	id: number | string | bigint;
	seller: string;
	available: boolean;
	title: string;
	imgs: Array<string>;
	price: number | string | bigint;
	prepT: number;
	fromR: string;
	shipTo: Array<InfiniteshopToRegion>;
	excl: string;
	options: Array<string>;
	descr: string;
	note: string;
	expired: number;
}

export interface InfiniteshopItemstate {
	id: number | string | bigint;
	category: string;
	available: boolean;
	expired: number;
}

export interface InfiniteshopRemoveitem {
	id: number | string | bigint;
	category: string;
}

export interface InfiniteshopRmexpired {
	category: string;
}

export interface InfiniteshopSellerTable {
	seller: string;
	allowed: Array<InfiniteshopTokenSymbol>;
	active: boolean;
	lastUpdate: number;
	items: Array<InfiniteshopIdAndCategory>;
	banned: boolean;
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

export interface InfiniteshopUpdateseller {
	seller: string;
	allowed: Array<InfiniteshopTokenSymbol>;
	active: boolean;
}

// Added Types

// Variants

export interface Infiniteshop extends Contract {
	// Actions
	additem(seller: string, category: string, title: string, imgs: Array<string>, price: number | string | bigint, prepT: number, fromR: string, excl: string, shipTo: Array<InfiniteshopToRegion>, options: Array<string>, descr: string, note: string, available: boolean, expired: number, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	ban(seller: string, ban: boolean, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	deleteseller(seller: string, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	itemstate(id: number | string | bigint, category: string, available: boolean, expired: number, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	removeitem(id: number | string | bigint, category: string, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	rmexpired(category: string, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	updateseller(seller: string, allowed: Array<InfiniteshopTokenSymbol>, active: boolean, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	// Actions with object params. (This is WIP and not ready for use)
	additem_object_params(params: {seller: string, category: string, title: string, imgs: Array<string>, price: number | string | bigint, prepT: number, fromR: string, excl: string, shipTo: Array<InfiniteshopToRegion>, options: Array<string>, descr: string, note: string, available: boolean, expired: number}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	ban_object_params(params: {seller: string, ban: boolean}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	deleteseller_object_params(params: {seller: string}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	itemstate_object_params(params: {id: number | string | bigint, category: string, available: boolean, expired: number}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	removeitem_object_params(params: {id: number | string | bigint, category: string}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	rmexpired_object_params(params: {category: string}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	updateseller_object_params(params: {seller: string, allowed: Array<InfiniteshopTokenSymbol>, active: boolean}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	
	// Tables
	itemTable(options?: GetTableRowsOptions): Promise<TableRowsResult<InfiniteshopItemTable>>;
	sellerTable(options?: GetTableRowsOptions): Promise<TableRowsResult<InfiniteshopSellerTable>>;
}

