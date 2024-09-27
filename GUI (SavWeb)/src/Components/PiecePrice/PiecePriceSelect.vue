<template>
  <div v-show="!chip" class="row q-col-gutter-sm">
    <q-input
      class="col-auto"
      v-if="!isFixAmount"
      label="Pieces"
      type="number"
      v-model="sPieces"
      outlined
      dense
      :min="minPieces"
      step="1"
      :disable="disabled"
      :size="size"
    ></q-input>
    <q-select
      class="col-grow"
      v-model="selected"
      outlined
      dense
      :options="selectOptions"
      :disable="selectOptions.length <= 1 || disabled"
      :size="size"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ ppLineHeader(scope.opt.value) }}</q-item-label>
            <q-item-label caption>
              <span>{{ ppLine(scope.opt.value) }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
  <q-chip
    class="q-mr-none"
    v-if="chip"
    :color="chipBgColor()"
    :label="chipText"
    :size="size"
  ></q-chip>
</template>
<script lang="ts">
import type { PropType } from "vue";
import { PiecesPrice } from "../ContractInterfaces";
import {
  GetParamsFromTablePricePiece,
  PriceOption,
} from "./ContractTablePriceOption";
import { chipBgColor } from "../styleHelper";

export default Vue.defineComponent({
  name: "piecePriceSelect",
  props: {
    modelValue: {
      type: Object as PropType<PiecesPrice | undefined>,
      required: true,
    },
    pps: {
      type: Object as PropType<Array<PiecesPrice>>,
      required: true,
    },
    pieces: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    chip: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "update:pieces"],
  setup(props, context) {
    const options = Vue.ref(GetParamsFromTablePricePiece(props.pps));

    const sPieces = Vue.ref<number>(props.pieces);

    const pricePiece = Vue.computed({
      get: () => {
        return props.modelValue;
      },
      set: (value) => {
        context.emit("update:modelValue", value);
      },
    });

    const selected = Vue.computed({
      get: () => {
        if (pricePiece.value === undefined) return;
        return {
          value: pricePiece.value,
          label: ppLine(pricePiece.value, true),
        };
      },
      set: (v) => {
        pricePiece.value = v?.value;
      },
    });

    const minPieces = Vue.computed(() => {
      // Get min pieces from piece prices
      if (options.value.piecePrices.length > 0) {
        const min = options.value.piecePrices.reduce(
          (min, current) =>
            Number(current.pcs) < min ? Number(current.pcs) : min,
          Number(options.value.piecePrices[0].pcs)
        );
        return min;
      }
      return 1;
    });

    const isFixAmount = Vue.computed(
      () =>
        options.value.priceOption === PriceOption.One ||
        options.value.priceOption === PriceOption.Predefined
    );

    const selectOptions = Vue.computed(() =>
      options.value.piecePrices.map((opt) => ({
        value: opt,
        label: ppLine(opt),
      }))
    );

    Vue.watch(
      () => pricePiece.value,
      (v) => {
        if (v?.pcs !== undefined) {
          sPieces.value = v.pcs;
        }
      }
    );

    Vue.watch(
      () => sPieces.value,
      (v) => {
        if (
          options.value.maxPieces !== undefined &&
          v > options.value.maxPieces
        ) {
          sPieces.value = options.value.maxPieces;
          return;
        }

        if (
          v > 0 &&
          pricePiece.value?.pcs !== undefined &&
          options.value.priceOption === PriceOption.Multiple
        ) {
          let fromPp: undefined | PiecesPrice = undefined;
          for (const pp of options.value.piecePrices) {
            if (
              Number(pp.pcs) <= Number(v) &&
              (fromPp === undefined || Number(pp.pcs) > Number(fromPp.pcs))
            ) {
              fromPp = pp;
            }
          }
          if (fromPp !== undefined && (pricePiece.value.p != fromPp.p || pricePiece.value.pcs != fromPp.pcs)) {
            pricePiece.value = fromPp;
            Vue.nextTick(() => {
              sPieces.value = v;
            });
          }
        }
        if (sPieces.value < minPieces.value) {
          sPieces.value = minPieces.value;
        }
        context.emit("update:pieces", sPieces.value);
      },
      { immediate: true }
    );

    if (props.modelValue !== undefined) {
      // Find and select the lowest price option
      if (options.value.piecePrices && options.value.piecePrices.length > 0) {
        pricePiece.value = options.value.piecePrices.reduce(
          (min, current) => (current.p < min.p ? current : min),
          options.value.piecePrices[0]
        );
      }
    }

    function ppLineHeader(opt: PiecesPrice) {
      return ((Number(opt.p) / 100) / opt.pcs).toFixed(2) + " $/piece";
    }
    function ppLine(opt: PiecesPrice, selectedView = false) {
      if (options.value.priceOption === PriceOption.One) {
        return `${Number(opt.p) / 100} $`;
      }
      if (selectedView && options.value.priceOption === PriceOption.Multiple) {
        return ppLineHeader(opt);
      }
      return `${isFixAmount.value ? "" : "From up of "}${opt.pcs} ${opt.pcs == 1 ? "piece" : "pieces"} for ${((Number(opt.p) / 100) / opt.pcs).toFixed(2)} $/pcs`;
    }

    Vue.onMounted(() => {
      if (props.pieces) {
        sPieces.value = props.pieces;
      }
    });

    const chipText = Vue.computed(() => {
      const p = selected.value?.value.p
        ? " for " +
          (((Number(selected.value.value.p) / 100) * sPieces.value) / selected.value.value.pcs).toFixed(2) +
          " USD"
        : "";
      return (sPieces.value == 1 ? "1 piece" : sPieces.value + " pieces") + p;
    });

    return {
      selected,
      selectOptions,
      ppLineHeader,
      ppLine,
      isFixAmount,
      sPieces,
      minPieces,
      chipBgColor,
      chipText,
    };
  },
});
</script>
