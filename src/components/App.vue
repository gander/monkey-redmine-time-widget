<template>
  <template v-if="loaded">
    <display-setup v-if="setupNeeded"/>
    <display-sum v-else/>
  </template>
</template>

<script setup lang="ts">
import DisplaySetup from './DisplaySetup.vue';
import DisplaySum from './DisplaySum.vue';
import {useConfigStore} from '../stores';
import {storeToRefs} from 'pinia';
import {onBeforeMount} from 'vue';

const configStore = useConfigStore();
const {load} = configStore;
const {loaded, setupNeeded} = storeToRefs(configStore);

onBeforeMount(load);
</script>


