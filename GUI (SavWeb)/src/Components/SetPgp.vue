<template>
  <div>
    <div class="text-h6 text-bold col-auto"></div>
    <div class="col-grow row justify-end reverse-wrap">
      <div class="col-auto q-mt-sm">
        <span v-if="fingerprint.length >= 0">Fingerprint: </span
        ><span class="text-secondary">{{ fingerprint.substring(0, 12) }}</span>
      </div>
      <q-space />
      <add-pgp-btn
        label="Create new key"
        icon="add_circle"
        class="q-px-sm col-auto"
        rounded
        color="blue"
        dense
        create-new
        v-model="keys"
      ></add-pgp-btn>
    </div>
    <q-input
      v-if="!hideInput"
      class="q-mt-sm"
      type="textarea"
      outlined
      label="Public PGP Key"
      v-model="publicKey"
    ></q-input>
    <q-btn
      v-if="showUploadBtn"
      class="q-mt-sm q-px-md"
      :disable="
        !(hasAccount && modelValue !== undefined && modelValue.pub.length > 0)
      "
      :label="(editPGP ? 'Update' : 'Store') + ' PGP key on chain [TODO]'"
      @click="setPgpOnChain"
      dense
      color="blue"
      icon="publish"
    ></q-btn>
  </div>
</template>
<script lang="ts">
import { PropType } from "vue";
import AddPgpBtn, { PGP_Keys } from "./AddPgpBtn.vue";

export default Vue.defineComponent({
  name: "tokenSymbol",
  components: { AddPgpBtn },
  emits: ["update:model-value", "fingerprint"],
  props: {
    modelValue: {
      type: Object as PropType<PGP_Keys>,
      required: true,
      default: {
        pub: "",
        pri: "",
        passphrase: "",
      } as PGP_Keys,
    },
    account: {
      type: String,
      required: false,
      default: "",
    },
    card: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideInput: {
      type: Boolean,
      required: false,
      default: false,
    },
    showUploadBtn: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    const keys = Vue.computed({
      get: () => {
        getFingerprint(props.modelValue.pub)
        return props.modelValue
      },
      set: (v) => {
        context.emit("update:model-value", {
          pub: v.pub,
          pri: v.pri,
          passphrase: v.passphrase,
          fingerprint: getFingerprint(v.pub),
        });
      },
    });
    const hasPGP = Vue.ref<boolean>(false);
    const editPGP = Vue.ref<boolean>(false);
    const hasAccount = Vue.computed(() => {
      return typeof props.account == "string" && props.account.length > 0;
    });

    function setPgpOnChain() {
      // TODO: Check if key is valid
      // TODO: Warn that uses will get presented the new public PGP Key
      // TODO: Compress key
      // TODO: Set PGP key for this user on chain
    }

    const publicKey = Vue.computed({
      get: () => props.modelValue.pub,
      set: (v: string) => {
        v = v.trim();
        if (v !== props.modelValue.pub.trim() || v.length === 0) {
          context.emit("update:model-value", {
            pri: "",
            passphrase: "",
            pub: v,
            fingerprint: getFingerprint(v),
          });
        }
      },
    });

    const fingerprint = Vue.ref<string>("");

    async function getFingerprint(pub: string) {
      const trimPub = pub.trim();
      if (trimPub.length > 0 && trimPub.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----") && trimPub.endsWith("-----END PGP PUBLIC KEY BLOCK-----")) {
        try {
          const oldVal = fingerprint.value;
          fingerprint.value = (
            await openpgp.readKey({ armoredKey: trimPub })
          ).getFingerprint();
          if(oldVal !== fingerprint.value){
            context.emit("fingerprint", fingerprint.value);
          }
        } catch (e) {
          if(fingerprint.value.length > 0) {
            context.emit("fingerprint", "");
            fingerprint.value = "";
          }
        }
      } else if(fingerprint.value.length > 0) {
        context.emit("fingerprint", "");
        fingerprint.value = "";
      }
      return fingerprint.value;
    }

    Vue.onMounted(() => {
        getFingerprint(props.modelValue.pub);        
    });

  

    return {
      keys,
      hasPGP,
      editPGP,
      setPgpOnChain,
      hasAccount,
      publicKey,
      fingerprint,
    };
  },
});
</script>
