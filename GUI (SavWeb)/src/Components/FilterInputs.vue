<template>
  <div>
    <div class="q-mt-sm">Filter for found entries</div>
    <q-input
      class="q-mt-sm"
      v-model="filterTextInput"
      outlined
      dense
      label="Text filter"
      @keyup.enter="filter(true)"
    >
      <template v-slot:append>
        <q-icon
          v-if="filterTextInput !== ''"
          name="close"
          @click="
            filterTextInput = '';
            filter(true);
          "
          class="cursor-pointer"
        ></q-icon>
      </template>
      <!-- <template v-slot:after>
        <q-btn icon-right="send" outline @click="filter(true)"></q-btn>
      </template> -->
    </q-input>

    <q-select
      class="q-mt-sm"
      v-model="toRegionInput"
      label="Ship to"
      outlined
      :options="toOptions"
      @filter="filterToInput"
      dense
      clearable
      use-input
      input-debounce="0"
      behavior="menu"
      @keyup.enter="if (toOptions.length === 1) toRegionInput = toOptions[0];"
    >
    </q-select>
    <q-select
      class="q-mt-sm"
      v-model="fromRegionInput"
      label="Ship from"
      outlined
      :options="fromOptions"
      @filter="filterFromInput"
      dense
      clearable
      use-input
      input-debounce="0"
      behavior="menu"
      @keyup.enter="
        if (fromOptions.length === 1) fromRegionInput = fromOptions[0];
      "
    ></q-select>
  </div>
</template>
<script lang="ts">
import type { Ref } from "vue";
import { countryCodes, getRegion } from "./ConvertRegion";

export interface FilterValues {
  text: string;
  toRegion: { label: string; value: string } | undefined;
  fromRegion: { label: string; value: string } | undefined;
}

export default Vue.defineComponent({
  name: "filterInputs",
  // props: {
  //   modelValue: {
  //     type: Object as PropType<Address>,
  //     required: true,
  //   },
  // },
  setup(_, context) {
    interface RegionInput {
      label: string;
      value: string;
    }

    let filterText = "";
    let toRegion: RegionInput | undefined = undefined;
    let fromRegion: RegionInput | undefined = undefined;

    const filterTextInput = Vue.ref<string>("");
    const toRegionInput = Vue.ref<RegionInput | undefined>(undefined);
    const fromRegionInput = Vue.ref<RegionInput | undefined>(undefined);

    Vue.watch(filterTextInput, () => {
      if (filterTextInput.value != filterText) {
        filter(false);
      }
    });

    Vue.watch(toRegionInput, () => {
      if (toRegion !== toRegionInput.value) {
        filter(true);
      }
    });

    Vue.watch(fromRegionInput, () => {
      if (fromRegion !== fromRegionInput.value) {
        filter(true);
      }
    });

    let filterId = 0;
    async function startFiltering(id: number) {
      let hasChanges = false;
      if (filterId === id) {
        if (filterTextInput.value != filterText) {
          filterText = filterTextInput.value;
          hasChanges = true;
        }
        if (toRegion !== toRegionInput.value) {
          toRegion = toRegionInput.value;
          hasChanges = true;
        }
        if (fromRegion !== fromRegionInput.value) {
          fromRegion = fromRegionInput.value;
          hasChanges = true;
        }

        if (hasChanges) {
          context.emit("filter", { text: filterText, toRegion, fromRegion });
        }
      }
    }

    async function filter(immediate = false) {
      if (immediate) {
        filterId++;
        startFiltering(filterId);
      } else {
        filterId++;
        const id = filterId;
        setTimeout(() => {
          startFiltering(id);
        }, 1000);
      }
    }

    const countries = Vue.ref<Array<{ label: string; value: string }>>(
      countryCodes.map((c) => {
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

    const toOptions = Vue.ref<Array<{ label: string; value: string }>>([]);
    const fromOptions = Vue.ref<Array<{ label: string; value: string }>>([]);

    function filterToInput(search: string, update: Function) {
      regionFilter(search, update, toOptions);
    }

    function filterFromInput(search: string, update: Function) {
      regionFilter(search, update, fromOptions);
    }

    return {
      filterTextInput,
      filter,
      toRegionInput,
      fromRegionInput,
      toOptions,
      fromOptions,
      filterToInput,
      filterFromInput,
    };
  },
});
</script>
