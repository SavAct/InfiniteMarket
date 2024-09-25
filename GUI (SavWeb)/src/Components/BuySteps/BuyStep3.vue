<template>
  <q-card>
    <q-card-section>
      <q-checkbox v-model="sellerConfirms" label="The seller has responded to me and agreed to the purchase." />
      <!-- Removed until pgp encryption should be implemented -->
      <!-- <q-input
        type="textarea"
        :rows="sellerResponse.length > 1 ? 1 : 5"
        v-model="sellerResponse"
        outlined
        label="Sellers response"
      >
        <template v-slot:append>
          <q-icon
            v-if="sellerResponse.length > 0"
            name="close"
            @click="sellerResponse = ''"
            class="cursor-pointer"
          />
        </template>
      </q-input> -->
      <add-pgp-btn
        v-if="isEncrypted"
        class="q-px-sm q-mt-sm"
        v-model="buyerKeys"
        color="blue"
        dense
        label="Your PGP key"
        icon="vpn_key"
        rounded
      ></add-pgp-btn>
      <q-input
        v-if="responseDecrypted.length > 0"
        class="q-mt-sm"
        type="textarea"
        v-model="responseDecrypted"
        outlined
        label="Sellers note"
      ></q-input>
      <div v-if="entry && sellerConfirms" class="q-mt-sm">
        <order-item
          :entry="entry"
          v-model:price="usdPrice"
          :token="orderData.token"
          :pieces="orderData.pcs"
          :to-region="orderData.to"
          :opt="orderData.opt"
          @total-token ="currentTokenPrice = $event"
          @ship-duration="shipDuration = $event"
          ref="orderItemRef"
        ></order-item>
        <div v-if="maxPayTime" class="q-mt-md q-mx-sm q-mb-sm">
          <span class="q-mr-sm"> Payment must be sent before </span>
          <span>
            {{ new Date(maxPayTime * 1000).toLocaleString() }}
          </span>
          <div v-if="restTime">
            {{ formatDuration(restTime) }}
          </div>
        </div>
        <q-btn
          v-if="!maxPayTime || restTime > 10 * 60"
          v-show="!transLinkValid"
          class="full-width"
          color="blue"
          label="Send Payment"
          @click="sendPayment"
        ></q-btn>
        <div v-else>
          The sellers condition until this payment should have been succeeded is
          {{ restTime > 0 ? "almost over!" : "over!" }}<br />
          If you have not sent the payment yet, you may initiate a new request
          for the item and reach out to the seller once again.
        </div>
      </div>
      <q-input
        v-if="sellerConfirms"
        class="q-mt-md"
        label="Transaction link"
        v-model="transLink"
        :loading="waitForTrans"
        outlined
        dense
      ></q-input>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import AddPgpBtn, { PGP_Keys } from "../AddPgpBtn.vue";
import OrderItem from "../OrderItem.vue";
import type { PropType } from "vue";
import { state } from "../../store/globals";
import { Asset, AssetToString } from "../AntelopeHelpers";
import { formatDuration } from "../ConvertTime";
import {
  OrderMsg,
  SellerResponse,
  decrypt,
  encrypt,
} from "../Generator";
import { savWeb } from "../../store/connect";
import { ItemTable, UserTable } from "../ContractInterfaces";
import { PayParams } from "../SavWeb";

export default Vue.defineComponent({
  name: "buyStep3",
  components: { AddPgpBtn, OrderItem },
  emits: [
    "update:privateKey",
    "update:passphrase",
    "update:completed",
    "update:response",
    "update:link",
    "informData",
    "informRaw",
    "update:price",
    "update:modelValue"
  ],
  props: {
    entry: {
      type: Object as PropType<ItemTable>,
      required: true,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    completed: {
      type: Boolean,
      required: false,
      default: false,
    },
    seller: {
      type: Object as PropType<UserTable>,
      required: true,
      default: undefined,
    },
    response: {
      type: String,
      required: false,
      default: "",
    },
    link: {
      type: String,
      required: false,
      default: "",
    },
    buyerKeys: {
      type: Object as PropType<PGP_Keys>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<OrderMsg> | PropType<OrderMsg>,
      required: true,
    },
  },
  setup(props, context) {
    const sellerConfirms = Vue.ref<boolean>(false);
    const _sellerResponse = Vue.ref<string>(props.response);
    const sellerResponse = Vue.computed({
      get() {
        return _sellerResponse.value;
      },
      set(v) {
        checkResponse(v.trim());
        _sellerResponse.value = v;
      },
    });

    const usdPrice = Vue.computed({
      get() {
        return props.price;
      },
      set(v) {
        context.emit("update:price", v);
      },
    });

    const response = Vue.ref<SellerResponse | undefined>();
    const maxPayTime = Vue.ref<number>();
    const trx = Vue.ref<PayParams|undefined>();

    const orderData = Vue.computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        context.emit("update:modelValue", value);
      },
    });

    async function checkResponse(text: string) {
      if (!props.seller) return;
      if (text.startsWith("-----BEGIN PGP MESSAGE-----")) {
        text = await decrypt(
          text,
          props.buyerKeys.pri,
          props.buyerKeys.passphrase,
          props.seller.pgp
        );
      } else if (!text.startsWith("{")) {
        text = "";
      }

      if (text.length > 0) {
        try {
          response.value = JSON.parse(text) as SellerResponse;
          // TODO: When pgp is activated use a seller response textbox and us his transmitted data
          if (response.value.confirm) {
            if (response.value.buyer == orderData.value.buyer?.acc) {
              if (typeof response.value.time == "number") {
                maxPayTime.value = response.value.time;
                startTimer();
              }
              sellerConfirms.value = true;
              return;
            }
            console.log("Wrong buyer", response.value.buyer, orderData.value.buyer?.acc);
            Quasar.Notify.create({
              position: "top",
              type: "negative",
              message: "This message does not match to your account!",
            });
          }
        } catch (e) {
          console.log("Error parsing JSON", e, text);
        }
      }
      response.value = undefined;
      sellerConfirms.value = false;
    }

    const isEncrypted = Vue.computed(() => {
      return (
        sellerResponse.value.indexOf("-----BEGIN PGP MESSAGE-----") != -1 &&
        sellerResponse.value.indexOf("-----END PGP MESSAGE-----") != -1
      );
    });

    const responseDecrypted = Vue.ref<string>("");
    const currentTokenPrice = Vue.ref<Asset | undefined>(undefined);

    const shipDuration = Vue.ref<number|undefined>(undefined);
    const orderItemRef = Vue.ref<InstanceType<typeof OrderItem> | null>(null)

    async function sendPayment() {
      await orderItemRef.value?.updateTokenPrice();

      if(!currentTokenPrice.value) {
        Quasar.Notify.create({
          position: "top",
          type: "negative",
          message: "No token price available",
        });
        return;
      }
      
      const assetStr = `${AssetToString(currentTokenPrice.value)} ${orderData.value.token.contract}`;
      waitForTrans.value = true;

      
      
      const result = await savWeb.payment({
        chain: orderData.value.token.chain,
        to: props.entry.seller,
        pay: assetStr,
        memo: orderData.value.rId,
        dt: shipDuration.value !== undefined? + shipDuration.value + (3*24*3600): undefined, // Add three days to cancel the payment
      });

      if (result && "to" in result && "chain" in result && "pay" in result) {
        trx.value = result as PayParams;
        let link = "";
        let from = "from" in result ? result.from : orderData.value.buyer?.acc;
        if ("index" in result) {
          link = `https://savact.app/#/_trx_/action?user=${from}&to=${result.to}&id=${result.index}&chain=${result.chain}`;
        } else {
          link = `https://savact.app/#/_trx_/history?user=${result.to}&to=${from}&chain=${result.chain}`;
        }
        transLink.value = link;
      } else {
        Quasar.Notify.create({
          position: "top",
          type: "negative",
          message: "Cannot find a transaction",
        });
        transLink.value = "";
      }

      waitForTrans.value = false;
    }

    const transLink = Vue.ref<string>(props.link);
    const waitForTrans = Vue.ref<boolean>(false);
    const transLinkValid = Vue.computed(() => {
      if (
        transLink.value.length > 0 &&
        transLink.value.toLocaleLowerCase().includes("savact.app")
      ) {
        if (
          props.response != sellerResponse.value ||
          props.link != transLink.value ||
          props.completed != true
        ) {
          context.emit("update:response", sellerResponse.value);
          context.emit("update:link", transLink.value);

          delayedCreateAndEncrypt();
        }
        return true;
      }
      context.emit("update:response", "");
      context.emit("update:link", "");
      context.emit("update:completed", false);
      return false;
    });

    Vue.watch([isEncrypted, props.buyerKeys], () => {
      if (isEncrypted.value && props.buyerKeys.pri.length > 0) {
        checkResponse(sellerResponse.value);
      }
    });

    let createAndEncryptId = 0;
    function delayedCreateAndEncrypt() {
      createAndEncryptId++;
      const encryptId = createAndEncryptId;
      setTimeout(() => {
        if (encryptId == createAndEncryptId) {
          createAndEncrypt();
        }
      }, 1000);
    }

    async function createAndEncrypt() {
      const json = createInformJson();
      orderData.value = JSON.parse(json);

      let fail = true;
      if (props.seller) {
        if (state.DISABLE_ENCRYPTION) {
          fail = false;
          context.emit("informData", json);
        } else {
          // Encrypt
          const data = await encrypt(
            json,
            props.seller.pgp,
            props.buyerKeys.pub,
            props.buyerKeys.pri,
            props.buyerKeys.passphrase
          );
          if (typeof data == "string") {
            context.emit("informData", data);
            fail = false;
          } else if (data !== false) {
            context.emit("informData", "");
            fail = true;
            Quasar.Notify.create({
              position: "top",
              type: "negative",
              message: "Encryption failed",
              caption: "error" in data ? data.error : undefined,
            });
          }
        }
      } else {
        context.emit("informData", json);
        fail = false;
      }
      context.emit("update:completed", !fail);
      if (!fail) {
        Quasar.Notify.create({
          position: "top",
          type: "positive",
          message: "Looks fine. Now continue to inform the seller.",
        });
        context.emit("informRaw", "");
      } else {
        context.emit("informRaw", json);
      }
    }
    // TODO: Warn if price changed below -5% that the seller might not accept the payment

    const restTime = Vue.ref<number>(0);
    let timerActive = false;
    function startTimer() {
      timerActive = true;
      timer();
    }
    function timer() {
      if (timerActive && maxPayTime.value) {
        restTime.value = maxPayTime.value - Date.now() / 1000;
        setTimeout(timer, 1000);
      } else {
        restTime.value = 0;
      }
    }

    function createInformJson() {
      try {
        if(trx.value === undefined) throw new Error("No transaction");
        const jsonData: OrderMsg = {
          ...orderData.value,
          step: 3,
          trx: trx.value,
        };
        context.emit("update:modelValue", jsonData);

        return JSON.stringify(jsonData);
      } catch (e) {
        console.log("Error on stringify", e);
        context.emit("update:modelValue", undefined);
        return "";
      }
    }

    if (_sellerResponse.value.length > 0) {
      checkResponse(_sellerResponse.value);
    }

    return {
      darkStyle: state.darkStyle,
      sellerConfirms,
      sellerResponse,
      transLink,
      waitForTrans,
      transLinkValid,
      sendPayment,
      isEncrypted,
      responseDecrypted,
      decrypt,
      maxPayTime,
      restTime,
      formatDuration,
      currentTokenPrice,
      usdPrice,
      shipDuration,
      orderItemRef,
      orderData
    };
  },
});
</script>
