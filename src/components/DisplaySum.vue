<template>
  <div class="sum" :class="{loading}">
    <template v-if="hasSub">
      <time-span class="cur help" :seconds="timeCur" title="The sum of the time used in the task"/>
      <span>+</span>
      <time-span class="sub help" :seconds="timeSub" title="The sum of the time used in the subtask"/>
      <span>=</span>
    </template>
    <time-span class="spent help" :seconds="timeSpent" title="Sum of time used"/>
    <template v-if="timeEst > 0">
      <span>/</span>
      <time-span :class="[timeOver ? 'over' : 'left', 'help']" :seconds="timeOver || timeLeft" :title="timeOver ? 'Total time over limit' : 'Total time remaining'"/>
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

onBeforeMount(dataStore.init);

const {
  hasSub,
  loading,
  timeCur,
  timeEst,
  timeLeft,
  timeOver,
  timeSpent,
  timeSub,
} = storeToRefs(dataStore);
</script>

<style scoped>
div.sum {
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
