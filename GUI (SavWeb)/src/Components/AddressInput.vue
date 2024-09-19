<template>
  <div>
    <div v-if="title||readonly" class="row">
      <div v-if="title" class="q-mb-sm text-h6 col-grow">{{ title }}</div>
      <div v-if="readonly" class="col-auto">
        <q-toggle
          v-model="singleTextMode"
          label="Post view"
          color="blue"
          dense></q-toggle>
        <q-btn
          round
          color="blue"
          size="sm"
          class="q-ml-sm"
          @click="copy(singleText, 'Copy address to clipboard')"
          icon="content_copy"
        ></q-btn>
      </div>
    </div>
    <div v-if="readonly && singleTextMode">
      <q-input readonly class="full-width q-px-sm" rows="6" type="textarea" :model-value="singleText" outlined></q-input>
    </div>
    <div v-else>
      <div class="row">
        <q-input
          class="col-4 q-px-sm"
          label="First Name"
          v-model="modelValue.firstName"
          :readonly="readonly"
        ></q-input>
        <q-input
          class="col-4 q-px-sm"
          label="Middle Names"
          v-model="modelValue.middleNames"
          :readonly="readonly"
        ></q-input>
        <q-input
          class="col-4 q-px-sm"
          label="Last Name"
          v-model="modelValue.lastName"
          :readonly="readonly"
        ></q-input>
      </div>

      <q-input
        class="q-px-sm q-pt-md"
        label="Address Line 1"
        v-model="modelValue.addressL1"
        :readonly="readonly"
      ></q-input>
      <q-input
        class="q-px-sm"
        label="Address Line 2 (Optional)"
        v-model="modelValue.addressL2"
        :readonly="readonly"
      ></q-input>
      <div class="row q-mt-md">
        <q-input
          class="col-6 q-px-sm"
          label="City"
          v-model="modelValue.city"
          :readonly="readonly"
        ></q-input>
        <q-input
          class="col-6 q-px-sm"
          label="State / Province / Region"
          v-model="modelValue.state"
          :readonly="readonly"
        ></q-input>
        <q-input
          class="col-6 q-px-sm"
          label="Postal Code"
          v-model="modelValue.postal"
          :readonly="readonly"
        ></q-input>

        <q-select
          class="col-6 q-px-sm self-end"
          v-model="region"
          label="Country"
          outlined
          :options="regionOptions"
          @filter="filterRegionInput"
          clearable
          use-input
          dense
          input-debounce="0"
          behavior="menu"
          @keyup.enter="
            if (regionOptions.length === 1) region = regionOptions[0];
          "
          :readonly="readonly"
        >
        </q-select>
      </div>
    </div>
    <q-input
      v-if="!readonly || modelValue.note.length > 0"
      class="full-width q-px-sm" :class="(readonly && singleTextMode)?'q-pt-sm':'q-pt-md'"
      :outlined="readonly && singleTextMode"
      :label="'Note'+ (readonly?'':' (Optional)')"
      v-model="modelValue.note"
      :readonly="readonly"
    ></q-input>
  </div>
</template>
<script lang="ts">
import { PropType, readonly, Ref } from "vue";
import { Address } from "./Generator";
import { countryCodesNoGroups, getRegion } from "./ConvertRegion";
import { copy } from "./QuasarHelpers";

export default Vue.defineComponent({
  name: "addressInput",
  props: {
    modelValue: {
      type: Object as PropType<Address>,
      required: true,
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },
    title: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  setup(props, context) {
    const region = Vue.computed({
      get: () => {
        return props.modelValue?.country
          ? {
              label: getRegion(props.modelValue?.country.toUpperCase()) ?? "",
              value: props.modelValue?.country,
            }
          : undefined;
      },
      set: (value) => {
        context.emit("update:modelValue", {
          ...props.modelValue,
          country: value?.value ?? "",
        });
      },
    });
    const regionOptions = Vue.ref<Array<{ label: string; value: string }>>([]);
    const countries = Vue.ref<Array<{ label: string; value: string }>>(
      countryCodesNoGroups.map((c) => {
        return { label: getRegion(c) ?? "", value: c };
      })
    );

    function regionFilter(
      search: string,
      update: Function,
      resultOptions: Ref<Array<{ label: string; value: string }>>
    ) {
      const needle = search.toLowerCase();
      update(() => {
        let options = [];
        for (let c of countries.value) {
          if (c.label.toLowerCase().includes(needle)) {
            options.push(c);
          }
        }
        resultOptions.value = options;
      });
    }

    function filterRegionInput(search: string, update: Function) {
      regionFilter(search, update, regionOptions);
    }

    const singleTextMode = Vue.ref<boolean>(props.readonly);
    const singleText = Vue.computed(() => {
      if(!readonly) return "";
      const addressStr = window.addressFormatter.format({
        state: props.modelValue.state,
        city: props.modelValue.city,
        postcode: props.modelValue.postal,
        countryCode: props.modelValue.country,
      }, {
        countryCode: props.modelValue.country,
        appendCountry: true,
      });
    return `${props.modelValue.firstName}${props.modelValue.middleNames.trim().length > 0? (' ' + props.modelValue.middleNames): ''} ${props.modelValue.lastName}\n${props.modelValue.addressL1}\n${props.modelValue.addressL2.trim().length > 0? (props.modelValue.addressL2 + '\n'): ''}${addressStr}`;
    });

    return { region, regionOptions, filterRegionInput, singleTextMode, singleText, copy };
  },
});
</script>
