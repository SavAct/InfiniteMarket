<template>
  <q-page class="column full-width items-center">
    <q-btn
      v-if="isPreview"
      class="col-auto full-width bg-grey-8 text-white"
      label="Close Preview"
      color="white"
      outline
      @click="goBack()"
    ></q-btn>
    <div class="full-width q-px-md" style="max-width: 1200px"> 
    <q-inner-loading
      :showing="!loadingCompleted"
      :label="loadTryPercentage + '%'"
      label-class="text-teal"
      style="z-index: 99; background-color: #000000a0"
    />
      <div class="q-py-md full-width">
        <div class="row full-width">
          <div class="col text-h5 q-pr-sm no-text-overflow">
            {{ item?.title }}
            <q-tooltip anchor="top middle" style="word-wrap: break-word">{{
              item?.title
            }}</q-tooltip>
          </div>
          <div class="col-auto">
            <q-btn
              icon="settings"
              size="sm"
              round
              v-if="!isPreview"
              @click="openSettings()"
            ></q-btn>
          </div>
        </div>

        <q-card
          v-if="(!$q.screen.gt.sm || !hasImgs) && item"
          class="q-mt-sm q-mb-sm"
        >
          <q-card-section class="text-right row justify-between q-py-sm">
            <span class="col-auto">
              <user-link
                :color="chipBgColor()"
                class="col-auto"
                :user="item.seller"
                internal
              ></user-link>
            </span>
            <span class="col-auto" v-if="item.fromR.length > 0">
              <span class="q-pr-sm">from</span>
              <q-chip
                :color="chipBgColor()"
                :label="getRegion(item.fromR.toUpperCase())"
              ></q-chip
            ></span>
          </q-card-section>
        </q-card>

        <div class="q-mt-md row">
          <div class="col-12" :class="hasImgs ? 'col-md-6' : ''">
            <gallery
              v-if="hasImgs"
              :height="$q.screen.lt.sm ? '250px' : '400px'"
              :srcs="imgs"
              :file-size="2117632"
            ></gallery>
            <!-- <q-separator class="q-my-md" /> -->

            <q-card
              v-if="showComboboxes && item?.opts && item.opts.length > 0"
              :class="hasImgs ? 'q-mt-lg' : 'q-mt-sm'"
            >
              <q-card-section class="row items-center">
                <div class="col-auto q-pb-sm">Options</div>
                <div class="col-grow text-right">
                  <q-chip
                    v-for="(opt, index) in item?.opts"
                    :key="index"
                    :label="opt"
                    :style="chipBorderStyle(option === opt)"
                    :color="chipBgColor(option === opt)"
                    clickable
                    @click="optClick(index)"
                  ></q-chip>
                </div>
                <q-select
                  outlined
                  v-model="option"
                  :options="item.opts"
                  label="Select an option"
                  dense
                  color="green"
                  class="q-my-sm col-12"
                ></q-select>
              </q-card-section>
            </q-card>
          </div>
          <div
            class="col-12"
            :class="{
              'q-pl-md': !$q.screen.lt.md && hasImgs,
              'col-md-6': hasImgs,
            }"
            v-if="item"
          >
            <q-card v-if="$q.screen.gt.sm && hasImgs">
              <q-card-section class="text-right row justify-between q-py-sm">
                <span class="col-auto">
                  <user-link
                    :color="chipBgColor()"
                    class="col-auto"
                    :user="item.seller"
                    internal
                  ></user-link>
                </span>
                <span class="col-auto" v-if="item.fromR.length > 0">
                  <span class="q-pr-sm">from</span>
                  <q-chip
                    :color="chipBgColor()"
                    :label="getRegion(item.fromR.toUpperCase())"
                  ></q-chip
                ></span>
              </q-card-section>
            </q-card>

            <q-card class="q-mt-lg">
              <q-card-section class="row items-center">
                <div class="col-auto q-pb-sm">Ship to</div>
                <div class="col-grow text-right">
                  <span
                    class="q-mr-sm"
                    v-for="(to, index) in availableTo"
                    :key="index"
                  >
                    <q-chip
                      v-if="to"
                      :style="chipBorderStyle(to.value === sRegion?.value)"
                      :color="chipBgColor(to.value === sRegion?.value)"
                      :label="getRegion(to.value.toUpperCase())"
                      text-color="green"
                      clickable
                      @click="regionClick(index)"
                    ></q-chip>
                  </span>
                  <span v-if="excluded">
                    <q-chip
                      v-for="(ex, index) in excluded"
                      :key="index"
                      :color="chipBgColor()"
                      text-color="red"
                      :label="getRegion(ex.toUpperCase())"
                      icon="do_not_disturb"
                    ></q-chip>
                  </span>
                </div>
                <q-select
                  v-if="showComboboxes"
                  outlined
                  v-model="sRegion"
                  :options="availableTo"
                  label="Select your region"
                  dense
                  color="green"
                  class="q-mt-sm col-12"
                ></q-select>
              </q-card-section>
            </q-card>

            <q-card class="q-mt-lg">
              <q-card-section class="row items-center">
                <div class="col-auto q-pb-sm">Accept payments of</div>
                <div class="col-grow text-right">
                  <token-symbol
                    v-for="(token, index) in acceptToken"
                    :key="index"
                    :style="chipBorderStyle(token.label === sToken?.label)"
                    :color="chipBgColor(token.label === sToken?.label)"
                    :symbol="token.value.symbol"
                    :contract="token.value.contract"
                    :chain="token.value.chain"
                    size="18px"
                    clickable
                    @click="tokenClick(index)"
                  ></token-symbol>
                </div>
                <q-select
                  v-if="showComboboxes"
                  outlined
                  v-model="sToken"
                  :options="acceptToken"
                  label="Token you want to pay with"
                  dense
                  color="green"
                  class="q-mt-sm col-12"
                ></q-select>
              </q-card-section>
            </q-card>

            <q-card class="q-mt-lg">
              <q-card-section>
                <piece-price-select
                  class="q-mb-sm"
                  label="Price option"
                  :pps="item.pp"
                  v-model:pieces="pieces"
                  v-model="piecesPrice"
                ></piece-price-select>

                <prices
                  :token="sToken"
                  :ship-to-price="selectedShipTo"
                  :pieces-price="piecesPrice"
                  :pieces="pieces"
                  :prep-time="item.prepT"
                  @total-price="totalPrice = $event"
                ></prices>
              </q-card-section>
            </q-card>
            <q-card class="q-mt-lg">
              <q-card-section>
                <q-spinner-grid v-if="loadingSeller" />
                <div v-if="seller" class="row">
                  <div v-if="!seller.active" class="text-red text-h5">
                    The seller is&nbsp;<span
                      v-if="seller.lastUpdate < Date.now() / 1000"
                      >not available.</span
                    ><span v-else
                      >not available until&nbsp;<span class="text-bold">{{
                        new Date(seller.lastUpdate * 1000)
                          .toUTCString()
                          .substring(5)
                      }}</span></span
                    >
                  </div>
                  <div v-else class="col-12">
                    <div class="q-mx-md q-mb-sm text-center" v-if="item && (!sToken?.value || !sRegion?.value)">{{'Select a ' + (sToken?.value? '':'token') + (!sToken?.value && !sRegion?.value?' and ':'') + (sRegion?.value? '':'region') + '!'}}</div>
                    <q-btn
                      :disable="
                        !seller.active ||
                        typeof totalPrice != 'number' ||
                        !sToken?.value || !sRegion?.value
                      "
                      class="bg-green full-width"
                      label="Buy"
                      color="white"
                      outline
                      @click="buyClick"
                    ></q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-separator class="q-my-lg" />
        <div v-if="item && item?.descr.length > 0">
          <div class="text-h5 no-text-overflow">Description</div>
          <div>{{ item?.descr }}</div>
        </div>
        <div v-if="item?.note">
          <q-separator class="q-my-md" />
          <div>
            <div class="text-h5 no-text-overflow">Note</div>
            <div>{{ item.note }}</div>
          </div>
        </div>
      </div>
      <div v-if="categoryName">
        <q-separator class="q-my-lg" />
        <div class="row items-center q-col-gutter-x-sm">
          <div class="col-auto">Other items in this category:</div>
          <q-chip
            class="col-auto"
            :label="categoryName"
            clickable
            @click="clickCategory"
          ></q-chip>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import Gallery from "../Components/Gallery.vue";
import TokenSymbol from "../Components/TokenSymbol.vue";
import UserLink from "../Components/UserLink.vue";
import PiecePriceSelect from "../Components/PiecePrice/PiecePriceSelect.vue";
import Prices from "../Components/Prices.vue";
import { state } from "../store/globals";
import { StringToSymbol, Token } from "../Components/AntelopeHelpers";
import { router } from "../router/simpleRouter";
import { getRegion } from "../Components/ConvertRegion";
import {
  GetQueryIdAndCategory,
  GetQueryMode,
  ItemPageMode,
} from "../Components/queryHelper";
import { ItemTable, UserTable } from "../Components/ContractInterfaces";
import { LoadFromContract } from "../Components/MarketContractHandle";
import { categoryPathsById } from "../Components/Categories";
import { chipBgColor, chipBorderStyle } from "../Components/styleHelper";

export default Vue.defineComponent({
  components: { Gallery, TokenSymbol, UserLink, PiecePriceSelect, Prices },
  name: "itemPage",
  setup() {
    // TODO: Handle wait mode
    const showComboboxes = Vue.ref<boolean>(false); // TODO: Settings to switch this design option

    const mode = GetQueryMode();

    const id = Vue.ref<number>();
    const category = Vue.ref<bigint>();
    const item = Vue.ref<ItemTable>();
    const totalPrice = Vue.ref<number>();

    const imgs = Vue.computed(() => item.value?.imgs);
    const seller = Vue.ref<UserTable | undefined>(undefined);

    const loadingSeller = Vue.ref<boolean>(false);

    const sRegion = Vue.ref<{ value: string; label: string | undefined }>();

    const excluded = Vue.computed(() => {
      if (item.value !== undefined) {
        const ex = item.value.excl.match(/../g);
        if (ex === null) {
          return undefined;
        }
        return ex;
      }
      return undefined;
    });

    const shipTo = Vue.computed(() => {
      if (item.value !== undefined) {
        return item.value.shipTo.map((to) => {
          return { p: Number(to.p), t: Number(to.t), rs: to.rs.match(/../g) };
        });
      }
      return undefined;
    });

    const shipToCountryCodes = Vue.computed(() => {
      if (shipTo.value !== undefined) {
        return shipTo.value.map((to) => to.rs).flat();
      }
      return undefined;
    });

    const availableTo = Vue.computed(() => {
      if (item.value !== undefined) {
        return shipToCountryCodes.value
          ?.filter((a) => {
            return a === null || !excluded.value?.includes(a);
          })
          .map((to) => {
            return to === null
              ? undefined
              : {
                  value: to,
                  label: getRegion(to.toUpperCase()) ?? "",
                };
          });
      }
      return undefined;
    });

    const piecesPrice = Vue.ref<{ p: number; pcs: number }>({
      p: 0,
      pcs: 0,
    });

    const sToken = Vue.ref<{
      value: Token;
      label: string;
    }>();

    const acceptToken = Vue.computed(() => {
      if (seller.value?.allowed !== undefined) {
        return seller.value.allowed.map((token) => {
          const sym = StringToSymbol(token.sym);
          return {
            value: {
              symbol: StringToSymbol(token.sym),
              contract: token.contr,
              chain: token.chain,
            },
            label: `${sym.name} (${token.contr} on ${token.chain})`,
          };
        });
      }
      return undefined;
    });

    const price = Vue.computed(() => {
      return (piecesPrice.value.p * pieces.value) / piecesPrice.value.pcs;
    });

    const selectedShipTo = Vue.computed(() => {
      if (shipTo.value !== undefined) {       
        return shipTo.value.find((a) =>
          a.rs?.find((r) => r == sRegion.value?.value)
        );
      }
      return undefined;
    });

    const _pieces = Vue.ref<number>(1);
    const pieces = Vue.computed({
      get: () => _pieces.value,
      set: (v) => {
        if (Number(v) > 0) {
          _pieces.value = Math.round(v);
        }
      },
    });

    function tokenClick(index: number) {
      if (acceptToken.value) {
        sToken.value = acceptToken.value[index];
      }
    }
    function regionClick(index: number) {
      if (availableTo.value) {
        sRegion.value = availableTo.value[index];
      }
    }

    function buyClick() {
      if (item.value && sRegion.value && sToken.value) {
        router.push({
          name: "buy",
          query: {
            id: item.value.id,
            category: category.value,
            to: sRegion.value.value,
            token: sToken.value.value,
            pcs: pieces.value,
          },
        });
      }
    }

    const loadMaxTries = 3;
    const loadTries = Vue.ref<number>(0);
    const loadingCompleted = Vue.ref<boolean>(true);
    const loadTryPercentage = Vue.computed(() => {
      if(loadingCompleted.value){
        return 100;
      }
      if (loadMaxTries > 0) {
        return Math.round((loadTries.value / loadMaxTries) * 100);
      }
      return 100;
    });

    async function getSellerByItem() {
      if (
        item.value &&
        item.value.seller !== undefined &&
        item.value.seller.length > 0
      ) {
        loadingSeller.value = true;
        seller.value = await state.getUser(item.value.seller, state.contract);
        loadingSeller.value = false;
      }
    }

    Vue.onMounted(async () => {
      switch (mode) {
        case ItemPageMode.Preview:
          const settings = state.uploadPageInputs.value;
          if (settings) {
            item.value = {
              id: 0,
              ...settings,
            };
            getSellerByItem();
          }
          break;
        case ItemPageMode.Wait:
          const settingsNoId = state.uploadPageInputs.value;
          // TODO: Wait for item to be added to RAM table. Find it without knowing the id in sellers table entry items.
          router.push({ name: "user", query: { user: settingsNoId?.seller } });
          break;
        case ItemPageMode.Standard:
          const id_category = GetQueryIdAndCategory();

          if (
            id_category?.id === undefined ||
            id_category.id == -1 ||
            id_category.category === undefined
          ) {
            // If no id or category is given, go back. Go to index page if not possible
            if (!router.back()) {
              router.push({ name: "home" });
            }
            return;
          }
          id.value = id_category.id;
          category.value = id_category.category;

          (async () => {
            loadingCompleted.value = false;
            item.value = await new LoadFromContract(loadTries).loadItem({
              ...id_category,
              ...state.contract,
            }, loadMaxTries);            
            loadingCompleted.value = true;
            if (!item.value) {
              // No entry found
              Quasar.Notify.create({
                type: "negative",
                message: "Item not found",
                position: "top",
              });
            } else {
              getSellerByItem();
            }
          })();
          break;
      }
    });

    function goBack() {
      if (!router.back()) {
        Quasar.Notify.create({
          type: "negative",
          message: "No page to go back to",
          position: "top",
        });
      }
    }

    function openSettings() {
      router.push({
        name: "upload",
        query: { id: id.value, category: category.value },
      });
    }

    const option = Vue.ref<string | undefined>();

    function optClick(index: number) {
      if (item.value && index < item.value.opts.length) {
        option.value = item.value.opts[index];
      }
    }

    const hasImgs = Vue.computed(() => {
      return imgs.value && imgs.value.length > 0;
    });

    const categoryName = Vue.computed(() => {
      if (category.value) {
        return categoryPathsById[String(category.value)];
      }
      return undefined;
    });

    function clickCategory() {
      if (category.value) {
        router.push({ name: "home", query: { category: category.value } });
      }
    }

    return {
      darkStyle: state.darkStyle,
      chipBgColor,
      chipBorderStyle,
      item,
      imgs,
      hasImgs,
      getRegion,
      seller,
      StringToSymbol,
      sRegion,
      availableTo,
      sToken,
      acceptToken,
      tokenClick,
      regionClick,
      buyClick,
      pieces,
      piecesPrice,
      price,
      goBack,
      isPreview: mode == ItemPageMode.Preview,
      loadTryPercentage,
      id,
      openSettings,
      loadingSeller,
      optClick,
      option,
      showComboboxes,
      excluded,
      categoryName,
      clickCategory,
      selectedShipTo,
      totalPrice,
      loadingCompleted
    };
  },
});
</script>
