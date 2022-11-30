<template>
  <div class="outer" v-if="loaded">
    <display-setup class="inner" v-if="setupNeeded"/>
    <display-sum class="inner" v-else/>
  </div>
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

<style scoped>
div.outer {
  display: flex;
  justify-content: end;
}

div.inner {
  width: 50%;
}
</style>
