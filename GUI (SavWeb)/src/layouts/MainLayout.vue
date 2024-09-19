<template>
  <q-layout view="hHh Lpr lff" id="immortal-shop">
    <q-header
      bordered
      :class="darkStyle ? 'bg-dark' : 'bg-grey-10'"
      ref="mainHeader"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="menuClick"
        />
        <q-btn
          :disable="!canBack"
          flat
          round
          dense
          class="q-ml-sm"
          icon="arrow_back_ios_new"
          aria-label="Back"
          @click="goBack"
        />
        <q-btn
          :disable="!canForward"
          flat
          round
          dense
          class="q-ml-sm"
          icon="arrow_forward_ios"
          aria-label="Forward"
          @click="goForward"
        />
        <q-toolbar-title :class="{ 'text-subtitle1': $q.screen.lt.sm }">
          <span>{{ route.title }}</span>
        </q-toolbar-title>
        <q-btn
          :icon="darkStyle ? 'dark_mode' : 'wb_sunny'"
          round
          @click="darkStyle = !darkStyle"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniDrawer"
      @mouseover="miniDrawer = false"
      @mouseout="miniDrawer = true"
      :width="200"
      :breakpoint="500"
      bordered
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0' }">
        <q-list padding>
          <menu-route-item
            route-name="home"
            icon="home"
            text="Items"
          ></menu-route-item>
          <menu-route-item
            route-name="user"
            icon="person"
            text="Profile"
          ></menu-route-item>
          <menu-route-item
            route-name="upload"
            icon="storefront"
            text="Sell"
          ></menu-route-item>
          <q-separator />
          <menu-route-item
            route-name="response"
            icon="drafts"
            text="Message"
          ></menu-route-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container v-if="!savConnected">
      <div class="q-ma-md justify-center">
        This page needs to be executed in the SavAct App.<br />
        You can just drag this file into the address bar of the
        <a
          href="https://savact.app#_browser_"
          target="_blank"
          :class="{ 'text-blue': darkStyle }"
          >SavAct browser</a
        >.
      </div>
    </q-page-container>
    <page-container></page-container>
    <!-- <q-footer
      elevated
      :class="darkStyle ? 'bg-dark' : 'bg-indigo-10'"
      class="text-white"
      ref="mainFooter"
    >
      <q-tabs
        class="fit text-white"
        :indicator-color="route.color"
        :active-color="route.color"
        switch-indicator
        :model-value="route.name"
      >
        <q-route-tab
          @click="to('home')"
          name="home"
          icon="home"
          class="col-2"
        />
        <q-route-tab
          @click="to('user')"
          name="user"
          icon="person"
          class="col-2"
        />
        <q-route-tab
          @click="to('response')"
          name="response"
          icon="storefront"
          class="col-2"
        />
      </q-tabs>
    </q-footer> -->
  </q-layout>
</template>
<script lang="ts">
import MenuRouteItem from "../Components/MenuRouteItem.vue";
import PageContainer from "../router/PageContainer";
import { state } from "../store/globals";
import { route, router } from "../router/simpleRouter";
import { routes } from "../router/routes";
import { savConnected } from "../store/connect";
import { SavWeb } from "../Components/SavWeb";

export default Vue.defineComponent({
  name: "MainLayout",
  components: { MenuRouteItem, PageContainer },
  setup() {
    const leftDrawerOpen = Vue.ref<boolean>(false);
    const miniDrawer = Vue.ref<boolean>(true);

    const darkStyle = state.darkStyle;
    darkStyle.value = true;

    // Show each route change of this page in the SavWeb browser
    router.afterEach((to, from) => {
      if (from && to && to.name !== from.name) {
        // Query to URL string
        const queryKeys = to.query ? Object.keys(to.query) : undefined;
        const queryStr =
          queryKeys && queryKeys.length > 0
            ? "?" +
              queryKeys
                .filter((key) => {
                  // filter all object values
                  let value = (to.query as { [key: string]: Object })[key];
                  if (typeof value === "object") {
                    return false;
                  }
                  return true;
                })
                .map((key) => {
                  let value = (to.query as { [key: string]: Object })[key];
                  return key + "=" + String(value);
                })
                .join("&")
            : "";
        SavWeb.goTo("/" + to.name + queryStr, null);
        return;
      }
    });

    function goBack() {
      if (!router.back()) {
        Quasar.Notify.create({
          type: "negative",
          message: "You are already at the first visited page",
          position: "top",
        });
      }
    }

    function goForward() {
      if (!router.forward()) {
        Quasar.Notify.create({
          type: "negative",
          message: "You are already at the last visited page",
          position: "top",
        });
      }
    }

    const mainHeader = Vue.computed({
      get: () => state.mainHeaderRef.value,
      set: (value) => (state.mainHeaderRef.value = value),
    });

    function menuClick() {
      if (leftDrawerOpen.value) {
        if (!miniDrawer.value) {
          miniDrawer.value = true;
          return;
        }
        leftDrawerOpen.value = false;
        miniDrawer.value = false;
        return;
      }
      leftDrawerOpen.value = true;
    }



    return {
      canBack: router.canBack,
      canForward: router.canForward,
      leftDrawerOpen,
      miniDrawer,
      route,
      routes,
      darkStyle,
      goBack,
      goForward,
      to: router.push,
      mainHeader,
      menuClick,
      savConnected,
    };
  },
});
</script>
