import {
  GetTableByScopeResult,
  GetTableRowsResult,
} from "eosjs/dist/eosjs-rpc-interfaces";
import { RpcError } from "eosjs";

export interface PublicAccount {
  name?: string;
  chain?: string;
  permission?: string;
  publicKeys?: Array<string>;
}

export interface RouteLocation {
  fullPath: string;
  path: string;
  query: { [k: string]: string | null | Array<string | null> };
  hash: string;
}

export interface PageIni extends RouteLocation {
  f: "ini";
  link: string;
  idToken: string;
  darkstyle: boolean;
}

export interface VerifyIdResult {
  f: "verifyIdResult";
  verified: boolean;
}

export interface PaymentResult {
  f: "payResult";
  id: string;
  result: false | PayParams;
  data: unknown;
}

export interface TransactionResult {
  f: "trxResult";
  id: string;
  success: boolean;
}

export interface GetFileResult {
  f: "getFileResult";
  id: string;
  file: File;
}

export interface EosioChainApiResult {
  f: "eosioChainApiResult";
  id: string;
  post:
    | "get_account"
    | "get_table_rows"
    | "get_table_by_scope"
    | "get_currency_balance"; // like "get_table_rows", see https://developers.eos.io/manuals/eos/v2.0/nodeos/plugins/chain_api_plugin/api-reference/index
  result: unknown;
}

export interface GetUserResult {
  f: "getUserResult";
  id: string;
  user: PublicAccount | undefined; // Return undefined if there is no user logged in
}

export interface BrowserAction {
  SavWeb:
    | PageIni
    | GetFileResult
    | VerifyIdResult
    | EosioChainApiResult
    | GetUserResult
    | TransactionResult;
}

export interface GoTo {
  f: "go";
  to: string; // URL of a file on blockchain
  target?: "_blank" | "_self" | null; // null if just the address should show different content after the domain
}

export interface GetFile {
  f: "getFile";
  id: string;
  get: string; // Link to a file
  idToken: string;
}

interface GetFile_idNull extends Omit<GetFile, "id"> {
  id: string | null;
}

export interface SavActPayment {
  time:
    | number
    | {
        // seconds since epoch (from midnight of January 1, 1970). Attention seconds are needed, date.getTime is in milliseconds
        min?: number;
        max?: number;
      };
}

export interface PayParams {
  chain: string; // Chain id or chain short name
  from?: string;
  to: string;
  pay: string; // Asset like "1.2300 EOS eosio.token"
  memo?: string;
  t?: string | number; // Absolute time stamp of the deadline in seconds
  dt?: string | number; // Relative time until the deadline in seconds
  index?: string; // Index of the RAM table entry
}

export interface Payment extends PayParams {
  f: "pay";
  id: string;
  idToken: string;
}

interface Payment_idNull extends Omit<Payment, "id"> {
  id: string | null;
}

export interface Transaction {
  f: "trx";
  id: string;
  chain?: string; // Chain id or chain short name
  actor?: string;
  contract: string;
  action: string;
  data: unknown;
  permission?: string;
  idToken: string;
}

export interface EosioChainApi {
  f: "eosioChainApi" | null;
  id: string;
  chain: string; // Chain id or chain short name
  post:
    | "get_account"
    | "get_table_rows"
    | "get_table_by_scope"
    | "get_currency_balance"; // like "get_table_rows", see https://developers.eos.io/manuals/eos/v2.0/nodeos/plugins/chain_api_plugin/api-reference/index
  params: unknown;
  idToken: string;
}

interface EosioChainApi_idNull extends Omit<EosioChainApi, "id"> {
  id: string | null;
}

interface Transaction_idNull extends Omit<Transaction, "id"> {
  id: string | null;
}

export interface VerifyId {
  f: "verifyId";
  idToken: string;
  alt?: string; // if idToken is not equal, then goto alt otherwise load the last requested html file
  recVersion?: number; // recommended version of the browser
}

export interface SetLocation {
  f: "setLocation";
  idToken: string;
  fullPath?: string;
  path?: string;
  query?: Query;
  hash?: string;
}

export interface OpenHistory {
  f: "openHistory";
  idToken: string;
  user?: string;
  to?: string;
  chain?: string;
}

export interface GetUser {
  f: "getUser";
  id: string;
  idToken: string;
  user?: PublicAccount; // Demand to connect to this user
}

interface GetUser_idNull extends Omit<GetUser, "id"> {
  id: string | null;
}

export type Query = { [k: string]: string | null | Array<string | null> };

export interface PageAction {
  SavWeb:
    | VerifyId
    | GoTo
    | Payment
    | Transaction
    | GetFile
    | EosioChainApi
    | SetLocation
    | OpenHistory
    | GetUser;
}

interface PageAction_idNull {
  SavWeb:
    | VerifyId
    | GoTo
    | Payment_idNull
    | Transaction_idNull
    | GetFile_idNull
    | EosioChainApi_idNull
    | GetUser_idNull;
}

export interface FullRpcError extends RpcError {
  json: {
    code: number;
    error: {
      code: number;
      details: Array<{
        file: string;
        line_number: number;
        message: string;
        method: string;
      }>;
    };
    message: string;
  };
}

export class SavWeb {
  idToken = "";
  requestResult: { [key: string]: unknown | null | undefined } = {};
  requestNumber = 0;
  connected: boolean = false;

  constructor(
    private onIni: (msg: PageIni) => void,
    public gotoPageError = "https://savact.app/#/_404_",
    public onMessageEvent?: (msg: any) => void
  ) {
    // It must be executed before the browser assigns the idToken.
    this.connect();
  }

  resolveEvent(event: any) {
    this.validatePostMessage(event);

    if (typeof this.onMessageEvent == "function") {
      this.onMessageEvent(event);
    }
  }
  connect() {
    if (!this.connected) {
      window.addEventListener(
        "message",
        (event) => {
          this.resolveEvent(event);
        },
        false
      );
    }
    this.connected = true;
  }
  disconnect() {
    window.removeEventListener("message", (event) => {
      this.resolveEvent(event);
    });
    this.connected = false;
  }

  /**
   * @param event The event of a post message
   */
  validatePostMessage(event: MessageEvent<any>) {
    if (event == undefined || event.data == undefined) {
      return;
    }
    if (event.data) {
      const data = event.data; // as {SavWeb: {idToken?: string, validToken?: boolean, f: string, post?: string, result?: unknown}}
      if (data.SavWeb) {
        const parentMsg = data.SavWeb;
        if (parentMsg.idToken != undefined && parentMsg.idToken != "") {
          this.idToken = parentMsg.idToken;
          console.log("SavWeb page got idToken", this.idToken);
        }
        if (typeof parentMsg.validToken == "boolean") {
          if (!parentMsg.validToken) {
            window.parent.postMessage(
              { SavWeb: { go: this.gotoPageError } },
              "*"
            );
          }
        }
        switch (parentMsg.f) {
          case "eosioChainApiResult":
            switch (parentMsg.post) {
              case "get_account":
                console.log("Result in SavWeb page:", parentMsg.result);
                const result = parentMsg.result;
                if (result == undefined) {
                  // Set to undefined
                  this.requestResult[parentMsg.id] = undefined;
                } else {
                  if (
                    "account_name" in result &&
                    result.account_name != undefined
                  ) {
                    this.requestResult[parentMsg.id] = true;
                  } else {
                    this.requestResult[parentMsg.id] = false;
                  }
                }
                break;
              default: // 'get_table_rows' // 'get_table_by_scope'
                // console.log('Result in SavWeb page:', parentMsg.result);
                const resultTable = parentMsg.result;
                if (resultTable === undefined) {
                  // Set to undefined for no result
                  this.requestResult[parentMsg.id] = undefined;
                } else {
                  this.requestResult[parentMsg.id] = resultTable;
                }
                break;
            }
            break;
          case "ini":
            if (typeof this.onIni == "function") {
              // console.log('is function');
              this.onIni(parentMsg);
            }
            break;
          case "payResult":
            const r = (parentMsg as PaymentResult).result;
            if (r) {
              this.requestResult[parentMsg.id] = r;
            } else {
              this.requestResult[parentMsg.id] = undefined;
            }
            break;
          case "getUserResult":
            const u = (parentMsg as GetUserResult).user;
            if (u) {
              this.requestResult[parentMsg.id] = u;
            } else {
              this.requestResult[parentMsg.id] = undefined;
            }
            break;
          case "trxResult":
            const t = (parentMsg as TransactionResult).success;
            if (t) {
              this.requestResult[parentMsg.id] = t;
            } else {
              this.requestResult[parentMsg.id] = undefined;
            }
            break;
        }
      }
    }
  }

  /**
   * Sleep for a defined amount of time
   * @param ms Milliseconds to sleep
   */
  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check a name if it exists
   * @param name EOSIO account name
   * @param maxWaitMs Maximum of milliseconds to wait
   * @returns true if the name exists, false if it does not exist and undefined on errors
   */
  async checkName(chain: string, name: string, maxWaitMs: number = 10000) {
    // Send request
    const result = (await this.request(
      {
        SavWeb: {
          f: "eosioChainApi",
          id: null,
          chain,
          post: "get_account",
          params: name,
          idToken: this.idToken,
        },
      },
      maxWaitMs
    )) as true | false | undefined | FullRpcError;

    return result;
  }

  async request(message: PageAction_idNull, maxWaitMs = 10000) {
    const requestId = this.requestNumber++; // Get new request id

    // Set request id if defined
    if (
      "SavWeb" in message &&
      "id" in message.SavWeb &&
      message.SavWeb.id == null
    ) {
      message.SavWeb.id = requestId.toString();
    }

    // Send request
    window.parent.postMessage(message, "*");
    this.requestResult[requestId] = null;

    // Wait for the result but only as long as defined by wait
    let timespan = 0;
    const interval = 100; // Check each 100 ms

    while (
      (maxWaitMs === 0 || timespan < maxWaitMs) &&
      requestId in this.requestResult &&
      this.requestResult[requestId] === null
    ) {
      await SavWeb.sleep(interval);
      timespan += interval;
    }

    // Return the result
    if (
      requestId in this.requestResult &&
      this.requestResult[requestId] !== null
    ) {
      const r = this.requestResult[requestId];
      this.requestResult[requestId] = undefined; // Clear the item
      return r;
    }

    // Clear the item
    this.requestResult[requestId] = undefined;
    return undefined;
  }

  /** Get the rows of a table
   * @param chain Chain Id or short name
   * @param code Contract account
   * @param table Table name
   * @param scope Scope name
   * @param entry Is a single number or an array. As array the first index describe the lower_bound and the second the upper_bound
   * @param json If true, then the result is parsed as json and otherwise as binary
   * @param lower_bound Lower bound of the table
   * @param upper_bound Upper bound of the table
   * @param index_position Index position
   * @param key_type Key type
   * @param limit Limit of entries in the result. Default is 10 and maximum is usually 200
   * @param reverse If true, then the entries in the result start by the last one
   * @param show_payer If true, then the RAM payer is shown in the result
   * @param maxWaitMs Maximum amount of time to wait until the request should be handled
   * @returns A single row if there is only one requested and an array of rows if there is an interval requested
   */
  async getTableRows(
    v: {
      chain: string;
      code: string;
      table: string;
      scope: string;
      entry?: number | string | Array<number | string>;

      json?: string | boolean;
      lower_bound?: string;
      upper_bound?: string;
      index_position?: string | number;
      key_type?: string;
      limit?: number;
      reverse?: boolean;
      show_payer?: boolean;
    },

    maxWaitMs = 10000
  ) {
    let lower_bound: undefined | string = v.lower_bound;
    let upper_bound: undefined | string = v.upper_bound;
    if (typeof v.entry == "object") {
      lower_bound = v.entry[0].toString();
      upper_bound = v.entry[1].toString();
    } else if (v.entry !== undefined) {
      lower_bound = v.entry.toString();
      upper_bound = lower_bound;
    }

    // Send request
    const result = (await this.request(
      {
        SavWeb: {
          f: "eosioChainApi",
          id: null, // With value null this parameter will be defined in request id
          chain: v.chain,
          post: "get_table_rows",
          params: {
            code: v.code,
            table: v.table,
            scope: v.scope,
            lower_bound,
            upper_bound,

            json: v.json,
            index_position: v.index_position,
            key_type: v.key_type,
            limit: v.limit,
            reverse: v.reverse,
            show_payer: v.show_payer,
          },
          idToken: this.idToken,
        },
      },
      maxWaitMs
    )) as GetTableRowsResult | FullRpcError | undefined;

    if (result == undefined) {
      console.error("Cannot get the table from", v.code);
      return undefined;
    }

    return result;
  }

  async getTableByScope(
    v: {
      chain: string;
      code: string;
      table?: string;
      lower_bound?: string;
      upper_bound?: string;
      limit?: number;
      reverse?: boolean;
      show_payer?: boolean;
    },
    maxWaitMs = 10000
  ) {
    // Send request
    const result = (await this.request(
      {
        SavWeb: {
          f: "eosioChainApi",
          id: null, // With value null this parameter will be defined in request id
          chain: v.chain,
          post: "get_table_by_scope",
          params: {
            code: v.code,
            table: v.table,
            lower_bound: v.lower_bound,
            upper_bound: v.upper_bound,
            limit: v.limit,
            reverse: v.reverse,
            show_payer: v.show_payer,
          },
          idToken: this.idToken,
        },
      },
      maxWaitMs
    )) as GetTableByScopeResult | FullRpcError | undefined;

    if (result == undefined) {
      console.error(`Cannot get the scopes from table ${v.table} of`, v.code);
      return undefined;
    }

    return result;
  }

  async getBalance(
    chain: string,
    contract: string,
    account: string,
    symbol: string,
    maxWaitMs: number = 10000
  ) {
    // Send request
    const result = (await this.request(
      {
        SavWeb: {
          f: "eosioChainApi",
          id: null, // With value null this parameter will be defined in request id
          chain,
          post: "get_currency_balance",
          params: {
            code: contract,
            account,
            symbol,
          },
          idToken: this.idToken,
        },
      },
      maxWaitMs
    )) as string[] | FullRpcError | undefined;

    if (typeof result === "object") {
      if ("error" in result) {
        return undefined;
      }
      return result;
    }

    return undefined;
  }

  async getUser(
    user: PublicAccount | undefined = undefined,
    maxWaitMs: number = 10000
  ) {
    // Send request
    const result = (await this.request(
      {
        SavWeb: {
          f: "getUser",
          id: null, // With value null this parameter will be defined in request id
          idToken: this.idToken,
          user,
        },
      },
      maxWaitMs
    )) as PublicAccount | undefined;

    console.log("result on page", result);

    if (typeof result === "object") {
      if ("error" in result) {
        return undefined;
      }
      return result;
    }

    return undefined;
  }

  static goTo(link: string, target?: string | null) {
    window.parent.postMessage(
      {
        SavWeb: {
          f: "go",
          to: link,
          target,
        },
      },
      "*"
    );
  }

  /**
   * Open the history of the SavAct app
   * @param chain
   * @param user
   * @param to
   */
  openHistory(v: { chain?: string; user?: string; to?: string }) {
    window.parent.postMessage(
      {
        SavWeb: {
          f: "openHistory",
          ...v,
          idToken: this.idToken,
        },
      },
      "*"
    );
  }

  /**
   * Verify the given idToken
   */
  verify() {
    window.parent.postMessage(
      {
        SavWeb: {
          f: "verifyId",
          idToken: this.idToken,
        },
      },
      "*"
    );
  }

  /**
   * Send a payment request
   * @param chain Blockchain of the payment
   * @param to Recipient
   * @param pay Asset as string
   * @param memo Memo as string
   * @param from Optional sender
   * @param maxWaitMs Maximum amount of time to wait until the request should be handled. Default is here 0 for endless
   */
  async payment(
    v: {
      chain: string;
      to: string;
      pay: string;
      memo: string;
      from?: string | undefined;
      t?: number;
      dt?: number;
      T?: string;
      DT?: string;
    },
    maxWaitMs: number = 0
  ) {
    // Send request
    const result = (await this.request(
      {
        SavWeb: {
          f: "pay",
          id: String(this.requestNumber),
          idToken: this.idToken,
          ...v,
        },
      },
      maxWaitMs
    )) as string[] | FullRpcError | undefined | PaymentResult;

    console.log("result on page", result);

    if (typeof result == "object") {
      if ("error" in result) {
        return undefined;
      }
      return result;
    }

    return undefined;
  }

  /**
   * Send a transaction request
   * @param chain Blockchain of the payment
   * @param to Recipient
   * @param pay Asset as string
   * @param memo Memo as string
   * @param from Optional sender
   * @param maxWaitMs Maximum amount of time to wait until the request should be handled. Default is here 0 for endless
   */
  async transaction(
    trxData: {
      chain: string;
      contract: string;
      action: string;
      data: unknown;
      actor?: string;
      permission?: string;
    },
    maxWaitMs: number = 0
  ) {
    console.log("Send request", trxData);

    // Send request
    const result = (await this.request(
      {
        SavWeb: {
          f: "trx",
          id: String(this.requestNumber),
          idToken: this.idToken,
          ...trxData,
        },
      },
      maxWaitMs
    )) as string[] | FullRpcError | undefined | TransactionResult;

    console.log("result on page", result);

    return result;
  }
}
