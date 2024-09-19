<template>
  <div>
    <q-btn v-bind="$attrs" @click="show = true"></q-btn>
    <q-dialog v-model="show">
      <q-card class="bg-teal text-white" style="width: 400px">
        <q-card-section class="row justify-between">
          <div class="text-h6 text-bold col-auto">
            Public key of message recipient
          </div>
          <div class="col-grow row justify-end">
            <q-btn
              round
              color="blue"
              size="sm"
              class="float-right"
              @click="
                copy(
                  pubRecipient,
                  'Copy public PGP key of the message recipient to clipboard'
                )
              "
              icon="content_copy"
            ></q-btn>
          </div>
          <q-input
            class="q-mt-sm col-12"
            type="textarea"
            label="Sellers public key"
            label-color="white"
            :input-style="{ color: 'white' }"
            readonly
            outlined
            text-color="white"
            :model-value="pubRecipient"
          ></q-input>
        </q-card-section>

        <q-card-section class="q-pt-none row justify-between">
          <div class="text-h6 col-auto">Decrypted raw data</div>
          <div class="col-grow row justify-end">
            <q-btn
              round
              color="blue"
              size="sm"
              class="float-right"
              @click="
                copy(
                  rawData,
                  'Copy raw data to clipboard',
                  'Do not send it to anyone!'
                )
              "
              icon="content_copy"
            ></q-btn>
          </div>
          <q-input
            class="q-mt-sm col-12"
            type="textarea"
            label="Raw data"
            readonly
            outlined
            label-color="white"
            :input-style="{ color: 'white' }"
            :model-value="rawData"
          ></q-input>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Back" @click="show = false" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
import { copy } from "./QuasarHelpers";

export default Vue.defineComponent({
  name: "rawDataBtn",
  props: {
    rawData: {
      type: String,
      required: true,
      default: "",
    },
    pubRecipient: {
      type: String,
      required: true,
      default: "",
    },
  },
  setup(_props) {
    const show = Vue.ref<boolean>(false);

    return {
      show,
      copy,
    };
  },
});
</script>
