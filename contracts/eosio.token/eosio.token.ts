// =====================================================
// WARNING: GENERATED FILE
//
// Any changes you make will be overwritten by Lamington
// =====================================================

import { Account, Contract, GetTableRowsOptions, ExtendedAsset, ExtendedSymbol, ActorPermission, Asset, TableRowsResult } from 'lamington';

// Table row types
export interface EosioTokenAccount {
	balance: Asset;
}

export interface EosioTokenAddvesting {
	account: string;
	vesting_start: Date;
	vesting_length: number;
	vesting_quantity: Asset;
}

export interface EosioTokenBurn {
	from: string;
	quantity: Asset;
	memo: string;
}

export interface EosioTokenClose {
	owner: string;
	symbol: string;
}

export interface EosioTokenCreate {
	issuer: string;
	maximum_supply: Asset;
}

export interface EosioTokenCurrencyStats {
	supply: Asset;
	max_supply: Asset;
	issuer: string;
}

export interface EosioTokenIssue {
	to: string;
	quantity: Asset;
	memo: string;
}

export interface EosioTokenOpen {
	owner: string;
	symbol: string;
	ram_payer: string;
}

export interface EosioTokenTransfer {
	from: string;
	to: string;
	quantity: Asset;
	memo: string;
}

export interface EosioTokenVestingItem {
	account: string;
	vesting_start: Date;
	vesting_length: number;
	vesting_quantity: Asset;
}

// Added Types

// Variants

export interface EosioToken extends Contract {
	// Actions
	addvesting(account: string, vesting_start: Date, vesting_length: number, vesting_quantity: Asset, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	burn(from: string, quantity: Asset, memo: string, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	close(owner: string, symbol: string, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	create(issuer: string, maximum_supply: Asset, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	issue(to: string, quantity: Asset, memo: string, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	open(owner: string, symbol: string, ram_payer: string, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	transfer(from: string, to: string, quantity: Asset, memo: string, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	// Actions with object params. (This is WIP and not ready for use)
	addvesting_object_params(params: {account: string, vesting_start: Date, vesting_length: number, vesting_quantity: Asset}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	burn_object_params(params: {from: string, quantity: Asset, memo: string}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	close_object_params(params: {owner: string, symbol: string}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	create_object_params(params: {issuer: string, maximum_supply: Asset}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	issue_object_params(params: {to: string, quantity: Asset, memo: string}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	open_object_params(params: {owner: string, symbol: string, ram_payer: string}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	transfer_object_params(params: {from: string, to: string, quantity: Asset, memo: string}, options?: { from?: Account, auths?: ActorPermission[] }): Promise<any>;
	
	// Tables
	accountsTable(options?: GetTableRowsOptions): Promise<TableRowsResult<EosioTokenAccount>>;
	statTable(options?: GetTableRowsOptions): Promise<TableRowsResult<EosioTokenCurrencyStats>>;
	vestingsTable(options?: GetTableRowsOptions): Promise<TableRowsResult<EosioTokenVestingItem>>;
}

