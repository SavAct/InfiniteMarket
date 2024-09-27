<template>
  <q-page class="q-px-md" style="max-width: 800px; margin: 0 auto">
    <q-card class="q-mt-md">
      <q-card-section>
        <q-input
          class="q-mb-sm"
          v-model="title"
          label="Title"
          outlined
        ></q-input>
        <category-input
          class="q-mb-sm"
          v-model="category"
          label="Category"
          outlined
        />
        <q-input
          v-model="description"
          label="Description"
          type="textarea"
          outlined
        ></q-input>
        <q-input
          class="q-mt-md"
          v-model="imageSrc"
          label="Image link"
          outlined
          @keyup.enter="addImage"
        >
          <template v-slot:prepend>
            <q-icon name="image"></q-icon>
          </template>
          <template v-slot:append>
            <q-btn
              v-if="imageSrc !== ''"
              @click="imageSrc = ''"
              round
              icon="clear"
            />
          </template>
          <template v-slot:after>
            <q-btn
              :disable="imageSrc === ''"
              icon="send"
              @click="addImage"
              :color="imageSrc !== '' ? 'green' : 'grey'"
            ></q-btn>
          </template>
        </q-input>
        <div
          v-for="(img, index) in imgSrcs"
          :key="img.id"
          class="row justify-between q-mt-md"
        >
          <div class="col-grow q-pr-md">
            <pro-img
              :src="img.src"
              style="max-height: 200px"
              fit="contain"
              class="bg-black"
            />
          </div>
          <div class="column q-gutter-sm">
            <q-btn
              class="col-grow"
              icon="clear"
              color="red"
              @click="imgSrcs.splice(index, 1)"
            ></q-btn>
            <q-btn
              :disable="index === 0"
              class="col-auto"
              color="grey"
              icon="keyboard_arrow_up"
              @click="moveStringOneFieldBefore(index)"
            ></q-btn>
            <q-btn
              :disable="index === imgSrcs.length - 1"
              class="col-auto"
              color="grey"
              icon="keyboard_arrow_down"
              @click="moveStringOneFieldAfter(index)"
            ></q-btn>
          </div>
        </div>

        <div>
          <q-input
            class="q-mt-md q-mb-sm"
            v-model="tempOptions"
            label="Add Option"
            outlined
            @keyup.enter="pushOption"
          >
            <template v-slot:prepend>
              <q-icon name="style"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn
                v-if="tempOptions !== ''"
                @click="tempOptions = ''"
                round
                icon="clear"
              />
            </template>
            <template v-slot:after>
              <q-btn
                :disable="tempOptions === ''"
                icon="send"
                @click="pushOption"
                :color="tempOptions !== '' ? 'green' : 'grey'"
              ></q-btn>
            </template>
          </q-input>

          <div v-for="(opt, o_index) in options" :key="o_index">
            <q-input
              class="q-mt-sm"
              v-model="opt.value"
              :maxlength="127"
              :label="'Option ' + (o_index + 1)"
              outlined
            >
              <template v-slot:after>
                <q-btn
                  class="col-grow"
                  icon="clear"
                  color="red"
                  @click="options.splice(o_index, 1)"
                ></q-btn>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="q-mt-md">
      <q-card-section>
        <price-options-input v-model="pp" />
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <date-time-input
          v-model="expired"
          label="Placement expired in"
        ></date-time-input>
        <q-checkbox
          v-model="available"
          label="Items are available from now on"
        ></q-checkbox>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <q-select
          v-model="fromRegion"
          label="From region"
          outlined
          :options="fromOptions"
          @filter="filterFromInput"
          clearable
          use-input
          input-debounce="0"
          behavior="menu"
          @keyup.enter="
            if (fromOptions.length === 1) fromRegion = fromOptions[0];
          "
        >
        </q-select>
        <div class="q-mt-md">
          <q-select
            v-model="toRegions"
            multiple
            :options="shipToOptions"
            @filter="filterShipToInput"
            label="Ship to regions"
            outlined
            label-color="green"
            clearable
            use-input
            input-debounce="0"
            behavior="menu"
            @clear="toRegions = []"
            @keyup.enter="enterToRegionsClick"
          />
          <q-select
            class="q-mt-sm"
            v-model="excludeRegions"
            multiple
            :options="excludeOptions"
            @filter="filterExcludeInput"
            label="Explicit exclude regions"
            outlined
            label-color="red"
            clearable
            use-input
            input-debounce="0"
            behavior="menu"
            @keyup.enter="enterExcludeRegionsClick"
            @clear="excludeRegions = []"
          />
          <duration-input
            class="q-mt-md"
            label="Max shipping preparation time"
            v-model="duration"
          ></duration-input>
          <q-card v-for="region in toRegions" class="q-mt-sm">
            <q-card-section>
              <div class="row justify-between">
                <div>
                  {{ region.label }}
                </div>
                <q-btn
                  class="q-mb-xs"
                  dense
                  color="red"
                  icon="clear"
                  size="sm"
                  @click="
                    toRegions = toRegions.filter(
                      (r) => r.value !== region.value
                    )
                  "
                ></q-btn>
              </div>
              <div class="row justify-between">
                <q-input
                  class="q-mb-xs col-12 col-sm-5"
                  v-model="region.sp"
                  label="Delivery price"
                  type="number"
                  outlined
                  min="0"
                >
                  <template v-slot:append>USD</template>
                </q-input>
                <duration-input
                  class="col-12 col-sm-6"
                  v-model="region.sd"
                  label="Max delivery duration"
                ></duration-input>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <q-checkbox v-model="hasNote" label="Note for customers"></q-checkbox>
        <q-input
          v-show="hasNote"
          outlined
          v-model="note"
          label="Note"
          type="textarea"
        ></q-input>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md q-mb-md">
      <q-card-section>
        <div
          class="row justify-between"
          :class="
            $q.screen.lt.sm ? 'q-gutter-sm' : 'q-gutter-y-sm q-gutter-x-md'
          "
        >
          <div class="col-sm-grow col-12">
            <q-input v-model="seller" label="Seller account name" outlined />
          </div>
          <div class="col-auto flex flex-center">
            <q-btn
              @click="getLoginUser()"
              color="primary"
              label="Login user"
              :disable="checkingLoginUser"
            />
          </div>
          <div class="col-auto flex flex-center">
            <q-btn
              @click="showPreview"
              label="Preview"
              color="primary"
              icon-right="preview"
              size="md"
            />
          </div>
          <div class="col-auto flex flex-center">
            <q-btn
              @click="send"
              label="Send"
              color="primary"
              icon-right="send"
              size="md"
              :loading="loadingSend"
            />
          </div>
        </div>
        <div
          v-if="id !== undefined && id >= 0"
          class="row q-col-gutter-x-md q-mt-md"
        >
          <div class="col-auto">
            <q-btn
              @click="deleteEntry"
              label="Delete entry"
              color="red"
              icon-right="delete"
              size="md"
              :disable="isDeleting"
              :loading="isDeleting"
            />
          </div>
          <div class="col-auto">
            Id:
            {{ id }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script lang="ts">
import ProImg from "../Components/ProImg.vue";
import DurationInput from "../Components/DurationInput.vue";
import DateTimeInput from "../Components/DateTimeInput.vue";
import CategoryInput from "../Components/CategoryInput.vue";
import PriceOptionsInput from "../Components/PiecePrice/PriceOptionsInput.vue";
import { countryCodes, getRegion } from "../Components/ConvertRegion";
import { state } from "../store/globals";
import type { Ref } from "vue";
import {
  AddItem,
  ItemTable,
  PiecesPrice,
  Removeitem,
  ToRegion,
} from "../Components/ContractInterfaces";
import { savWeb } from "../store/connect";
import { GetQueryIdAndCategory, ItemPageMode } from "../Components/queryHelper";
import {
  checkUserOffline,
  checkUserOnline,
} from "../Components/AntelopeHelpers";
import { router } from "../router/simpleRouter";
import {
  LoadFromContract,
  userTableEntryToUser,
} from "../Components/MarketContractHandle";
import { requestLoginUser } from "../Components/LoginUser";
import { deepCopy } from "../Components/GeneralJSHelper";

export default Vue.defineComponent({
  name: "uploadPage",
  components: {
    ProImg,
    DurationInput,
    DateTimeInput,
    CategoryInput,
    PriceOptionsInput,
  },
  setup() {
    const pIpt = state.uploadPageInputs.value; // Previous input state
    const seller = Vue.ref<string>(
      pIpt?.seller !== undefined && pIpt?.seller !== undefined
        ? pIpt.seller
        : state.defaultUserName.value
    );
    const title = Vue.ref<string>(pIpt?.title ?? "");
    const imageSrc = Vue.ref<string>("");
    let imageSrcBiggestId = 0;
    const imgSrcs = Vue.ref<Array<{ id: number; src: string }>>(
      pIpt
        ? pIpt.imgs.map((i) => {
            return { id: imageSrcBiggestId++, src: i };
          })
        : []
    );

    const category = Vue.ref<bigint | undefined>(
      pIpt?.category !== undefined && BigInt(pIpt.category) != 0n
        ? BigInt(pIpt.category)
        : undefined
    );
    const id = Vue.ref<number | bigint | undefined>(undefined);

    const description = Vue.ref<string>(pIpt?.descr ?? "");
    const hasNote = Vue.ref<boolean>(pIpt ? pIpt.note !== "" : false);
    const note = Vue.ref<string>(pIpt?.note ?? "");

    const pp = Vue.ref<Array<PiecesPrice>>(pIpt?.pp ?? []);

    const duration = Vue.ref<number>(
      pIpt ? pIpt.prepT * 1000 : state.defaultValue.prepDuration
    );
    const expired = Vue.ref<number>(
      pIpt
        ? pIpt?.expired * 1000
        : Date.now() + state.defaultValue.expireDuration
    );
    const options = Vue.ref<Array<Ref<string>>>(
      pIpt?.opts.map((o) => Vue.ref<string>(o)) ?? []
    );
    const tempOptions = Vue.ref<string>("");      

    function pushOption() {
      if (tempOptions.value.trim() === "") return;
      options.value.push(Vue.ref<string>(tempOptions.value));
      tempOptions.value = "";
    }
    const available = Vue.ref<boolean>(
      pIpt?.available !== undefined ? pIpt.available : true
    );
    const countries = Vue.ref<Array<{ label: string; value: string }>>(
      countryCodes.map((c) => {
        return { label: getRegion(c) ?? "", value: c };
      })
    );
    const fromRegion = Vue.ref<{ label: string; value: string } | undefined>(
      pIpt?.fromR !== undefined && pIpt.fromR !== ""
        ? {
            label: getRegion(pIpt.fromR.toUpperCase()) ?? "",
            value: pIpt.fromR,
          }
        : undefined
    );
    const _toRegions = Vue.ref<
      Array<{
        label: string; // Region name
        value: string; // Country code
        sp: number; // Shipping price
        sd: number; // Shipping duration in ms
      }>
    >([]);
    if (pIpt && pIpt.shipTo !== undefined) {
      pIpt.shipTo.map((s) => {
        const codes = s.rs.toUpperCase().match(/../g);
        if (codes) {
          for (const c of codes) {
            _toRegions.value.push({
              label: getRegion(c) ?? "",
              value: c,
              sp: Number(s.p) / 100,
              sd: Number(s.t) * 1000,
            });
          }
        }
      });
    }
    const toRegions = Vue.computed({
      get: () => {
        return _toRegions.value;
      },
      set: (v) => {
        _toRegions.value = v.map((r) => {
          let sd = Number(r.sd);
          let sp = Number(r.sp);
          if (Number.isNaN(sd)) sd = state.defaultValue.shipDuration;
          if (Number.isNaN(sp)) sp = 0;

          return {
            label: r.label,
            value: r.value,
            sp,
            sd,
          };
        });
      },
    });
    const excludeRegions = Vue.ref<Array<{ label: string; value: string }>>(
      pIpt?.excl !== undefined
        ? pIpt.excl.match(/../g)?.map((c) => {
            return { label: getRegion(c.toUpperCase()) ?? "", value: c };
          }) ?? []
        : []
    );

    function addImage() {
      const trimmed = imageSrc.value.trim();
      if (imgSrcs.value.find((s) => s.src === trimmed)) return;
      imgSrcs.value.push({ id: imageSrcBiggestId++, src: trimmed });
      imageSrc.value = "";
    }
    function moveStringOneFieldBefore(index: number) {
      if (index > 0) {
        const item = imgSrcs.value.splice(index, 1)[0];
        imgSrcs.value.splice(index - 1, 0, item);
      }
    }

    function moveStringOneFieldAfter(index: number) {
      if (index < imgSrcs.value.length - 1) {
        const item = imgSrcs.value.splice(index, 1)[0];
        imgSrcs.value.splice(index + 2, 0, item);
      }
    }

    interface SettingsError {
      key: string;
      message: string;
      caption: string;
    }

    function getAndCheckAllSettings(): {
      data: AddItem;
      error: Array<SettingsError>;
    } {
      let errors: Array<SettingsError> = [];
      let invalidRegion: Array<string> = [];
      for (const exc of excludeRegions.value) {
        for (const to of toRegions.value) {
          if (exc.value === to.value) {
            invalidRegion.push(to.label);
          }
        }
      }
      let excludeCodes: string;
      if (invalidRegion.length > 0) {
        errors.push({
          key: "excl",
          message: `Exclude and ship to region overlap`,
          caption: `The following regions are invalid: ${invalidRegion.join(
            ", "
          )}`,
        });
        excludeCodes = "";
      } else {
        excludeCodes = excludeRegions.value
          .map((r) => r.value)
          .join("")
          .toLowerCase();
      }

      // Add only unique regions
      let shipTo: Array<ToRegion> = [];
      for (let r of toRegions.value) {
        // Normalize region values
        let sd = Math.floor(Number(r.sd) / 1000);
        let sp = Math.floor(Number(r.sp) * 100);
        if (Number.isNaN(sd)) sd = state.defaultValue.shipDuration;
        if (Number.isNaN(sp)) sp = 0;
        // Compare with existing region values
        const s = shipTo.find((s) => s.t === sd && s.p === sp);
        if (s === undefined) {
          shipTo.push({
            t: sd,
            p: sp,
            rs: r.value.toLowerCase(),
          });
        } else {
          s.rs += r.value.toLowerCase();
        }
      }

      let opts: Array<string> = options.value.map((o) => o.value.trim());
      for (const opt of opts) {
        if (opt.length === 0 || opt.length > 127) {
          errors.push({
            key: "opts",
            message: `Option length`,
            caption: `Each options must be between 1 and 127 characters long.`,
          });
          opts = [];
        }
      }

      if (opts.length == 1) {
        errors.push({
          key: "opts",
          message: `Options number`,
          caption: `Use no option or at least two options.`,
        });
      }

      if (
        category.value === undefined ||
        category.value < BigInt("0x0100000000000000") // First byte of category must be bigger than 0x00 to prevent conflicts in Antelope API requests with numbers as Antelope names
      ) {
        errors.push({
          key: "category",
          message: `Category not set`,
          caption: `Please select a category.`,
        });
      }

      if (!pp.value || pp.value.length === 0) {
        errors.push({
          key: "pp",
          message: `Price options not set`,
          caption: `Please add at least one price option.`,
        });
      } else if (pp.value.length > 1) {
        // Check all of pp if a pcs number is already defined
        for (let i = 0; i < pp.value.length; i++) {
          for (let k = i + 1; k < pp.value.length; k++) {
            if (Number(pp.value[i].pcs) === Number(pp.value[k].pcs)) {
              Quasar.Notify.create({
                message: "Invalid pieces number",
                caption: `Pieces number ${pp.value[k].pcs} is defined several times and will be removed.`,
                color: "warning",
                position: "top",
              });
              pp.value.splice(k, 1);
            }
          }
        }
      }

      let sellerName = seller.value
        .trim()
        .substring(0, 13)
        .replaceAll(" ", ".");
      return {
        data: {
          seller: checkUserOffline(sellerName) === true ? sellerName : "",
          title: title.value.trim(),
          pp: deepCopy(pp.value),
          note: hasNote.value ? note.value : "",
          descr: description.value,
          imgs: imgSrcs.value.map((i) => i.src),
          available: available.value,
          category: category.value === undefined ? 0n : BigInt(category.value),
          fromR: fromRegion.value ? fromRegion.value.value.toLowerCase() : "",
          shipTo,
          excl: excludeCodes,
          prepT: Math.floor(duration.value / 1000),
          expired: Math.floor(expired.value / 1000),
          opts,
        },
        error: errors,
      };
    }

    const loadUser = new LoadFromContract();

    const loadingSend = Vue.ref<boolean>(false);
    async function send() {
      if(loadingSend.value) return;
      loadingSend.value = true;
      await (async ()=>{
        const settings = getAndCheckAllSettings();
        if (settings.error.length > 0) {
          Quasar.Notify.create({
            message: settings.error[0].message,
            caption: settings.error[0].caption,
            color: "red",
            position: "top",
          });
          return;
        }
        // Check if user exists and handle error messages
        if (!(await checkUserOnline(seller.value))) {
          return;
        }

        // Set user data to current state if user is in table
        const foundUser = await loadUser.loadUser(seller.value);
        if (foundUser) {
          state.user.value = userTableEntryToUser(foundUser);
        } else {
          Quasar.Dialog.create({
            title: "Seller settings are not set",
            message:
              "Provide contact details in order for your customers to contact you in a secure way.",
            cancel: true,
            persistent: true,
            ok: {
              label: "Yes",
              color: "primary",
            },
          }).onOk(() => {
            // Go to user page
            router.push({ name: "user", query: { request: true } });
          });
          return;
        }
        settings.data.category = settings.data.category.toString();

        const result = await savWeb.transaction({
          chain: state.contract.chain,
          contract: state.contract.account,
          action: state.contract.actions.addItem,
          data: settings.data,
        });

        if (result !== undefined) {
          state.uploadPageInputs.value = undefined;
          router.push({
            name: "item",
            query: { settings: settings, mode: ItemPageMode.Wait },
          });
          return;
        }
      })()
      loadingSend.value = false;
    }

    function showPreview() {
      const settings = getAndCheckAllSettings();
      router.push({
        name: "item",
        query: { settings: settings, mode: ItemPageMode.Preview },
      });
    }

    Vue.onBeforeUnmount(() => {
      const settings = getAndCheckAllSettings();
      state.uploadPageInputs.value = {
        ...settings.data,
      };
    });

    function overrideSettings(settings: ItemTable) {
      seller.value = settings.seller;
      title.value = settings.title;
      description.value = settings.descr;
      options.value = settings.opts.map((o) => Vue.ref<string>(o));
      pp.value = settings.pp;
      duration.value = settings.prepT * 1000;
      expired.value = settings.expired * 1000;
      available.value = settings.available;
      fromRegion.value = {
        label: getRegion(settings.fromR?.toUpperCase()) ?? "",
        value: settings.fromR,
      };
      excludeRegions.value =
        settings.excl
          .match(/../g)
          ?.map((c) => {
            return { label: getRegion(c.toUpperCase()) ?? "", value: c };
          })
          .filter((r) => r.label !== "") ?? [];
      toRegions.value = settings.shipTo.map((s) => {
        const codes = s.rs.toUpperCase().match(/../g);
        if (codes) {
          for (const c of codes) {
            return {
              label: getRegion(c) ?? "",
              value: c,
              sp: Number(s.p) / 100,
              sd: Number(s.t) * 1000,
            };
          }
        }
        return {
          label: "",
          value: "",
          sp: 0,
          sd: 0,
        };
      });
      note.value = settings.note;
      hasNote.value = settings.note !== "";
      imgSrcs.value = settings.imgs.map((i) => {
        return { id: imageSrcBiggestId++, src: i };
      });
    }

    Vue.onMounted(() => {
      // Load already uploaded shop by query id and category if parameters are not already set
      const id_category = GetQueryIdAndCategory();
      if (!pIpt && id_category?.category !== undefined && id_category?.category !== 0n) {
        id.value = id_category.id;
        category.value = id_category.category;

        (async () => {
          const settings = await new LoadFromContract().loadItem({
            ...id_category,
            ...state.contract,
          });
          if (settings) {
            overrideSettings(settings);
          } else {
            // No entry found
            Quasar.Notify.create({
              type: "negative",
              message: "Item not found",
              position: "top",
            });
          }
        })();
      }
    });

    const isDeleting = Vue.ref<boolean>(false);
    async function deleteEntry() {
      if (id !== undefined) {
        isDeleting.value = true;

        const data: Removeitem = {
          id: String(id.value),
          category: String(category.value),
        };

        const result = await savWeb.transaction({
          chain: state.contract.chain,
          contract: state.contract.account,
          action: state.contract.actions.removeItem,
          data,
        });

        if (result !== undefined) {
          Quasar.Notify.create({
            type: "positive",
            message: "Item deleted",
            position: "top",
          });
          router.push({ name: "user", query: { user: seller.value } });
        }

        isDeleting.value = false;
      }
    }

    const checkingLoginUser = Vue.ref<boolean>(false);

    async function getLoginUser(name?: string) {
      if (checkingLoginUser.value === true) return;
      checkingLoginUser.value = true;

      const resultUser = await requestLoginUser(name);
      seller.value = resultUser?.name ?? "";

      checkingLoginUser.value = false;
    }

    const shipToOptions = Vue.ref<Array<{ label: string; value: string }>>([]);
    const excludeOptions = Vue.ref<Array<{ label: string; value: string }>>([]);
    const fromOptions = Vue.ref<Array<{ label: string; value: string }>>([]);

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
    function filterShipToInput(search: string, update: Function) {
      regionFilter(search, update, shipToOptions);
    }

    function filterExcludeInput(search: string, update: Function) {
      regionFilter(search, update, excludeOptions);
    }

    function filterFromInput(search: string, update: Function) {
      regionFilter(search, update, fromOptions);
    }

    function enterToRegionsClick() {
      if (shipToOptions.value.length === 1 && !toRegions.value.find((r) => r.value === shipToOptions.value[0].value)) {
        toRegions.value.push({
          label: shipToOptions.value[0].label,
          value: shipToOptions.value[0].value,
          sp: NaN,
          sd: NaN,
        });
      }
    }    

    function enterExcludeRegionsClick() {
      if (excludeOptions.value.length === 1 && !excludeRegions.value.find((r) => r.value === excludeOptions.value[0].value)) {
        excludeRegions.value.push({
          label: excludeOptions.value[0].label,
          value: excludeOptions.value[0].value,
        });
      }
    }

    return {
      darkStyle: state.darkStyle,
      seller,
      title,
      description,
      options,
      tempOptions,
      pushOption,
      pp,
      duration,
      expired,
      send,
      hasNote,
      note,
      available,
      fromRegion,
      category,
      getRegion,
      countries,
      toRegions,
      excludeRegions,
      imageSrc,
      imgSrcs,
      addImage,
      moveStringOneFieldBefore,
      moveStringOneFieldAfter,
      showPreview,
      deleteEntry,
      isDeleting,
      id,
      getLoginUser,
      checkingLoginUser,
      filterShipToInput,
      filterExcludeInput,
      filterFromInput,
      shipToOptions,
      excludeOptions,
      fromOptions,
      enterToRegionsClick,
      enterExcludeRegionsClick,
      loadingSend
    };
  },
});
</script>
