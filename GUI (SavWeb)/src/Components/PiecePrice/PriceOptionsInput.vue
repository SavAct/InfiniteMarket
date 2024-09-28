<template>
  <div class="row justify-between">
    <piece-price-input
      class="q-mb-sm"
      v-for="(entry, index) in pp"
      :key="index"
      v-model="entry.value"
      @remove="pp.splice(index, 1)"
      :rm-btn="pp.length != 1"
      :from="!isFixed"
    />
    <q-btn
      class="col-12 q-mt-sm"
      size="sm"
      dense
      rounded
      color="primary"
      label="Add quantity discount"
      @click="addPriceWithUnit"
    >
    </q-btn>
  </div>
  <div class="row q-gutter-sm q-pt-md">
    <div class="col-grow row q-pt-sm">
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
    </div>
    <div
      v-if="!isFixed"
      class="col-auto row justify-between"
    >
      <q-checkbox
        class="col-auto"
        :label="isMaxPcs?'':'Maximum quantity'"
        v-model="isMaxPcs"
      ></q-checkbox>
      <q-input
        v-if="isMaxPcs && !isFixed"
        label="Max quantity"
        class="col-auto"
        dense
        v-model="maxPcs"
        type="number"
        min="1"
        outlined
      />
    </div>
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

    enum QuantityOption {
      Variable = 0,
      Fixed = 1,
    }

    const options = [
      { label: "Variable quantities", value: QuantityOption.Variable },
      { label: "Fixed quantities", value: QuantityOption.Fixed },
    ];

    const option = Vue.ref<QuantityOption>(QuantityOption.Variable);

    const isFixed = Vue.computed(() => {
      return option.value === QuantityOption.Fixed;
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
        // if (option.value !== PriceOption.One && pp.value.length === 1) {
        //   addPriceWithUnit();
        // }
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
            message: "Invalid max quantity number",
            caption: `Max quantity number per order is lower than defined in price options. Now, it was set to ${max}.`,
            color: "warning",
            position: "top",
          });
        }
      }

      newValue = pp.value.map((v) => {
        return { p: v.value.p, pcs: Math.round(Number(v.value.pcs) * 100) / 100 };
      });

      // { p: price, pcs: min pieces } // Only one price for arbitrary quantity
      // { p: price, pcs: min pieces } ... { p: price, pcs: pieces } // Variable price levels depending on arbitrary quantity
      // { p: max pieces, pcs: 0 }{ p: price, pcs: min pieces } // Only one price for arbitrary quantity with a maximum quantity
      // { p: max pieces, pcs: 0 }{ p: price, pcs: min pieces } .. { p: price, pcs: pieces } // Variable price levels depending on arbitrary quantity with a maximum quantity
      // { p: 0, pcs: 0 }{ p: price, pcs: pieces } // Only one price and one quantity
      // { p: 0, pcs: 0 }{ p: price, pcs: pieces } ... { p: price, pcs: pieces } // Only discrete quantity options

      switch (option.value) {
        case QuantityOption.Fixed:
          if(pp.value.length > 0){
            newValue.unshift({ p: 0, pcs: 0 });
          } else {
            newValue = [{ p: 0, pcs: 0 }, { p: 0, pcs: 1 }]
          }
          break;
        case QuantityOption.Variable:
          if (isMaxPcs.value && maxPcs.value > 1) {
            if (pp.value.length === 1 && pp.value[0].value.pcs == maxPcs.value) {
              newValue.unshift({ p: 0, pcs: 0 });
            } else {
              newValue.unshift({ p: maxPcs.value, pcs: 0 });
            }
          }
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

        switch (mVOptions.priceOption) {
          case PriceOption.One:
          case PriceOption.Predefined:
            option.value = QuantityOption.Fixed;
            break;
          case PriceOption.Multiple:
            option.value = QuantityOption.Variable;
            break;
        }
        isMaxPcs.value = mVOptions.maxPieces !== undefined;
        maxPcs.value = mVOptions.maxPieces ? mVOptions.maxPieces : 2;
      },
      { deep: true, immediate: true }
    );

    return {
      addPriceWithUnit,
      options,
      option,
      isFixed,
      pp,
      darkStyle: state.darkStyle,
      isMaxPcs,
      maxPcs,
    };
  },
});
</script>
