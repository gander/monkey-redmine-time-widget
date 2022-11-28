<template>
  <div class="sum" :class="{loading}">
    <template v-if="hasSub">
      <time-span class="cur help" :hours="hoursCur" title="The sum of the time used in the task"/>
      <span>+</span>
      <time-span class="sub help" :hours="hoursSub" title="The sum of the time used in the subtask"/>
      <span>=</span>
    </template>
    <time-span class="spent help" :hours="hoursSpent" title="Sum of time used"/>
    <template v-if="hoursEst > 0">
      <span>/</span>
      <time-span class="over help" :hours="hoursOver" v-if="hoursOver" :overtime="true" title="Total time over limit"/>
      <time-span class="left help" :hours="hoursLeft" v-else title="Total time remaining"/>
    </template>
    <span class="reset" @click="reset" title="Clear API key">&times;</span>
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
  hasSub,
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
  opacity: 0.5;
}

span.help {
  cursor: help;
}
</style>