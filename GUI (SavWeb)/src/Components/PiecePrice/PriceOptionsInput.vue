<template>
  <div class="q-mb-sm row q-gutter-sm">
    <div class="col-auto">
      <q-btn-toggle
        :class="darkStyle ? 'bg-grey-9 text-white' : 'bg-grey-3 text-black'"
        v-model="option"
        toggle-color="primary"
        :options="options"
        size="sm"
        no-caps
      />
    </div>
    <div class="col-grow">pieces option per order.</div>
    <q-icon size="sm" v-if="$q.screen.lt.sm" name="info" class="col-auto">
      <q-tooltip>{{ optionDescription }}</q-tooltip>
    </q-icon>
    <div v-else class="col-auto">{{ optionDescription }}</div>
  </div>
  <div v-if="!isOnlyOne" class="row justify-between">
    <piece-price-input
      class="q-mb-sm"
      v-for="(entry, index) in pp"
      :key="index"
      v-model="entry.value"
      @remove="pp.splice(index, 1)"
      :rm-btn="pp.length != 1"
      :from="isMultiple"
    />
    <q-btn
      v-if="!isOnlyOne"
      class="col-12 q-mt-sm"
      size="sm"
      dense
      rounded
      color="primary"
      label="Add quantity discount"
      @click="addPriceWithUnit"
    >
    </q-btn>
    <div
      v-if="isMultiple"
      class="col-12 row q-mt-md justify-between q-gutter-sm"
    >
      <q-checkbox
        class="col-grow"
        label="Maximum pieces number per order"
        v-model="isMaxPcs"
      ></q-checkbox>
      <q-input
        v-if="isMaxPcs"
        label="Max pieces"
        class="col-auto"
        dense
        v-model="maxPcs"
        type="number"
        min="1"
        outlined
      />
    </div>
  </div>
  <div v-else class="q-mb-sm">
    <piece-price-input v-model="pp[0].value" :rm-btn="false" />
  </div>
</template>
<script lang="ts">
import type { PropType, Ref } from "vue";
import { PiecesPrice } from "../ContractInterfaces";
import PiecePriceInput from "./PiecePriceInput.vue";
import { state } from "../../store/globals";
import {
  GetParamsFromTablePricePiece,
  PriceOption,
} from "./ContractTablePriceOption";

export default Vue.defineComponent({
  name: "priceOptionsInput",
  props: {
    modelValue: {
      type: Object as PropType<Array<PiecesPrice>>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  components: {
    PiecePriceInput,
  },
  setup(props, context) {
    const pp = Vue.ref<Array<Ref<{ p: number; pcs: number }>>>([
      Vue.ref({ p: 0, pcs: 1 }),
    ]);

    const options = [
      { label: "One", value: PriceOption.One },
      { label: "Multiple ", value: PriceOption.Multiple },
      { label: "Only predefined", value: PriceOption.Predefined },
    ];

    const option = Vue.ref<PriceOption>(PriceOption.One);

    const isOnlyOne = Vue.computed(() => {
      return option.value === PriceOption.One;
    });

    const isMultiple = Vue.computed(() => {
      return option.value === PriceOption.Multiple;
    });

    const isMaxPcs = Vue.ref<boolean>(false);
    const maxPcs = Vue.ref<number>(2);
    const debounceUpdate = Quasar.debounce(update, 500);
    Vue.watch(
      () => isMaxPcs.value,
      () => {
        if (isMaxPcs.value) {
          // Find biggest pcs number
          const max = getMaxPcsFromOptions();
          maxPcs.value = max > 1 && maxPcs.value < max ? max : maxPcs.value;
        }
        
        debounceUpdate();
      }
    );

    Vue.watch(
      () => pp.value,
      () => {
        debounceUpdate();
      },
      { deep: true }
    );

    Vue.watch(
      () => option.value,
      () => {
        if (option.value !== PriceOption.One && pp.value.length === 1) {
          addPriceWithUnit();
        }
        debounceUpdate();
      }
    );

    Vue.watch(
      () => maxPcs.value,
      () => {
        debounceUpdate();
      }
    );

    function getMaxPcsFromOptions() {
      return Math.max(
        ...pp.value.map((v) => {
          return v.value.pcs;
        })
      );
    }

    let newValue: Array<PiecesPrice> = [];

    function update() {
      if (isMaxPcs.value) {
        const max = getMaxPcsFromOptions();
        if (maxPcs.value < max) {
          maxPcs.value = max;
          Quasar.Notify.create({
            message: "Invalid max pieces number",
            caption: `Max pieces number per order is lower than defined in price options. Now, it was set to ${max}.`,
            color: "warning",
            position: "top",
          });
        }
      }

      newValue = pp.value.map((v) => {
        return { p: v.value.p, pcs: v.value.pcs };
      });

      switch (option.value) {
        case PriceOption.One:
          // No several pieces option purchasable if array has only two options (price = 0 by pcs = 0 ) and the actual price piece option
          newValue =
            pp.value.length > 0
              ? [
                  { p: 0, pcs: 0 },
                  { p: pp.value[0].value.p, pcs: pp.value[0].value.pcs },
                ]
              : [
                  { p: 0, pcs: 0 },
                  { p: 0, pcs: 1 },
                ];
          break;
        case PriceOption.Multiple:
          // If a maximum of pcs is defined, the pcs field will be set to 0 and the max pieces number will be stored in the price field
          if (isMaxPcs.value && maxPcs.value > 1) {
            newValue.unshift({ p: maxPcs.value, pcs: 0 });
          }
          break;
        case PriceOption.Predefined:
          // Only predefined piece numbers purchasable if array starts by (price = 0 by pcs = 0 )
          newValue.unshift({ p: 0, pcs: 0 });
          break;
      }
      context.emit("update:modelValue", newValue);
    }

    function addPriceWithUnit() {
      const lastEntry = pp.value.length - 1;
      const numPcs = Number(pp.value[lastEntry].value.pcs);
      const priceBefore =
        isNaN(numPcs) || numPcs <= 0
          ? 1
          : Number(pp.value[lastEntry].value.pcs);
      const pieces = priceBefore + 1;
      const price = (pp.value[lastEntry].value.p * pieces) / priceBefore;
      pp.value.push(Vue.ref({ p: price, pcs: pieces }));
    }

    const optionDescription = Vue.computed(() => {
      switch (option.value) {
        case PriceOption.One:
          return "(Only one piece option per order is purchasable)";
        case PriceOption.Multiple:
          return "(Multiple pieces per order are purchasable)";
        case PriceOption.Predefined:
          return "(Only predefined piece numbers are purchasable)";
      }
    });

    Vue.watch(
      () => props.modelValue,
      () => {
        if (JSON.stringify(newValue) == JSON.stringify(props.modelValue)) {
          return;
        }
        const mVOptions = GetParamsFromTablePricePiece(props.modelValue);
        pp.value =
          mVOptions.piecePrices.length > 0
            ? mVOptions.piecePrices.map((v) => {
                return Vue.ref({ p: Number(v.p), pcs: Number(v.pcs) });
              })
            : [Vue.ref({ p: 0, pcs: 1 })];

        option.value = mVOptions.priceOption
          ? mVOptions.priceOption
          : PriceOption.One;
        isMaxPcs.value = mVOptions.maxPieces !== undefined;
        maxPcs.value = mVOptions.maxPieces ? mVOptions.maxPieces : 2;
      },
      { deep: true, immediate: true }
    );

    return {
      addPriceWithUnit,
      options,
      option,
      isOnlyOne,
      isMultiple,
      pp,
      darkStyle: state.darkStyle,
      optionDescription,
      isMaxPcs,
      maxPcs,
    };
  },
});
</script>
