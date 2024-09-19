<template>
  <q-select
    v-model="category"
    outlined
    :options="categoryOptions"
    use-input
    input-debounce="0"
    behavior="menu"
    label="Category"
    clearable
    @filter="filterCategoryInput"
    @keyup.enter="enterClick"
    :display-value="shownValue()"
  ></q-select>
</template>
<script lang="ts">
import { PropType } from "vue";
import { categories, categoryPathsById, indexesById } from "./Categories";

export default Vue.defineComponent({
  name: "categoryInput",
  props: {
    modelValue: {
      type: Object as PropType<bigint | undefined>,
      required: true,
    },
    range: {
      type: Object as PropType<Map<bigint, number>>,
      default: undefined,
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const category = Vue.computed({
      get: () =>
        props.modelValue !== undefined
          ? {
              value: props.modelValue,
              label: categoryPathsById[String(props.modelValue)],
            }
          : undefined,
      set: (value) => {
        context.emit("update:modelValue", value?.value);
      },
    });

    function enterClick() {
      if (categoryOptions.value.length === 1) {
        category.value = categoryOptions.value[0];
      }
    }

    function getCategoryOptions() {
      const options = [];
      if (props.range !== undefined) {
        for (let [catInt, count] of props.range) {
          if (!count) {
            continue;
          }
          const cat = categoryPathsById[String(catInt)];
          options.push({
            label: `${cat} (${count})`,
            value: catInt,
          });
        }
      } else {
        for (let id in categoryPathsById) {
          options.push({
            label: categoryPathsById[id],
            value: BigInt(id),
          });
        }
      }
      return options;
    }

    const categoryOptions =
      Vue.ref<Array<{ label: string; value: bigint }>>(getCategoryOptions());

    Vue.watch(
      () => props.range,
      () => {
        categoryOptions.value = getCategoryOptions();
      }
    );

    function filterCategoryInput(search: string, update: Function) {
      const needle = search.toLowerCase();
      update(() => {
        let options = [];
        if (props.range !== undefined) {
          for (let [catInt, count] of props.range) {
            if (!count) {
              continue;
            }
            const cat = categoryPathsById[String(catInt)];
            if (cat.toLowerCase().includes(needle)) {
              options.push({
                label: `${cat} (${count})`,
                value: catInt,
              });
            }
          }
        } else {
          for (let id in categoryPathsById) {
            if (categoryPathsById[id].toLowerCase().includes(needle)) {
              options.push({ value: BigInt(id), label: categoryPathsById[id] });
            }
          }
        }
        categoryOptions.value = options;
      });
    }

    function shownValue() {
      if (category.value === undefined || category.value.value === 0n) {
        return "";
      }
      const catIds = indexesById(BigInt(category.value.value));
      const cat0 = categories.find((c) => c.index == catIds[0]);
      if (cat0?.child === undefined || catIds[1] === 0) {
        return cat0?.name;
      }
      return cat0.child.find((c) => c.index == catIds[1])?.name;
    }

    return {
      category,
      categoryOptions,
      filterCategoryInput,
      enterClick,
      shownValue,
    };
  },
});
</script>
