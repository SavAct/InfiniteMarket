<template>
  <div class="q-mb-sm row">
    <div class="col-grow">
      {{ label }} <span class="text-blue">{{ days }}</span
      >d <span class="text-blue">{{ String(hours).padStart(2, "0") }}</span
      >h <span class="text-blue">{{ String(minutes).padStart(2, "0") }}</span
      >m <span class="text-blue">{{ String(seconds).padStart(2, "0") }}</span
      >s
    </div>
    <q-btn
      class="col-auto q-pl-md q-pr-sm q-py-none q-my-none"
      color="primary"
      size="sm"
      rounded
      flat
      dense
      :icon-right="
        toggleExpireDate ? 'keyboard_arrow_down' : 'keyboard_arrow_up'
      "
      @click="toggleExpireDate = !toggleExpireDate"
      >{{ new Date(expired).toUTCString() }}</q-btn
    >
  </div>
  <div
    v-show="toggleExpireDate"
    class="q-gutter-md row items-start justify-center"
  >
    <q-date
      v-model="expiredStr"
      mask="YYYY-MM-DDTHH:mm:ss"
      :options="allowedDate"
    />
    <q-time
      format24h
      v-model="expiredStr"
      mask="YYYY-MM-DDTHH:mm:ss"
      with-seconds
      :options="allowedTime"
    />
  </div>
</template>
<script lang="ts">
export default Vue.defineComponent({
  name: "dateTimeInput",
  props: {
    modelValue: {
      type: Number,
      required: true,
      default: Date.now() + 90 * 24 * 3600 * 1000,
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
    minDate: {
      type: Number,
      required: false,
      default: Date.now() + 7 * 24 * 3600 * 1000,
    },
    maxDate: {
      type: Number,
      required: false,
      default: new Date(Date.now() + 90 * 24 * 3600 * 1000),
    },
  },
  setup(props, { emit }) {
    const toggleExpireDate = Vue.ref<boolean>(false);
    const _expiredStr = Vue.ref<string>(
      new Date(props.modelValue).toISOString().substring(0, 19)
    );
    const expiredStr = Vue.computed({
      get: () => _expiredStr.value,
      set: (val: string) => {
        const exp = Math.floor(Date.parse(val + ".000Z"));
        if (exp >= props.maxDate) {
          val = new Date(props.maxDate).toISOString().substring(0, 19);
        }
        if (exp <= props.minDate) {
          val = new Date(props.minDate).toISOString().substring(0, 19);
        }
        _expiredStr.value = val;
        expiredDuration.value = expired.value - Date.now();
      },
    });
    const expired = Vue.computed(() => {
      const exp = Math.floor(Date.parse(expiredStr.value + ".000Z"));
      emit("update:modelValue", exp);
      return exp;
    });

    const expiredDuration = Vue.ref<number>(0);
    const days = Vue.ref<number>(0);
    const hours = Vue.ref<number>(0);
    const minutes = Vue.ref<number>(0);
    const seconds = Vue.ref<number>(0);

    Vue.watch(expiredDuration, () => {
      const d = expiredDuration.value / 1000;
      if (d === undefined) return;
      days.value = Math.floor(d / 86400);
      hours.value = Math.floor((d % 86400) / 3600);
      minutes.value = Math.floor((d % 3600) / 60);
      seconds.value = Math.floor(d % 60);
    });

    Vue.onMounted(() => {
      setInterval(() => {
        expiredDuration.value = expired.value - Date.now();
      }, 1000);
    });

    function allowedDate(date: string) {
      return (
        date >=
          new Date(props.minDate)
            .toISOString()
            .substring(0, 10)
            .replaceAll("-", "/") &&
        date <=
          new Date(props.maxDate)
            .toISOString()
            .substring(0, 10)
            .replaceAll("-", "/")
      );
    }

    function allowedTime(hr: number, min: number | null, sec: number | null) {
      const minDate = new Date(props.minDate);
      const maxDate = new Date(props.maxDate);
      const expiredDate = new Date(expiredStr.value.substring(0, 10));
      if (
        new Date(maxDate.toISOString().substring(0, 10)).getTime() <
          expiredDate.getTime() ||
        new Date(minDate.toISOString().substring(0, 10)).getTime() >
          expiredDate.getTime()
      ) {
        return false;
      }

      if (props.minDate > expiredDate.getTime()) {
        if (hr > minDate.getUTCHours()) {
          return true;
        } else if (hr === minDate.getUTCHours()) {
          if (min === null || min > minDate.getUTCMinutes()) {
            return true;
          } else if (min === minDate.getUTCMinutes()) {
            if (sec === null || sec >= minDate.getUTCSeconds()) {
              return true;
            }
          }
        }
        return false;
      } else if (props.maxDate - 86400000 < expiredDate.getTime()) {
        if (hr < maxDate.getUTCHours()) {
          return true;
        } else if (hr === maxDate.getUTCHours()) {
          if (min === null || min < maxDate.getUTCMinutes()) {
            return true;
          } else if (min === maxDate.getUTCMinutes()) {
            if (sec === null || sec <= maxDate.getUTCSeconds()) {
              return true;
            }
          }
        }

        return false;
      }
      return true;
    }

    return {
      toggleExpireDate,
      expired,
      expiredStr,
      days,
      hours,
      minutes,
      seconds,
      expiredDuration,
      allowedDate,
      allowedTime,
    };
  },
});
</script>
