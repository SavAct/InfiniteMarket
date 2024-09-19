<template>
  <q-page class="column">
    <q-inner-loading
        :showing="!loadingCompleted"
        :label="loadTryPercentage + '%'"
        label-class="text-teal"
        style="z-index: 99; background-color: #000000a0"
      />
    <q-stepper
      class="col fit"
      v-model="step"
      animated
      active-color="blue"
      style="background-color: var(--q-color-page)"
      v-if="step < 5"
    >
      <q-step
        :name="1"
        prefix="1"
        :done="step > 1"
        :title="$q.screen.gt.xs ? 'User' : ''"
        active-icon="account_circle"
        >
        <buy-step1
          v-if="orderData && seller"
          v-model:buyer-name="buyerName"
          v-model:buyer-keys="buyerKeys"
          :seller="seller"
          v-model="orderData"
          ref="step1Ref"
        ></buy-step1>
      </q-step>

      <q-step
        :name="2"
        prefix="2"
        :done="step > 2"
        :title="$q.screen.gt.xs ? 'Contact' : ''"
        active-icon="mark_email_read"
      >
        <buy-step-24-send-data
          :title="DISABLE_ENCRYPTION?'Send the seller your order':'Make a request by sending the seller your encrypted data'"
          :message="step2Msg"
          :raw="step2RawMsg"
          :seller="seller"
          v-model:contact="contact"
        ></buy-step-24-send-data>
      </q-step>

      <q-step
        :name="3"
        prefix="3"
        :done="step > 3"
        :title="$q.screen.gt.xs ? 'Payment' : ''"
        active-icon="currency_bitcoin"
        >
        <buy-step3
          v-if="orderData && 'buyer' in orderData"
          :entry="entry"
          v-model:price="usdPrice"
          :seller="seller"
          :buyer-keys="buyerKeys"
          v-model:completed="step3Completed"
          v-model:response="sellerResponse"
          v-model:link="trxLink"
          @inform-data="step3Msg = $event"
          @inform-raw="step3MsgRaw = $event"
          v-model="orderData"
        ></buy-step3>
      </q-step>

      <q-step
        :name="4"
        prefix="4"
        :done="step > 4"
        :title="$q.screen.gt.xs ? 'Inform' : ''"
        active-icon="mark_email_read"
      >
        <buy-step-24-send-data
          :title="'Recommendation: Inform the seller about your payment by sending him this ' + (DISABLE_ENCRYPTION? 'JSON ':'encrypted ')+ 'message'"
          :message="step3Msg"
          :raw="step3MsgRaw"
          :seller="seller"
          v-model:contact="contact"
        ></buy-step-24-send-data>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="q-gutter-sm">
          <q-btn
            v-if="step > 1"
            outline
            color="deep-orange"
            @click="backStep"
            label="Back"
            icon="arrow_back_ios"
          />
          <q-btn
            v-if="
              step < 2 ||
              (step === 2 && contact) ||
              (step === 3 && step3Completed) ||
              step == 4
            "
            :class="{ 'q-ml-sm': step > 1 }"
            class="q-pr-sm"
            outline
            @click="nextStep"
            color="blue"
            :label="forwardNavLabel"
            icon-right="arrow_forward_ios"
            :loading="isCompletingStep"
            :disable="isCompletingStep"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <div v-else class="q-ma-lg">
      <finished
        v-if="orderData && 'trx' in orderData && 'buyer' in orderData"
        class="q-mb-lg"
        :entry="entry"
        :token="token"
        v-model:price="usdPrice"
        :pieces="pieces"
        :seller="seller"
        :model-value="orderData"
      ></finished>
      <q-btn
        outline
        color="deep-orange"
        @click="backStep"
        label="Back"
        icon="arrow_back_ios"
      />
    </div>
  </q-page>
</template>
<script lang="ts">
import SetPgp from "../Components/SetPgp.vue";
import UserInput from "../Components/UserInput.vue";
import UserLink from "../Components/UserLink.vue";
import TokenSymbol from "../Components/TokenSymbol.vue";
import RawDataBtn from "../Components/RawDataBtn.vue";
import BuyStep1 from "../Components/BuySteps/BuyStep1.vue";
import BuyStep24SendData from "../Components/BuySteps/BuyStep24SendData.vue";
import BuyStep3 from "../Components/BuySteps/BuyStep3.vue";
import Finished from "../Components/BuySteps/Finished.vue";
import { state } from "../store/globals";
import { Token } from "../Components/AntelopeHelpers";
import { generateRandomString, OrderMsg } from "../Components/Generator";
import { ItemTable, UserTable } from "../Components/ContractInterfaces";
import { PGP_Keys } from "../Components/AddPgpBtn.vue";
import { LoadFromContract } from "../Components/MarketContractHandle";
import { GetQueryOrderRequest } from "../Components/queryHelper";
import { isPubKeyValid } from "../Components/pgpHelper";


export default Vue.defineComponent({
  components: {
    SetPgp,
    UserInput,
    UserLink,
    TokenSymbol,
    RawDataBtn,
    BuyStep1,
    BuyStep24SendData,
    BuyStep3,
    Finished,
  },
  name: "buyPage",
  setup() {
    const item = Vue.ref<{ id: number; category: bigint }>({
      id: -1,
      category: 0n,
    });
    const token = Vue.ref<Token>();
    const pieces = Vue.ref<number>();
    const toRegion = Vue.ref<string>(); // Compare with data entry

    const orderData = Vue.ref<OrderMsg>();

    const usdPrice = Vue.ref<number>();

    const entry = Vue.ref<ItemTable>();

    const loadMaxTries = 3; 
    
    const loadTries = Vue.ref<number>(0);
    const loadingCompleted = Vue.ref<boolean>(false);
    const loadTryPercentage = Vue.computed(() => {
      if(loadingCompleted.value){
        return 100;
      }
      if (loadMaxTries > 0) {
        return Math.round((loadTries.value / loadMaxTries) * 100);
      }
      return 100;
    });

    const seller = Vue.ref<UserTable | undefined>(undefined);
    const loadingSeller = Vue.ref<boolean>(false);
    async function getSellerByItem() {
      if (
        entry.value &&
        entry.value.seller !== undefined &&
        entry.value.seller.length > 0
      ) {
        loadingSeller.value = true;
        seller.value = await state.getUser(entry.value.seller, state.contract);
        
        if(seller.value?.pgp){
          const isValidSellerKey = await isPubKeyValid(seller.value?.pgp)
          if(isValidSellerKey !== true){
            Quasar.Notify.create({
              type: "negative",
              message: "Seller's public key is invalid",
              position: "top",
            });
          }
        }

        loadingSeller.value = false;
      }
    }

    async function findEntry(
      id: number,
      category: bigint,
      contract = state.contract
    ) {
      loadingCompleted.value = false;
      entry.value = await new LoadFromContract(loadTries).loadItem({
        id,
        category,
        ...contract,
      }, loadMaxTries);
      loadingCompleted.value = true;
      if (!entry.value || entry.value.id != id) {
        // No entry found
        Quasar.Notify.create({
          type: "negative",
          message: "Item not found",
          position: "top",
        });
      } else {
        getSellerByItem();
      }
    }

    const step = Vue.ref<number>(1);
    const step1Ref = Vue.ref<InstanceType<typeof BuyStep1> | null>(null);

    const isCompletingStep = Vue.ref<boolean>(false);
    const contact = Vue.ref<{ label: string; value: string }>();

    const step2RawMsg = Vue.ref<string>("");
    const step2Msg = Vue.ref<string>("");

    async function nextStep() {
      if (step.value == 1) {
        if(!step1Ref.value){
          return;
        }
        isCompletingStep.value = true;
        try{
          const result = await step1Ref.value.createAndEncrypt();
          if(result !== false){
            step2RawMsg.value = result.json;
            step2Msg.value = result.encrypted? result.encrypted: result.json;
            step.value++;
          } else {
            step2RawMsg.value = "";
            step2Msg.value = "";
          }
        } catch(e){
          console.error("Error on step 1", e);
        }
        isCompletingStep.value = false;
        return;
      }
      if (step.value < 5) step.value++;
    }

    function backStep() {
      if (step.value > 1) step.value--;
    }

    const buyerName = Vue.ref<string>("");
    const step3Msg = Vue.ref<string>("");
    const step3MsgRaw = Vue.ref<string>("");

    const buyerKeys = Vue.ref<PGP_Keys>({
      pub: "",
      pri: "",
      passphrase: "",
    });
    const step3Completed = Vue.ref<boolean>(false);

    const sellerResponse = Vue.ref<string>("");
    const trxLink = Vue.ref<string>("");

    const forwardNavLabel = Vue.computed(() => {
      switch (step.value) {
        case 2:
          return "Got a response";
        case 4:
          return "Informing is done";
        default:
          return "Continue";
      }
    });

    Vue.onMounted(async () => {
      const orderRequest = GetQueryOrderRequest();
      if(!orderRequest){
        Quasar.Notify.create({
          type: "negative",
          message: "Error while getting query parameters",
          position: "top",
        });
      }
      if(!orderRequest){
        Quasar.Notify.create({
          type: "negative",
          message: "Error while getting query parameters",
          position: "top",
        });
        return;
      }
      
      if (!orderRequest.token) {
        Quasar.Notify.create({
          type: "negative",
          message: "No token selected",
          position: "top",
        });
        return;
      }
      
      if(!orderRequest.pcs || orderRequest.pcs < 1){
        Quasar.Notify.create({
          type: "negative",
          message: "No pieces selected",
          position: "top",
        });
        return;
      }

      if(!orderRequest.to){
          Quasar.Notify.create({
            type: "negative",
            message: "No region selected",
            position: "top",
          });
          return;
        }
      
      if(!orderRequest.item || !('id' in orderRequest.item) || !('category' in orderRequest.item)){
        Quasar.Notify.create({
          type: "negative",
          message: "No item selected",
          position: "top",
        });
        return;
      }
      item.value.id = orderRequest.item.id;
      item.value.category = BigInt(orderRequest.item.category);
      await findEntry(item.value.id, item.value.category);

      if(!entry.value){
        Quasar.Notify.create({
          type: "negative",
          message: "No entry found",
          position: "top",
        });
        return;
      }

      token.value = orderRequest.token; // TODO: Replace with orderData
      pieces.value = orderRequest.pcs; // TODO: Replace with orderData
      toRegion.value = orderRequest.to; // TODO: Replace with orderData
      if(orderRequest.buyer && 'acc' in orderRequest.buyer){
        buyerName.value = orderRequest.buyer.acc;
      }

      const currentStep = orderRequest.step !== undefined && typeof orderRequest.step === 'number'? orderRequest.step: 0;
      const rId = orderRequest.rId!== undefined && orderRequest.rId.trim().length > 0? orderRequest.rId : generateRandomString(10);

      orderData.value = {...orderRequest, rId, seller: entry.value.seller};

      if(currentStep > 0){
        step2RawMsg.value = JSON.stringify(orderData.value);
        step2Msg.value = step2RawMsg.value;
        if(currentStep > 3){
          step3MsgRaw.value = JSON.stringify(orderData.value);
          step3Msg.value = step3MsgRaw.value;
        }
        step.value = currentStep;
      }
    });
    // TODO: Fix: Require selected token on refresh. Add payment method with preselected entry from item page, but alert if token is not on user accounts blockchain 

    return {
      darkStyle: state.darkStyle,
      step1Ref,
      entry,
      step,
      nextStep,
      backStep,
      pieces,
      toRegion,
      buyerName,
      token,
      isCompletingStep,
      buyerKeys,
      seller,
      step3Completed,
      usdPrice,
      contact,
      forwardNavLabel,
      sellerResponse,
      trxLink,
      item,
      DISABLE_ENCRYPTION: state.DISABLE_ENCRYPTION,
      loadTryPercentage,
      loadingCompleted,
      orderData,
      step2RawMsg,
      step2Msg,
      step3Msg,
      step3MsgRaw
    };
  },
});
</script>
