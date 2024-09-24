import type { Component } from "vue";
import home from "../pages/IndexPage.vue";
import ads from "../pages/AdsPage.vue";
import item from "../pages/ItemPage.vue";
import user from "../pages/UserPage.vue";
import buy from "../pages/BuyPage.vue";
import sellResponse from "../pages/SellResponsePage.vue";
import uploadPage from "../pages/UploadPage.vue";
import { state } from "../store/globals";

/**
 * Here you can add more pages
 */
export const routes: Array<{
  name: string;
  component: Component;
  title?: string;
  color?: string;
}> = [
  { name: "home", component: home, title: state.gui.title, color: "teal-6" },
  {
    name: "item",
    component: item,
    title: "Item",
    color: "light-green-13",
  },
  {
    name: "ads",
    component: ads,
    title: "Buy Ads",
    color: "orange-13",
  },
  {
    name: "user",
    component: user,
    title: "Account",
    color: "orange-13",
  },
  {
    name: "buy",
    component: buy,
    title: "Buy",
    color: "orange-13",
  },
  {
    name: "response",
    component: sellResponse,
    title: "Message Center",
    color: "blue-12",
  },
  {
    name: "upload",
    component: uploadPage,
    title: "Upload new item",
    color: "red-12",
  },
];
