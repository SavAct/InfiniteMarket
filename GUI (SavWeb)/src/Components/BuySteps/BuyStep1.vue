<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item
      expand-separator
      icon="perm_identity"
      label="Your user name"
      :caption="userName"
      :header-class="{
        'text-red': validBuyerName === false,
      }"
      v-model="expBuyerName"
    >
      <q-card>
        <q-card-section>
          <user-input
            :fix-chain="typeof orderMsg.token.chain === 'string'"
            v-model="userName"
          ></user-input>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Removed until pgp encryption should be implemented -->
    <!-- <q-expansion-item
      expand-separator
      icon="enhanced_encryption"
      label="Your public PGP key"
      :header-class="{ 'text-red': validBuyerPgp === false }"
      v-model="expBuyerPgp"
    >
      <q-card>
        <q-card-section>
          <set-pgp v-model="bKeys" :account="userName"></set-pgp>
        </q-card-section>
      </q-card>
    </q-expansion-item> -->

    <q-expansion-item
      expand-separator
      icon="home"
      label="Your address"
      :header-class="{ 'text-red': validAddress === false }"
      v-model="expAddress"
    >
      <q-card>
        <q-card-section>
          <address-input v-model="address"></address-input>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>
<script lang="ts">
import UserInput from "../UserInput.vue";
import SetPgp from "../SetPgp.vue";
import AddressInput from "../AddressInput.vue";

import type { PropType } from "vue";
import { Address, OrderMsg, encrypt } from "../Generator";
import { PGP_Keys } from "../AddPgpBtn.vue";
import { state } from "../../store/globals";
import { UserTable } from "../ContractInterfaces";
import { countryCodesNoGroups } from "../ConvertRegion";

export default Vue.defineComponent({
  name: "buyStep1",
  components: { AddressInput, UserInput, SetPgp },
  emits: [
    "update:buyerName",
    "update:buyerKeys",
    "update:address",
    "update:modelValue",
  ],
  props: {
    buyerName: {
      type: String,
      required: true,
      default: "",
    },
    buyerKeys: {
      type: Object as PropType<PGP_Keys>,
      required: true,
      default: {
        pub: "",
        pri: "",
        passphrase: "",
      },
    },
    seller: {
      type: Object as PropType<UserTable>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<OrderMsg>,
      required: true,
    }
  },
  setup(props, context) {
    const expBuyerName = Vue.ref<boolean>(props.buyerName.length > 0);
    // const expBuyerPgp = Vue.ref<boolean>(false);
    const expAddress = Vue.ref<boolean>(false);
    const validBuyerName = Vue.ref<boolean | undefined>();
    // const validBuyerPgp = Vue.ref<boolean | undefined>();
    const validAddress = Vue.ref<boolean | undefined>();
    
    const address = Vue.ref<Address>(props.modelValue.buyer?.address ?? {
      firstName: "",
      middleNames: "",
      lastName: "",
      country: "",
      state: "",
      city: "",
      postal: "",
      addressL1: "",
      addressL2: "",
      note: "",
    });
    
    // Apply country from selected region if possible 
    if(props.modelValue.to !== undefined && address.value.country.length === 0) {
      const upperToRegion = props.modelValue.to.toUpperCase();
      const country = countryCodesNoGroups.includes(upperToRegion)? upperToRegion : ""
      address.value.country = country;
    }

    const userName = Vue.computed({
      get() {
        return props.buyerName;
      },
      set(value: string) {
        if (value.length > 0) {
          validBuyerName.value = true;
        }
        context.emit("update:buyerName", value);
        // TODO: Check if there is a public key of the buyer on blockchain and use it if there is no one
      },
    });

    const orderMsg = Vue.computed({
      get() {
        return props.modelValue;
      },
      set(value: OrderMsg) {
        context.emit("update:modelValue", value);
      },
    });

    const bKeys = Vue.computed({
      get() {
        return props.buyerKeys;
      },
      set(value: PGP_Keys) {
        context.emit("update:buyerKeys", value);
      },
    });

    Vue.watch(
      userName,
      () => {
        if (userName.value.length > 0) {
          expBuyerName.value = false;
          // if (props.buyerData.length > 0) {
          //   // TODO: check if buyerData is valid and set expBuyerPgp
          // } else {
          //   expBuyerPgp.value = true;
          // }
        }
      },
      { immediate: true }
    );

    function checkUserData() {
      validBuyerName.value = true;
      // validBuyerPgp.value = true;
      validAddress.value = true;
      expBuyerName.value = false;
      // expBuyerPgp.value = false;
      expAddress.value = false;

      if (props.buyerName === undefined || props.buyerName.length == 0) {
        validBuyerName.value = false;
        expBuyerName.value = true;
        return "No valid buyer name entered";
      } 
      // else if (
      //   props.buyerKeys.pub === undefined ||
      //   props.buyerKeys.pub.length == 0
      // ) {
      //   validBuyerPgp.value = false;
      //   expBuyerPgp.value = true;
      //   return "No buyer public PGP key entered";
      // }

      // Check address
      let msg: string | undefined = undefined;
      if (!address) {
        msg = "No address entered";
      } else if (address.value.firstName.length == 0) {
        msg = "No first name entered";
      } else if (address.value.lastName.length == 0) {
        msg = "No last name entered";
      } else if (address.value.country.length == 0) {
        msg = "No country entered";
      } else if (address.value.state.length == 0) {
        msg = "No state entered";
      } else if (address.value.city.length == 0) {
        msg = "No city entered";
      } else if (address.value.postal.length == 0) {
        msg = "No postal code entered";
      } else if (address.value.addressL1.length == 0) {
        msg = "No address line 1 entered";
      }
      if (msg !== undefined) {
        validAddress.value = false;
        expAddress.value = true;
        return msg;
      }

      return true;
    }
    function createJsonUserData() {
      try {
        const json = {
          ...orderMsg.value,
          buyer: {
            address: address.value,
            acc: props.buyerName,
            sigDate: Date.now(),
            pubPgp: props.buyerKeys.pub,
          },
          step: 1,
        };
        return JSON.stringify(json);
      } catch (e) {
        console.log("Error on stringify", e);
        orderMsg.value = {
          ...orderMsg.value,
          buyer: undefined,
          step: 0,
        };
        return "";
      }
    }

    async function createAndEncrypt() : Promise<{ json: string; encrypted?: string } | false> {
      const result = checkUserData();
      if (typeof result === "string") {
        Quasar.Notify.create({
          position: "top",
          type: "negative",
          message: result,
        });
        orderMsg.value = {
          ...orderMsg.value,
          buyer: undefined,
          step: 0,
        };
        return false;
      }
      const json = createJsonUserData();      
      orderMsg.value = JSON.parse(json);

      if (props.seller) {        
        if(state.DISABLE_ENCRYPTION) {
          return { json };
        }
        const data = await encrypt(
          json,
          props.seller.pgp,
          props.buyerKeys.pub,
          // props.buyerKeys.pri,
          // props.buyerKeys.passphrase
        );
        if (typeof data == "string") {
          return { json, encrypted: data };
        } else if (data !== false) {
          Quasar.Notify.create({
            position: "top",
            type: "negative",
            message: "Encryption failed",
            caption: "error" in data ? data.error : undefined,
          });
        }
      }
      return false;
    }

    return {
      expBuyerName,
      // expBuyerPgp,
      expAddress,
      validBuyerName,
      // validBuyerPgp,
      validAddress,
      userName,
      bKeys,
      address,
      createAndEncrypt,
      orderMsg,
    };
  },
});
</script>
