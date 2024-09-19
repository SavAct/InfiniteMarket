import { route } from "../router/simpleRouter";
import { OrderMsg } from "./Generator";

export function GetQueryIdAndCategory() {
  if (route.query) {
    const orderMsg = route.query as OrderMsg;
    const itemItr = 'item' in orderMsg ? orderMsg.item : route.query;
    const id =
      "id" in itemItr &&
      (typeof itemItr.id == "number" || typeof itemItr.id == "string")
        ? Number(itemItr.id)
        : -1;
    const category =
      "category" in itemItr &&
      (typeof itemItr.category == "number" ||
        typeof itemItr.category == "string" ||
        typeof itemItr.category == "bigint")
        ? BigInt(itemItr.category)
        : 0n;
    return { id, category };
  }
  return undefined;
}

export function GetCategory() {
  if (route.query) {
    const category =
      "category" in route.query &&
      (typeof route.query.category == "number" ||
        typeof route.query.category == "string" ||
        typeof route.query.category == "bigint")
        ? BigInt(route.query.category)
        : 0n;
    return { category };
  }
  return undefined;
}

export function GetQueryOrderRequest() {
  try{
    const strJson = JSON.stringify(route.query, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
    const orderMsg = JSON.parse(strJson) as OrderMsg;

    // if the id and category are in the root of the query put them in the item object    
    if('id' in orderMsg && 'category' in orderMsg && (typeof orderMsg.category === 'number' || typeof orderMsg.category === 'string')){
      orderMsg.item = { id: Number(orderMsg.id), category: orderMsg.category }
    }
    
    return { ...orderMsg};
  } catch (e) {
    console.log('Error while parsing query',e);
    return undefined;
  }
}

export enum ItemPageMode {
  Standard = 0,
  Preview = 1, // Preview the item with inconsistent data
  Wait = 2, // Wait for the item to be created in RAM table
}

export function GetQueryMode() {
  if (
    route.query &&
    "mode" in route.query &&
    (route.query.mode === ItemPageMode.Preview ||
      route.query.mode === ItemPageMode.Wait)
  ) {
    return route.query.mode as ItemPageMode;
  }
  return ItemPageMode.Standard;
}

export function HasQueryRequest() {
  if (route.query && "request" in route.query)
    return route.query.request == true;
  return false;
}

export function HasQueryUserName() {
  if (route.query && "user" in route.query) return String(route.query.user);
  return false;
}
