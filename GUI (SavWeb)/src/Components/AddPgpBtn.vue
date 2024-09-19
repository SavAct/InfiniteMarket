<template>
  <q-btn @click="show = true" v-bind="$attrs"></q-btn>
  <q-dialog v-model="show" persistent>
    <q-card class="bg-teal text-white" style="width: 400px">
      <q-card-section>
        <div class="text-h6">
          {{ createNew ? "Generate" : "Enter" }} Private PGP Key
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-expansion-item
          dense
          expand-icon="info"
          label="What is a passphrase"
          class="bg-teal-10"
        >
          <q-card class="bg-teal-8">
            <q-card-section>
              A passphrase is an optional security feature that functions like a
              password, which is necessary to use your private key. It's crucial
              to keep both the private key and passphrase confidential. If you
              lose your private key or forget your passphrase, you will not be
              able to decrypt your messages.
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <div class="row q-my-sm q-pr-sm">
          <div :class="createNew ? 'col-6' : 'col-12'">
            <q-input
              v-model="passphrase"
              outlined
              dense
              label-color="white"
              type="password"
              :label="
                'Passphrase ' + (createNew ? '(optional)' : '(if you have one)')
              "
            ></q-input>
          </div>
          <div class="col-6 q-pl-sm" v-if="createNew">
            <q-input
              v-model="passphraseCheck"
              outlined
              label-color="white"
              dense
              type="password"
              label="Repeat Passphrase"
            ></q-input>
          </div>
        </div>
        <div class="row justify-between" v-if="createNew">
          <div class="col-8">
            <q-btn
              class="q-mb-sm"
              rounded
              size="sm"
              color="blue"
              label="Generate new key"
              @click="generate"
              icon="restart_alt"
            ></q-btn>
          </div>
          <div class="col-2">
            <q-btn
              class="q-mt-sm float-right"
              round
              color="blue"
              size="sm"
              @click="copy(privatePGP, 'Copy private PGP key to clipboard')"
              icon="content_copy"
            ></q-btn>
          </div>
        </div>
        <q-input
          class="q-mt-sm"
          type="textarea"
          label="Private PGP Key"
          :readonly="createNew"
          outlined
          label-color="white"
          :input-style="{ color: 'white' }"
          v-model="privatePGP"
        ></q-input>
        <q-checkbox
          v-if="createNew"
          class="q-mt-md"
          v-model="checkSafe"
          label="I use this key at my own risk. I have stored it at a private and secure place and will remember my passphrase."
        ></q-checkbox>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          flat
          color="red"
          label="Cancel"
          @click="show = false"
          v-close-popup
        ></q-btn>
        <q-btn
          flat
          color="green"
          :disable="!okayIsValid"
          @click="confirm"
          label="Use this key"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { PropType } from "vue";
import { copy } from "./QuasarHelpers";

export interface PGP_Keys {
  pub: string;
  pri: string;
  passphrase: string;
  fingerprint?: Promise<string>;
}

export default Vue.defineComponent({
  name: "addPgpBtn",
  emits: ["update:model-value"],
  props: {
    createNew: {
      type: Boolean,
      required: false,
      default: false,
    },
    modelValue: {
      type: Object as PropType<PGP_Keys>,
      required: true,
      default: {
        pub: "",
        pri: "",
        passphrase: "",
      },
    },
  },
  setup(props, context) {
    const show = Vue.ref<boolean>(false);
    const checkSafe = Vue.ref<boolean>(false);

    const passphrase = Vue.ref<string>(
      props.modelValue.passphrase !== undefined
        ? props.modelValue.passphrase
        : ""
    );
    const passphraseCheck = Vue.ref<string>(
      props.modelValue.passphrase !== undefined
        ? props.modelValue.passphrase
        : ""
    );
    const privatePGP = Vue.ref<string>(
      props.modelValue.pri ? props.modelValue.pri : ""
    );
    const publicPGP = Vue.ref<string>("");

    Vue.watch(passphrase, () => {
      if (props.createNew) privatePGP.value = "";
    });

    function generate() {
      // https://github.com/openpgpjs/openpgpjs
      if (passphrase.value !== passphraseCheck.value) {
        Quasar.Notify.create({
          type: "negative",
          message: "Passphrases do not match",
          position: "top",
        });
        return;
      }

      openpgp
        .generateKey({
          userIDs: { name: "" },
          passphrase:
            passphrase.value.length > 0 ? passphrase.value : undefined,
          type: "ecc",
        })
        .then((key) => {
          privatePGP.value = key.privateKey;
          publicPGP.value = key.publicKey;
        })
        .catch((err) => {
          console.log("Error on key generation", err);
          context.emit("update:model-value", {
            pub: "",
            pri: "",
            passphrase: "",
          });
          Quasar.Notify.create({
            type: "negative",
            message: "Cannot generate PGP key",
            caption: String(err),
            position: "top",
          });
        });
    }

    async function confirm() {
      let caption = "";
      try {
        let key = await openpgp.readPrivateKey({
          armoredKey: privatePGP.value,
        });
        if (passphrase.value.length > 0) {
          key = await openpgp.decryptKey({
            privateKey: key,
            passphrase: passphrase.value,
          });
        }

        if (key.isPrivate()) {
          publicPGP.value = key.toPublic().armor();
          context.emit("update:model-value", {
            pub: publicPGP.value,
            pri: privatePGP.value,
            passphrase: passphrase.value,
          });
          show.value = false;
          return;
        }
      } catch (e) {
        console.log("Invalid private pgp key:", e);
        caption = String(e);
      }
      Quasar.Notify.create({
        type: "negative",
        message: "Invalid private PGP key",
        caption,
        position: "top",
      });
    }

    const okayIsValid = Vue.computed(() => {
      if (
        privatePGP.value.indexOf("-----BEGIN PGP PRIVATE KEY BLOCK-----") !=
          -1 &&
        privatePGP.value.indexOf("-----END PGP PRIVATE KEY BLOCK-----") != -1
      ) {
        if (props.createNew) {
          return checkSafe.value;
        } else {
          return true;
        }
      }
      return false;
    });

    return {
      show,
      checkSafe,
      passphrase,
      passphraseCheck,
      privatePGP,
      publicPGP,
      generate,
      confirm,
      copy,
      okayIsValid,
    };
  },
});
</script>
