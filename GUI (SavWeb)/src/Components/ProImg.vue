<template>
  <q-img :src="protSrc"></q-img>
</template>
<script lang="ts">
import { GetUrlFile } from "../store/dlFiles";
export default Vue.defineComponent({
  name: "proImg",
  props: {
    src: {
      type: String,
      required: false,
      default: "",
    },
    fileSize: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    const protSrc = Vue.ref<string>("");
    Vue.onMounted(async () => {
      if (props.src.length > 0) {
        protSrc.value = await GetUrlFile(props.src, props.fileSize);
      }
    });

    return {
      protSrc,
    };
  },
});
</script>
