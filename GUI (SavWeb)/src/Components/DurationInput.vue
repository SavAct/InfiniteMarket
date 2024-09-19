<template>
  <q-input
    v-model="durationNumber"
    type="number"
    min="0"
    :label="label"
    outlined
  >
    <template v-slot:append>
      <q-select
        v-model="durationUnit"
        filled
        :options="['months', 'weeks', 'days', 'hours', 'minutes']"
      />
    </template>
  </q-input>
</template>
<script lang="ts">
import { getDuration, getInitialDuration } from "./GeneralJSHelper";

export default Vue.defineComponent({
  name: "durationInput",
  props: {
    modelValue: {
      type: Number,
      required: false,
      default: 3 * 24 * 3600000,
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(props, { emit }) {
    const iniDuration = getInitialDuration(props.modelValue);
    const _durationUnit = Vue.ref<
      "months" | "weeks" | "days" | "hours" | "minutes"
    >(iniDuration.unit);
    const durationUnit = Vue.computed({
      get: () => _durationUnit.value,
      set: (value) => {
        _durationUnit.value = value;
        emit("update:modelValue", duration.value);
        emit("update:modelValue", getDuration(value, durationNumber.value));
      },
    });

    const _durationNumber = Vue.ref<number>(iniDuration.n);
    const durationNumber = Vue.computed({
      get: () => _durationNumber.value,
      set: (value) => {
        _durationNumber.value = value;
        emit("update:modelValue", getDuration(durationUnit.value, value));
      },
    });

    const duration = Vue.computed(() => {
      switch (durationUnit.value) {
        case "months":
          return durationNumber.value * 30 * 24 * 3600;
        case "weeks":
          return durationNumber.value * 7 * 24 * 3600;
        case "days":
          return durationNumber.value * 24 * 3600;
        case "hours":
          return durationNumber.value * 3600;
        case "minutes":
          return durationNumber.value * 60;
      }
    });

    return { durationNumber, durationUnit };
  },
});
</script>
