import { PageIni, SavWeb } from "../Components/SavWeb";
import { router } from "../router/simpleRouter";
import { state } from "./globals";

function resolvePage(pIni: PageIni) {
  let pageName: string;
  const paths = (
    pIni.path.length > 0 && pIni.path[0] === "/"
      ? pIni.path.substring(1)
      : pIni.path
  ).split("/");
  if (paths === undefined || paths.length === 1) {
    pageName = paths[0];
  } else {
    state.contract.account = paths[0]; // Change contract account if path has more than one "folder"
    pageName = paths[1];
    console.log("Use contract account:", state.contract.account);
  }

  console.log("resolvePage", pageName, "query", pIni.query);

  router.push({
    name: pageName.length > 0 ? pageName : state.defaultValue.startPage.name,
    query:
      Object.keys(pIni.query).length > 0
        ? pIni.query
        : state.defaultValue.startPage.query
          ? state.defaultValue.startPage.query
          : undefined,
  });
}

// SavWeb interface
const savConnected = Vue.ref<boolean>(false);
function onIni(msg: PageIni) {
  if (typeof msg.darkstyle == "boolean") {
    state.darkStyle.value = msg.darkstyle;
  }
  savConnected.value = true;
  resolvePage(msg);

  console.log("PageIni", msg);
}

const savWeb = new SavWeb(onIni);

// Export
export { savWeb, savConnected };
