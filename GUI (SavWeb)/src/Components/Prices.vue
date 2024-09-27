<template>
<div class="row justify-between q-col-gutter-x-sm q-mt-sm">
  <div v-if="priceStr !== undefined" class="col-auto">
    Price:
    <q-chip
      :color="chipBgColor()"
      :label="priceStr"
    ></q-chip>
  </div>
  <div v-if="shipPriceAndDurStr !== undefined" class="col-auto">
    Shipping:
    <q-chip
      :color="chipBgColor()"
      :label="shipPriceAndDurStr"
    ></q-chip>
  </div>
  <div v-if="totalPriceStr !== undefined" class="col-auto">
    Total price:
    <q-chip
      :color="chipBgColor()"
      :label="totalPriceStr"
    ></q-chip>
    <q-chip
      v-if="token"
      :color="chipBgColor()"
      :label="totalTokenStr"
    >
    </q-chip>
  </div>
</div>
</template>
<script lang="ts">
import { PropType } from "vue";
import { chipBgColor } from "./styleHelper";
import { Asset, AssetToString, Token } from "./AntelopeHelpers";
import { getCurrentTokenPrice } from "./ConvertPrices";
import { getInitialDuration, getRoundedDuration } from "./GeneralJSHelper";

export default Vue.defineComponent({
  name: "prices",
  emits: ["totalPrice"],
  props: {
    token: {
      type: Object as PropType<{value: Token; label: string}>,
      required: true,
      default: undefined,
    },
    shipToPrice: {
      type: Object as PropType<{ t: number; p: number }>,
      required: false,
      default: true,
    },
    prepTime: {
      type: Number,
      required: true,
      default: 0,
    },
    piecesPrice: {
      type: Object as PropType<{ p: number; pcs: number }>,
      required: true,
      default: { p: 0, pcs: 1 },
    },
    pieces: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  setup(props, context) {
   
    const shipDuration = Vue.computed(() => {
      if (props.shipToPrice !== undefined) {
        return Number(props.shipToPrice.t) + Number(props.prepTime)
      }
      return undefined;
    });

    const shipPrice = Vue.computed(() => {
      if (props.shipToPrice !== undefined && props.shipToPrice.p !== undefined) {
        const p = Number(props.shipToPrice.p);
        if (!Number.isNaN(p)) {
          return p;
        }
      }
      return undefined;
    });

    const totalPrice = Vue.computed(() => {
      if (shipPrice.value !== undefined && price.value !== undefined) {
        const p = shipPrice.value + price.value;
        setTotalToken(p);
        context.emit("totalPrice", p);
        return p;
      }
      totalToken.value = undefined;
      return undefined;
    });

    const totalToken = Vue.ref<Asset | undefined>();
    async function setTotalToken(price: number) {
      if (price !== undefined && !Number.isNaN(price) && props.token !== undefined) {
        totalToken.value = await getCurrentTokenPrice(
          price / 100,
          props.token.value
        );
      } else {
        totalToken.value = undefined;
      }
    }

    const totalTokenStr = Vue.computed(() => {
      if (totalToken.value) {
        return "~ " + AssetToString(totalToken.value);
      }
      return undefined;
    });

    const price = Vue.computed(() => {
      return (props.piecesPrice.p * props.pieces) / props.piecesPrice.pcs;
    });

    const priceStr = Vue.computed(() => {
      if(price.value !== undefined && !Number.isNaN(price.value)) {
        return (price.value / 100).toFixed(2) + " USD";
      } else {
        return undefined;
      }
    });

    const totalPriceStr = Vue.computed(() => {
      if (totalPrice.value !== undefined && !Number.isNaN(totalPrice.value)) {
        return (totalPrice.value / 100).toFixed(2) + " USD";
      }
      return undefined;
    });

    const shipPriceAndDurStr = Vue.computed(() => {
      if (shipPrice.value !== undefined && shipDuration.value !== undefined && !Number.isNaN(shipDuration.value)) {

        // Use exact duration if value is less than 1000 time units otherwise round to 4 digits
        const msT = shipDuration.value * 1000;
        let dur = getInitialDuration(msT);
        if (dur !== undefined && dur.n > 1000) {
          dur = getRoundedDuration(msT, 4);
        }

        return (`Within ${dur.n} ${dur.unit} for ${(shipPrice.value / 100).toFixed(2)} USD`);
      }
      return undefined;
    });

    return {
      chipBgColor,
      shipDuration,
      totalPriceStr,
      shipPriceAndDurStr,
      totalTokenStr,
      priceStr
    };
  },
});
</script>
