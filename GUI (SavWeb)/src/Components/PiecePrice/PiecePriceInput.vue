<template>
  <div class="row full-width">
    <div class="col-3 q-pr-sm">
      <q-input
        label="Quantity"
        v-model="pieces"
        type="number"
        min="1"
        outlined
      />
    </div>
    <q-input
      class="col-9"
      :label="priceInputLabel"
      v-model="price"
      type="number"
      min="0"
      outlined
      :hint="
        (price / pieces).toFixed(2) + ' USD per article'
      "
      bottom-slots
    >
      <template v-slot:append>USD</template>
      <template v-slot:after v-if="rmBtn">
        <q-btn
          size="sm"
          dense
          icon="clear"
          color="red"
          @click="emitRemove"
        ></q-btn>
      </template>
    </q-input>
  </div>
</template>
<script lang="ts">
import type { PropType } from "vue";

export default Vue.defineComponent({
  name: "piecePriceInput",
  props: {
    modelValue: {
      type: Object as PropType<{ p: number; pcs: number }>,
      required: true,
    },
    rmBtn: {
      type: Boolean,
      default: true,
    },
    from: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const priceInputLabel = Vue.computed(() => {
      return `Price ${props.from ? "from" : "for"} ${props.modelValue.pcs} ${
        props.modelValue.pcs > 1 ? "articles" : "article"
      }`;
    });

    function emitRemove() {
      context.emit("remove");
    }

    const price = Vue.computed({
      get: () => {
        return Number(props.modelValue.p) / 100
      },
      set: (v) => {
        context.emit("update:modelValue", { p: Math.round(Number(v) * 100), pcs: pieces.value });
      }
    });

    const pieces =Vue.computed({
      get: () => {
        return props.modelValue.pcs
      },
      set: (v) => {
        context.emit("update:modelValue", { p: Math.round(Number(price.value) * 100), pcs: v });
      }
    });

    return { priceInputLabel, emitRemove, price, pieces };
  },
});
</script>
