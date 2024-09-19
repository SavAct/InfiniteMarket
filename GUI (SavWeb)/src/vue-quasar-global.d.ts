import type _vue from "vue";
import type * as _quasar from "quasar";
import type  _appUseQuasar from "quasar";
import type { ecc as _ecc } from "eosjs/dist/eosjs-ecc-migration";
import type * as _openpgp from "openpgp";
import type * as _addressFormater from "@fragaria/address-formatter";
// import _xxhash from "xxhash-wasm";

// Define just the types of the components
declare global {
  interface Window {
    addressFormatter: typeof _addressFormater;
  }
  const Vue: typeof _vue;
  const Quasar: typeof _quasar;
  type AppUseQuasar = typeof _appUseQuasar;
  const eosjs_ecc = _ecc;
  const openpgp = _openpgp;
  // const xxhash = _xxhash;
}
