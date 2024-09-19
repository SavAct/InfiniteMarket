<template>
  <q-page class="column">
    <div class="col q-pa-md text-center">
      <div class="q-my-md">Buy ads places</div>
      <div class="q-mt-lg">Presented by SavAct.</div>
    </div>
    <div class="col-auto">Your bid</div>
  </q-page>
</template>
<script lang="ts">
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "indexPage",
  setup() {
    return { darkStyle: state.darkStyle };
  },
});
</script>
