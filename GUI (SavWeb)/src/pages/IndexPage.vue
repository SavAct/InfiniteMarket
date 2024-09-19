<template>
  <q-page
    :class="$q.screen.gt.xs ? 'q-px-lg' : 'q-px-md'"
    style="max-width: 800px; margin: 0 auto"
  >
    <div>
      <div class="row q-my-md q-col-gutter-sm">
        <category-select
          :size="$q.screen.gt.xs ? 'md' : 'sm'"
          class="col-12"
          v-model="sCategory"
          @confirm="searchInCategory"
          :range="usedCategories"
          v-model:expand-filter="isFilterOpen"
          :search-loading="loadItems"
        ></category-select>

        <!-- Filter bar -->
        <div v-if="isFilterOpen" class="col-12">
          <q-separator />
          <filter-inputs @filter="(v) => filter(v)"></filter-inputs>
          <q-separator class="q-mt-md" />
        </div>
      </div>
      <!-- result list -->
      <q-card
        class="q-mb-sm"
        v-for="row in itemRows"
        :key="String(row.id) + '_' + String(sCategory)"
        flat
        bordered
        style="max-height: 260px"
        clickable
        @click="openItem(row.id, sCategory)"
        :loading="loadItems"
      >
        <q-card-section
          v-if="$q.screen.lt.sm"
          class="text-bold q-px-sm q-pb-none q-pt-sm"
        >
          {{ row.title }}
        </q-card-section>
        <q-card-section horizontal class="justify-between">
          <q-card-section class="col-5 col-md-3 q-pa-sm">
            <div
              class="flex flex-center full-width full-height"
              :class="darkStyle ? 'bg-grey-9' : 'bg-grey-4'"
            >
              <pro-img
                style="max-height: 240px"
                fit="contain"
                v-if="row.imgs.length > 0"
                :src="row.imgs[0]"
                :key="row.imgs[0]"
              ></pro-img>
            </div>
          </q-card-section>
          <q-card-section
            class="col q-pt-xs"
            :class="$q.screen.lt.sm ? 'q-pl-sm' : ''"
          >
            <div class="q-mt-sm row q-col-gutter-x-sm justify-end">
              <div
                class="col-grow"
                :class="
                  row.expired * 1000 < Date.now() ? 'text-red' : 'text-grey'
                "
              >
                {{ new Date(row.expired * 1000).toLocaleDateString() }}
              </div>
              <div class="col-auto text-right q-ma-none q-pa-none">
                <q-chip
                  class="q-ma-none q-pr-none q-pt-none"
                  icon="account_circle"
                  :label="row.seller"
                  dense
                />
              </div>
            </div>
            <div
              v-if="$q.screen.gt.xs"
              class="q-mb-xs"
              :class="$q.screen.gt.sm ? 'text-h6' : 'text-bold'"
            >
              {{ row.title }}
            </div>
            <div class="text-caption text-grey full-width row">
              <div :class="$q.screen.gt.xs ? 'col-auto' : 'col-12'">
                From {{ getRegion(row.fromR.toUpperCase()) }}
              </div>
              <div class="col-auto">
                {{
                  $q.screen.gt.xs ? "&nbsp;with preparation of" : "Preparation"
                }}&nbsp;{{ getInitialDuration(row.prepT * 1000).n }}&nbsp;{{
                  getInitialDuration(row.prepT * 1000).unit
                }}
              </div>
            </div>
            <q-card-section class="col-3 q-pa-none">
              <div class="q-mt-sm q-mb-xs">
                <span
                  v-if="
                    row.pp.length > 2 ||
                    (row.pp.length == 2 && row.pp[0].pcs != 0)
                  "
                >
                  <span class="text-bold" :class="priceSize">
                    {{ row.pp[row.pp[0].pcs == 0 ? 1 : 0].p }} $
                  </span>
                  <span> to </span>
                </span>
                <span class="text-bold" :class="priceSize">
                  {{ row.pp[row.pp.length - 1].p }} $
                </span>
              </div>

              <div class="text-caption text-grey">
                <span v-if="!(row.pp.length === 2 && row.pp[0].pcs == 0)"
                  >For</span
                >
                <span class="text-bold">
                  {{ row.pp[row.pp[0].pcs == 0 ? 1 : 0].pcs }}
                </span>
                <template v-if="row.pp.length > 1">
                  <span v-if="row.pp[0].pcs != 0 || row.pp.length > 2">
                    <span
                      >&nbsp;{{
                        row.pp[0].pcs != 0 ||
                        (row.pp[0].pcs == 0 &&
                          Number(row.pp[0].p) > row.pp[row.pp.length - 1].pcs)
                          ? "to over"
                          : "to"
                      }}&nbsp;</span
                    >
                    <span class="text-bold">{{
                      row.pp[row.pp.length - 1].pcs
                    }}</span>
                  </span>
                  <span
                    class="text-bold"
                    v-if="row.pp[0].pcs == 0 && Number(row.pp[0].p) > 0"
                    >&nbsp;(max.&nbsp;{{ row.pp[0].p }})</span
                  >
                  <span>&nbsp;pieces</span>
                </template>
                <span v-else>&nbsp;piece</span>
              </div>
            </q-card-section>
          </q-card-section>
          <div
            class="col-12 q-pt-none text-grey q-px-sm"
            :class="$q.screen.gt.xs ? 'text-right' : 'text-left'"
            style="position: absolute; bottom: 0"
          >
            <div class="text-overline">#{{ row.id }}</div>
          </div>
        </q-card-section>
      </q-card>
      <div class="full-width text-center">
        <q-btn
          v-if="itemRows.length > 0"
          outline
          color="grey"
          round
          class="q-mt-sm"
          icon="more_vert"
          @click="searchForOlder"
        ></q-btn>
      </div>
      <div v-if="itemRows.length == 0" class="q-mt-xl text-center text-h5">
        <div>Search for items by selecting a category above.</div>
      </div>
      <div class="q-mt-xl">Presented by SavAct.</div>
    </div>
  </q-page>
</template>
<script lang="ts">
import ProImg from "../Components/ProImg.vue";
import CategorySelect from "../Components/CategorySelect.vue";
import { QTableProps } from "quasar";
import { router } from "../router/simpleRouter";
import { CategoryCacheEntry, GetArticleMode, state } from "../store/globals";
import { categories } from "../Components/Categories";
import { ItemTable } from "../Components/ContractInterfaces";
import { getRegion } from "../Components/ConvertRegion";
import { getInitialDuration } from "../Components/GeneralJSHelper";
import { GetCategory } from "../Components/queryHelper";
import FilterInputs, { FilterValues } from "../Components/FilterInputs.vue";

export default Vue.defineComponent({
  name: "indexPage",
  components: {
    ProImg,
    CategorySelect,
    FilterInputs,
  },
  setup() {
    const isFilterOpen = Vue.ref<boolean>(false);
    const isPricePerUnit = Vue.ref<boolean>(false);

    const filterValues = Vue.ref<FilterValues>({
      text: "",
      toRegion: undefined,
      fromRegion: undefined,
    });
    function filter(v: FilterValues) {
      filterValues.value = v;
    }

    const sCategory = Vue.computed({
      get: () => state.indexPageCategory.value,
      set: (value) => {
        state.indexPageCategory.value = value;
      },
    });

    const categoryOptions = categories.map((v) => {
      return { name: v.name, value: v.index };
    });

    const categoryOpen = Vue.ref<boolean>(false);

    const loading = Vue.ref<boolean>(false);

    const itemColumns: QTableProps["columns"] = [
      { name: "id", align: "left", label: "Id", field: "id", sortable: true },
      { name: "imgs", align: "left", label: "", field: "imgs" },
      { name: "title", align: "left", label: "Title", field: "title" },
      {
        name: "price",
        align: "left",
        label: "Price",
        field: "price",
        sortable: true,
      },
      {
        name: "units",
        align: "left",
        label: "Units",
        field: "units",
        sortable: true,
      },
      { name: "seller", align: "left", label: "Seller", field: "seller" },
      {
        name: "editDate",
        align: "center",
        label: "Edit date",
        field: "editDate",
        sortable: true,
      },
    ];

    const itemEntries = Vue.ref<Array<ItemTable>>([]);

    const itemRows = Vue.computed<Array<ItemTable>>(() => {
      let filteredEntries = itemEntries.value;

      if (filterValues) {
        // Filter all words from text filter
        if (filterValues.value.text.length > 0) {
          const words = filterValues.value.text
            .split(" ")
            .map((v) => v.trim().toLowerCase())
            .filter((v) => v.length > 0);
          filteredEntries = filteredEntries.filter((v) => {
            const title = v.title.toLowerCase();
            let found = true;
            for (const w of words) {
              if (!title.includes(w)) {
                found = false;
              }
            }
            return found;
          });
        }
        // Filter for from region
        if (filterValues.value.fromRegion) {
          const fRegion = filterValues.value.fromRegion.value.toLowerCase();
          filteredEntries = filteredEntries.filter((v) => {
            return v.fromR === fRegion;
          });
        }
        // Filter for to region
        if (filterValues.value.toRegion) {
          const tRegion = filterValues.value.toRegion.value.toLowerCase();
          filteredEntries = filteredEntries.filter((v) => {
            for (const to of v.shipTo) {
              const toRs = to.rs.match(/../g);
              if (toRs) {
                for (const toR of toRs) {
                  if (toR === tRegion) {
                    return true;
                  }
                }
              }
            }
            return false;
          });
        }
      }

      return filteredEntries;
    });

    function openItem(id: number | bigint | string, category: bigint | string) {
      router.push({
        name: "item",
        query: { id: String(id), category: BigInt(category) },
      });
    }

    // TODO: Filter for currency and users country
    // TODO: Sort option for lowest total price, file name, shipping time and date

    /* Thoughts on a search function for items by words.
       Search primary for categories.
       -------
       Search secondary for decisive words in a contract table with this procedure (This procedure is too RAM expensive, see below for alternative):
       Title is split into a list of decisive words.
       The words are sorted by character.
       Hash of the combination of each word, but by keeping the sorted order of the words. ("c a b" will create the hash of "a b c", "a b", "a", "b" and "c")
       (Hash of "a b c" and "c b a" is the same)
       The first 8 bytes of each hash are used as scope of a contract table.
       The table holds the index of all items that are regarding to this hash.
       -------
       Alternative:
       Split title in words.
       Create 8 byte hash of each word with xxhash.
       Use the hashes as primary key of an RAM table and store all item indexes in a sorted array.
       Any access of an item of this array is done by a binary search.
    */

    function updateRows(cat: CategoryCacheEntry | undefined) {
      // TODO: Use filters
      if (cat) {
        itemEntries.value = [];
        // Add to itemRows for each entry of the object arts.list
        for (const [_, entries] of Object.entries(cat.list)) {
          itemEntries.value.push({
            ...entries.entry,
          });
        }
      }
    }

    const loadItems = Vue.ref<boolean>(false);
    async function loadItemsFromContract(
      category: bigint,
      mode: GetArticleMode
    ) {
      if (loadItems.value || category === 0n) {
        return;
      }
      loadItems.value = true;

      try {
        updateRows(
          await state.getArticles({ category, ...state.contract }, mode)
        );
      } catch (e) {
        console.error(e);
      }

      loadItems.value = false;
    }

    async function searchInCategory() {
      loadItemsFromContract(sCategory.value, GetArticleMode.upper);
    }

    async function searchForOlder() {
      loadItemsFromContract(sCategory.value, GetArticleMode.lower);
    }

    const priceSize = Vue.computed(() => {
      return Quasar.Screen.gt.xs ? "text-h6" : "text-subtitle1";
    });

    Vue.onMounted(() => {
      // Update used categories if last update is older than 30 minutes
      if (state.usedCategoriesLastUpdate.value + 1800000 < Date.now()) {
        state.updateUsedCategories(true).then(() => {
          // Get category from query
          const queryCat = GetCategory()?.category;
          if (queryCat) {
            sCategory.value = queryCat;
          }

          // if (sCategory.value === 0n) {
          //   Set selected category to a random entry of the available ones
          //   const keys = Array.from(state.usedCategories.value.keys());
          //   sCategory.value = keys[Math.floor(Math.random() * keys.length)];
          // }

          if (sCategory.value !== 0n) {
            searchInCategory();
          }
        });
      } else {
        if (sCategory.value !== 0n) {
          searchInCategory();
        }
      }
    });

    const usedCategories = Vue.computed(() => {
      return state.usedCategories.value;
    });

    return {
      darkStyle: state.darkStyle,
      isPricePerUnit,
      categories,
      categoryOptions,
      categoryOpen,
      loading,
      loadItems,
      itemRows,
      itemColumns,
      openItem,
      sCategory,
      searchInCategory,
      getRegion,
      priceSize,
      getInitialDuration,
      isFilterOpen,
      filter,
      searchForOlder,
      usedCategories,
    };
  },
});
</script>
