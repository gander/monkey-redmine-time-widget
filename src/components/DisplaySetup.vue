<template>
  <div class="wrapper">
    <FormKit
        type="text"
        label="API Key"
        maxlength="40"
        minlength="40"
        validation="required|alphanumeric|length:40"
        validation-visibility="live"
        v-model.lazy.trim="api_key"
    />
    <FormKit v-if="activityOptions.length"
             type="select"
             label="Activities"
             v-model="activity_ids"
             name="activities"
             :options="activityOptions"
             multiple
    />
    <FormKit v-if="api_key.length && activityOptions.length"
             type="submit"
             @click="save"
    />
  </div>
</template>

<script setup lang="ts">
import {useConfigStore, useDataStore} from '../stores';
import {onBeforeMount, watchEffect} from 'vue';
import {storeToRefs} from 'pinia';

const configStore = useConfigStore();
const {load, save} = configStore;
const {api_key, activity_ids} = storeToRefs(configStore);

const dataStore = useDataStore();
const {loadActivities} = dataStore;
const {activityOptions} = storeToRefs(dataStore);

onBeforeMount(async () => {
  await load();
});

watchEffect(async () => {
  if (api_key.value) {
    await loadActivities();
  }
});
</script>

<style scoped>
.wrapper {
  margin: 20px 0;
}
</style>