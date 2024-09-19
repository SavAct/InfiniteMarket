<template>
  <q-chip
    :icon="icon"
    :label="user"
    clickable
    @click="click"
    :color="color"
  ></q-chip>
</template>
<script lang="ts">
import { router } from "../router/simpleRouter";
import { openLinkOrMail } from "./LinkConverter";

export default Vue.defineComponent({
  name: "userLink",
  props: {
    user: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: undefined,
    },
    internal: {
      type: Boolean,
      required: false,
      default: false,
    },
    icon: {
      type: String,
      required: false,
      default: "person",
    },
  },
  setup(props) {
    return {
      click: () => {
        if (props.internal) {
          router.push({ name: "user", query: { user: props.user } });
        } else {
          openLinkOrMail(`https://bloks.io/account/${props.user}`);
        }
      },
    };
  },
});
</script>
