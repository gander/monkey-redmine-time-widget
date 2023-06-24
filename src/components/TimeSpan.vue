<template>
  <span>
    {{ hours }}:{{ minutes }}<span class="seconds" v-if="seconds > 0">:{{ seconds }}</span>
  </span>
</template>

<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  seconds: {
    type: Number,
    required: true,
  }
});
const hours = computed(() => Math.trunc(props.seconds / 3600).toString().padStart(2, '0'));
const minutes = computed(() => Math.trunc((props.seconds / 60) % 60).toString().padStart(2, '0'));
const seconds = computed(() => Math.trunc(props.seconds % 60).toString().padStart(2, '0'));
</script>

<style scoped>
span.seconds {
  font-family: monospace;
  color: dimgrey;
}
</style>
