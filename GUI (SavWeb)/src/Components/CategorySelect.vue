<template>
  <div class="row q-col-gutter-sm full-width q-pa-none">
    <div
      class="col-auto q-col-gutter-sm"
      :class="
        isTextInput && $q.screen.lt.sm
          ? 'column justify-between'
          : 'row reverse'
      "
    >
      <div class="col-auto">
        <q-btn
          v-bind="$props"
          :icon="isTextInput ? 'mouse' : 'keyboard'"
          @click="isTextInput = !isTextInput"
          class="bg-grey-8"
          color="white"
        ></q-btn>
      </div>
      <div class="col-auto">
        <q-btn
          v-bind="$props"
          @click="expandFilterClick"
          class="bg-grey-8"
          color="white"
        >
          <q-icon
            name="filter_list"
            :class="expandFilter ? 'rotate-180' : ''"
          ></q-icon>
        </q-btn>
      </div>
    </div>
    <div v-if="!isTextInput" class="col-auto q-col-gutter-sm row">
      <div class="col-auto">
        <q-btn-dropdown
          color="grey-8"
          :label="level0.name"
          split
          v-bind="$props"
          v-model="openLevel0Btn"
          @click="openLevel0Btn = !openLevel0Btn"
          no-caps
        >
          <q-list>
            <q-item
              v-for="(cat, index) in categoriesWithAll"
              :key="index"
              clickable
              v-close-popup
              @click="level0 = cat"
            >
              <q-item-section>
                <q-item-label>{{ getCategoryName(cat) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <template v-if="level0.child !== undefined && level0.child.length > 0">
        <div class="col-auto">
          <q-btn v-bind="$props" dense>/</q-btn>
        </div>

        <div class="col-auto">
          <q-btn-dropdown
            color="grey-8"
            :label="level1?.name"
            split
            v-bind="$props"
            v-model="openLevel1Btn"
            @click="openLevel1Btn = !openLevel1Btn"
            no-caps
          >
            <q-list>
              <q-item
                v-for="(cat, index) in level0.child"
                :key="index"
                clickable
                v-close-popup
                @click="level1 = cat"
              >
                <q-item-section>
                  <q-item-label>{{ getCategoryName(cat) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </template>
    </div>
    <template v-else>
      <category-input
        class="col"
        dense
        v-model="catValue"
        :range="range"
      ></category-input>
    </template>
    <div class="col-grow row justify-end">
      <q-btn
        v-bind="$props"
        icon="search"
        @click="confirmClick"
        class="col-auto bg-blue"
        color="white"
        :loading="searchLoading"
      ></q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import CategoryInput from "./CategoryInput.vue";
import { PropType } from "vue";
import {
  Category,
  categories,
  categoryBigInt,
  indexesById,
} from "./Categories";
import { deepCopy } from "./GeneralJSHelper";

export default Vue.defineComponent({
  name: "categorySelect",
  components: { CategoryInput },
  emits: ["update:modelValue", "update:expandFilter", "confirm"],
  props: {
    modelValue: {
      type: Object as PropType<bigint>,
      required: true,
    },
    size: {
      type: String,
      default: "md",
    },
    expandFilter: {
      type: Boolean,
      default: false,
    },
    range: {
      type: Object as PropType<Map<bigint, number>>,
      default: false,
    },
    searchLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const level0All = { name: "All", index: 0, count: 0 };
    const level1All = { name: "All", index: 0, count: 0 };

    function getAllCategoriesWithAll() {
      const cats = deepCopy(categories) as Category[];
      cats.unshift(level0All);
      for (let cat of cats) {
        if (cat.child !== undefined) {
          let allCount = 0;
          if (props.range !== undefined) {
            for (let child of cat.child) {
              const catInt = categoryBigInt(cat.index, child.index);
              const count = props.range.get(catInt);
              if (count !== undefined) {
                child.name += ` (${count})`;
                allCount += count;
              }
            }
          }
          cat.child.unshift({ name: `All (${allCount})`, index: 0 });
        }
      }
      return cats;
    }

    interface CategoryWithAll extends Category {
      count: number;
      child?: CategoryWithAll[];
    }

    const categoriesWithAll = Vue.computed(() => {
      const options: Array<CategoryWithAll> = [
        { name: "All", index: 0, count: 0 },
      ];
      if (props.range !== undefined) {
        for (let [catInt, count] of props.range) {
          if (!count) {
            continue;
          }
          const [l0, l1] = indexesById(catInt);
          const catL0 = categories.find((c) => c.index === l0);
          if (!catL0 || !catL0.child) {
            continue;
          }
          const catL1 = catL0.child.find((c) => c.index === l1);
          if (!catL1) {
            continue;
          }

          let optCat = options.find((c) => c.index === catL0.index);
          // Push L0 Element of L1 category if not already in options
          if (!optCat) {
            optCat = {
              name: catL0.name,
              index: l0,
              child: [{ name: "All", index: 0, count: 0 }],
              count: 0,
            };
            options.push(optCat);
          }
          // Push L1 category
          optCat.child?.push({
            name: catL1.name,
            index: l1,
            child: [],
            count,
          });
          optCat.count += count;
        }
        return options;
      } else {
        return getAllCategoriesWithAll();
      }
    });

    const isTextInput = Vue.ref<boolean>(true);
    const searchText = Vue.ref<string>("");
    const openLevel0Btn = Vue.ref<boolean>(false);
    const openLevel1Btn = Vue.ref<boolean>(false);

    let _level0 = Vue.ref<Category>(level0All);
    let _level1 = Vue.ref<Category>(level1All);
    const level0 = Vue.computed({
      get: () => _level0.value,
      set: (value) => {
        if (_level0.value.index !== value.index) {
          catValue.value = categoryBigInt(value.index, 0);
        }
      },
    });

    const level1 = Vue.computed({
      get: () => _level1.value,
      set: (value) => {
        if (value.index !== _level1.value.index) {
          catValue.value = categoryBigInt(level0.value.index, value.index);
          confirmClick();
        }
      },
    });

    function idToIndexInputs(id: bigint) {
      const levels = indexesById(id);
      _level0.value =
        categoriesWithAll.value.find((c) => c.index === levels[0]) || level0All;
      _level1.value = _level0.value.child
        ? _level0.value.child[levels[1]]
        : level1All;
    }

    const catValue = Vue.computed({
      get: () =>
        props.modelValue !== undefined ? BigInt(props.modelValue) : 0n,
      set: (value) => {
        if (value === undefined) {
          value = 0n;
        }
        idToIndexInputs(value);
        context.emit("update:modelValue", value);
      },
    });

    function confirmClick() {
      context.emit("confirm", catValue);
    }

    function expandFilterClick() {
      context.emit("update:expandFilter", !props.expandFilter);
    }

    Vue.onMounted(() => {
      idToIndexInputs(catValue.value);
    });

    function getCategoryName(cat: Category | CategoryWithAll | undefined) {
      if (cat) {
        if ("count" in cat && cat.count) {
          return `${cat.name} (${cat.count})`;
        }
        return cat.name;
      }
      return "All";
    }

    Vue.watch(
      () => props.modelValue,
      (value) => {
        // trigger update of catValue without changing the value
        catValue.value = value;
      }
    );

    return {
      categoriesWithAll,
      level0,
      level1,
      openLevel0Btn,
      openLevel1Btn,
      isTextInput,
      searchText,
      catValue,
      confirmClick,
      expandFilterClick,
      getCategoryName,
    };
  },
});
</script>
