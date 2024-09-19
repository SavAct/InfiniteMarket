<template>
  <q-input
    rounded
    outlined
    dense
    v-model="userName"
    :rules="rules"
    :loading="isLoading"
    @keydown.enter="checkName"
    hide-bottom-space
  >
    <template v-slot:before>
      <q-select
        :disable="fixChain"
        style="width: 90px"
        outlined
        dense
        v-model="selectedChain"
        :options="chainOptions"
        :hide-dropdown-icon="fixChain"
      />
    </template>
    <template v-slot:after>
      <q-btn
        @click="checkName"
        :disable="isLoading"
        color="blue"
        rounded
        icon="send"
      ></q-btn>
    </template>
  </q-input>
</template>
<script lang="ts">
import { savConnected, savWeb } from "../store/connect";
import { state } from "../store/globals";
import { AllChains, checkUserOffline } from "./AntelopeHelpers";

export default Vue.defineComponent({
  name: "userInput",
  emits: ["update:model-value", "update:chain"],
  props: {
    modelValue: {
      type: String,
      required: true,
      default: "",
    },
    chain: {
      type: String,
      required: false,
      default: undefined,
    },
    fixChain: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    const userName = Vue.ref<string>(props.modelValue);
    const nameError = Vue.ref<boolean>(false);
    const isLoading = Vue.ref<boolean>(false);
    const darkStyle = Vue.computed(() => state.darkStyle.value);
    const pgpKey = Vue.ref<string>();

    const rules = [(val: string) => checkUserOffline(val)];

    Vue.watch(
      () => props.modelValue,
      (val) => {
        if (userName.value !== val) userName.value = val;
      }
    );

    async function checkName() {
      if (isLoading.value) {
        return;
      }
      if (checkUserOffline(userName.value) === true) {
        isLoading.value = true;
        const result = await savWeb.checkName(
          selectedChain.value.value,
          userName.value
        );
        isLoading.value = false;

        if (result === true) {
          context.emit("update:model-value", userName.value);
          Quasar.Notify.create({
            type: "positive",
            message: "Account is valid",
            position: "top",
          });
          return;
        } else if (result === false) {
          Quasar.Notify.create({
            type: "negative",
            message: "Not found",
            caption: "The account does not exist on the selected network",
            position: "top",
          });
        } else {
          Quasar.Notify.create({
            type: "negative",
            message: "Connection fail",
            caption:
              "Could not check the account, there seems to be an error with the connection",
            position: "top",
          });
        }
      }
      context.emit("update:model-value", "");
    }

    const chainOptions = AllChains;

    const _selectedChain = Vue.ref<{
      label: string;
      value: string;
      id: string;
    }>(chainOptions[0]);
    const selectedChain = Vue.computed({
      get: () => {
        if (props.chain !== undefined) {
          const selected = chainOptions.find(
            (c) => c.value == props.chain || c.id === props.chain
          );
          if (selected) {
            return selected;
          } else {
            Quasar.Notify.create({
              position: "top",
              type: "negative",
              message: "Chain is not available",
              caption: "Please connect another user",
            });
            userName.value = "";
            context.emit("update:model-value", "");
          }
        }
        return _selectedChain.value;
      },
      set: (v) => {
        _selectedChain.value = v;
        context.emit("update:chain", v.value);
      },
    });

    return {
      userName,
      nameError,
      checkName,
      isLoading,
      rules,
      chainOptions,
      selectedChain,
      darkStyle,
      savConnected,
      pgpKey,
    };
  },
});
</script>
