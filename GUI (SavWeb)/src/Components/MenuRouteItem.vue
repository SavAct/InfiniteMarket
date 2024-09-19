<template>
  <q-item
    :active="route.name == routeName"
    :active-class="
      route.name == routeName
        ? 'text-' + routes.find((v) => v.name === routeName)?.color
        : ''
    "
    clickable
    v-ripple
    @click="to(routeName)"
  >
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section> {{ text }} </q-item-section>
  </q-item>
</template>
<script lang="ts">
import { routes } from "../router/routes";
import { route, router } from "../router/simpleRouter";

export default Vue.defineComponent({
  name: "menuRouteItem",
  props: {
    routeName: {
      type: String,
      required: true,
      default: "",
    },
    icon: {
      type: String,
      required: false,
      default: "",
    },
    text: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup() {
    return { to: router.push, route, routes };
  },
});
</script>
