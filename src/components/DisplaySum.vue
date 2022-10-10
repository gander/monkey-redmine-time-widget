<template>
  <div class="sum" :class="{loading}">
    <time-span class="cur" :hours="hoursCur"/>
    <span>+</span>
    <time-span class="sub" :hours="hoursSub"/>
    <span>=</span>
    <time-span class="spent" :hours="hoursSpent"/>
    <template v-if="hoursEst > 0">
      <span>/</span>
      <time-span class="over" :hours="hoursOver" v-if="hoursOver" :overtime="true"/>
      <time-span class="left" :hours="hoursLeft" v-else/>
    </template>
    <span class="reset" @click="reset" title="Reset">&times;</span>
  </div>
</template>

<script setup lang="ts">
import TimeSpan from './TimeSpan.vue';
import {useConfigStore, useDataStore} from '../stores';
import {storeToRefs} from 'pinia';
import {onBeforeMount} from 'vue';

const {reset} = useConfigStore();
const dataStore = useDataStore();

const {init} = dataStore;
const {loading} = storeToRefs(dataStore);

const {
  hoursEst,
  hoursCur,
  hoursSub,
  hoursSpent,
  hoursLeft,
  hoursOver,
} = storeToRefs(dataStore);

onBeforeMount(init);
</script>

<style scoped>
div.sum {
  margin: 30px 0;
  height: 50px;
  display: flex;
  align-items: center;
}

div.loading {
  opacity: 0.5;
}

span {
  padding: 10px;
}

span.cur {
  border: 1px dotted orangered;
  color: orangered;
}

span.sub {
  border: 1px dotted orange;
  color: orange;
}

span.spent {
  border: 2px dashed palevioletred;
  border-radius: 100px;
  color: red;
  font-weight: bold;
}

span.left {
  border: 2px dashed limegreen;
  border-radius: 100px;
  color: green;
  font-weight: bold;
}

span.over {
  border: 2px dashed orange;
  border-radius: 100px;
  color: orangered;
  font-weight: bold;
}

span.reset {
  cursor: not-allowed;
}
</style>