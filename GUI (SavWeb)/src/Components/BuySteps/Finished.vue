<template>
  <q-card>
    <q-card-section>
      <div>
        <div class="col-auto text-h6 q-pb-md">
          <span class="q-mr-md">Wait for the delivery</span>
          <q-icon size="md" name="local_shipping" color="blue"></q-icon>
        </div>
        <div class="row">
          <div class="q-mb-md col-12 col-sm-6 q-pr-md">
            The payment&nbsp;
            <template v-if="seller"
              >to <span class="text-bold">{{ seller.user }}</span
              >&nbsp;</template
            >
            <template v-if="orderData">
              with the memo "<span class="text-bold">{{ orderData.rId }}</span
              >"&nbsp;
            </template>
            should be in your
            <q-btn
              size="sm"
              class="q-ml-sm"
              label="history"
              color="blue"
              @click="openTrx"
            ></q-btn>
          </div>
          <div class="col-12 col-sm-6">
            <div class="q-mb-sm">Via the history you can:</div>
            <div class="row q-mb-sm">
              <div class="col-2 col-md-1 q-pr-sm">
                <q-icon size="md" name="task_alt" color="blue"></q-icon>
              </div>
              <div class="col">
                Finalize the payment, if you have received the item.
              </div>
            </div>
            <div class="row q-mb-sm">
              <div class="col-2 col-md-1 q-pr-sm">
                <q-icon size="md" name="whatshot" color="red"></q-icon>
              </div>
              <div class="col">
                Burn the payment if you have not received the item.
              </div>
            </div>
          </div>
        </div>
        <div>
          If the time limit ends, the transaction will be finalized
          automatically and you can no longer burn the payment. So, clear any
          problem with the seller in before.
          <!-- <br />[You can contact the seller here] -->
        </div>

        <!-- <div>
          <q-icon name="reply_all" color="orange"></q-icon>
          <span>Reject the payment, if you cannot deliver the item.</span>
        </div>
        <div>
          <q-icon name="more_time" color="green"></q-icon>
          <span>Payoff the payment to an EOS account, if the payment is finished and you receive it on a public key.</span>
        </div> -->

        <!-- <div v-if="deadline" class="q-mt-md q-mx-sm q-mb-sm">
          <span class="q-mr-sm">Payment will be finalized at </span>
          <span>
            {{ new Date(deadline * 1000).toLocaleString() }}
          </span>
          <div v-if="restTime">
            {{ formatDuration(restTime) }}
          </div>
        </div> -->
      </div>
      <order-item
        class="ful-width q-mt-lg"
        :entry="entry"
        :price="price"
        :token="token"
        :to-region="orderData.to"
        :pieces="pieces"
        :opt="orderData.opt"
      ></order-item>

      <!-- <div class="col-grow q-pb-md row justify-end">
          <div class="col-auto">
            <raw-data-btn
              icon="raw_off"
              round
              size="sm"
              color="blue"
              :raw-data="raw"
              :pub-recipient="seller?.pgp"
            ></raw-data-btn>
          </div>
          <div class="col-auto">
            <q-btn
              round
              color="blue"
              size="sm"
              class="q-ml-sm"
              @click="copy(encrypted, 'Copy PGP message to clipboard')"
              icon="content_copy"
            ></q-btn>
          </div>
        </div> -->

        <div class="q-mt-md row">
          <div class="col-grow">Store this data to look over it on a later time</div>
          <div class="col-auto">
              <q-btn
                round
                color="blue"
                size="sm"
                class="q-ml-sm"
                @click="copy(DISABLE_ENCRYPTION?allDataJson:messageToStore, 'Copy ' + (DISABLE_ENCRYPTION?'JSON ':'PGP ') + 'message to clipboard')"
                icon="content_copy"
              ></q-btn>
            </div>
        </div>
      <q-input
        type="textarea"
        readonly
        :model-value="DISABLE_ENCRYPTION?allDataJson:messageToStore"
        outlined
        :label="DISABLE_ENCRYPTION?'JSON data':'Encrypted data'"
      ></q-input>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import OrderItem from "../OrderItem.vue";
import RawDataBtn from "../RawDataBtn.vue";
import { copy } from "../QuasarHelpers";
import type { PropType } from "vue";
import { Token } from "../AntelopeHelpers";
import { formatDuration } from "../ConvertTime";
import { encrypt, OrderMsg } from "../Generator";
import { savWeb } from "../../store/connect";
import { ItemTable, UserTable } from "../ContractInterfaces";
import { PGP_Keys } from "../AddPgpBtn.vue";
import { state } from "../../store/globals";

export default Vue.defineComponent({
  name: "finished",
  components: {
    RawDataBtn,
    OrderItem,
  },
  emits: ["update:modelValue"],
  props: {
    entry: {
      type: Object as PropType<ItemTable>,
      required: true,
      default: null,
    },
    token: {
      type: Object as PropType<Token>,
      required: true,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    pieces: {
      type: Number,
      required: true,
      default: 1,
    },
    toRegion: {
      type: String,
      required: true,
      default: "",
    },
    seller: {
      type: Object as PropType<UserTable>,
      required: true,
      default: undefined,
    },
    chain: {
      type: String,
      required: true,
      default: "",
    },
    buyer: {
      type: String,
      required: true,
      default: "",
    },
    buyerKeys: {
      type: Object as PropType<PGP_Keys>,
      required: true,
      default: "",
    },
    modelValue: {
      type: Object as PropType<OrderMsg>,
      required: true,
    },
    // deadline: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
  },
  setup(props, context) {
    const restTime = Vue.ref<number>(0);

    const orderData = Vue.computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        context.emit("update:modelValue", value);
      },
    });
    orderData.value.step = 5;

    const allDataJson = Vue.computed(() => {      
      const json = JSON.stringify(orderData.value);
      if(state.DISABLE_ENCRYPTION){
        messageToStore.value = json;
      } else {
        delayEncryption();
      }
      return json;
    });

    const messageToStore = Vue.ref<string>("");
    let createAndEncryptId = 0;
    function delayEncryption() {
      createAndEncryptId++;
      const encryptId = createAndEncryptId;
      setTimeout(() => {
        if (encryptId == createAndEncryptId) {
          encryption();
        }
      }, 1000);
    }

    async function encryption() {
      if (props.seller && typeof props.seller.pgp == "string") {{
          // Encrypt
          const data = await encrypt(
            allDataJson.value,
            props.seller.pgp,
            props.buyerKeys.pub,
            props.buyerKeys.pri,
            props.buyerKeys.passphrase
          );
          if (typeof data == "string") {
            messageToStore.value = data;
          } else if (data !== false) {
            messageToStore.value = "";
          }
        }
      }
    }

    // let timerActive = false;
    // function startTimer() {
    //   timerActive = true;
    //   timer();
    // }
    // function timer() {
    //   if (timerActive && props.deadline) {
    //     restTime.value = props.deadline - Date.now() / 1000;
    //     setTimeout(timer, 1000);
    //   } else {
    //     restTime.value = 0;
    //   }
    // }

    // startTimer();

    function openTrx() {
      if(!orderData.value.trx || !orderData.value.buyer) return;
      savWeb.openHistory({
        chain: orderData.value.trx.chain,
        user: orderData.value.trx.from !== undefined? orderData.value.trx.from: orderData.value.buyer.acc,
        to: orderData.value.trx.to !== undefined? orderData.value.trx.to: orderData.value.seller,
      });
    }

    return {
      copy,
      restTime,
      formatDuration,
      openTrx,
      messageToStore,
      allDataJson,
      orderData,
      DISABLE_ENCRYPTION: state.DISABLE_ENCRYPTION,
    };
  },
});
</script>
