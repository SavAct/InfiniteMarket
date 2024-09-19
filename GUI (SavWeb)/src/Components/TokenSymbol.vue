<template>
  <q-chip
    square
    @click="click"
    clickable
    :class="$q.screen.gt.xs || !amount ? '' : 'q-px-sm'"
  >
    <span v-if="amount && symbol" :class="$q.screen.gt.xs ? 'text-h5' : ''"
      >{{ amount.toFixed(symbol.precision) }}&nbsp;</span
    >
    <span
      class="text-bold"
      :class="$q.screen.gt.xs || !amount ? 'text-h5' : ''"
      v-if="symbol"
      >{{ symbol.name }}</span
    >
    <div class="text-caption q-ml-sm" style="line-height: 100%">
      <div>
        of <span class="text-bold">{{ contract }}</span>
      </div>
      <div>
        on <span class="text-bold">{{ chain }}</span>
      </div>
    </div>
  </q-chip>
</template>
<script lang="ts">
import { AssetSymbol } from "./AntelopeHelpers";
import type { PropType } from "vue";
export default Vue.defineComponent({
  name: "tokenSymbol",
  props: {
    symbol: {
      type: Object as PropType<AssetSymbol>,
      required: true,
    },
    contract: {
      type: String,
      required: true,
    },
    chain: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: undefined,
      required: false,
    },
  },
  emits: ["click"],
  setup(_, context) {
    function click(v: any) {
      context.emit("click", v);
    }
    return { click };
  },
});
</script>
