<template>
  <span>
    {{ overtime ? '-' : '' }}{{ Math.trunc(hours).toString().padStart(2, '0') }}:{{ Math.round(hours * 60 % 60).toString().padStart(2, '0') }}
  </span>
</template>

<script setup lang="ts">
defineProps({
  hours: {
    type: Number,
    default: 0,
  },
  overtime: {
    type: Boolean,
    default: false,
  },
});
</script>
