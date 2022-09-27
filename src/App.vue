<script setup lang="ts">
import {computed, inject, onBeforeMount, ref} from 'vue';
import {GM} from '$';
import * as _ from 'lodash';

type Issue = {
  id: number,
  status: {
    name: string
  },
  parent: {
    id: number
  },
  subject: string
  estimated_hours: number,
}


type TimeEntry = {
  issue: {
    id: number
  },
  user: {
    id: number,
    name: string
  },
  activity: {
    id: number,
    name: string
  },
  hours: number,
}


const issue_id: number = parseInt((new RegExp(`issues/(?<id>\\d+)`, '')).exec(window.location.href)?.groups?.id || '0');

const headers = {
  'X-Redmine-API-Key': inject('api_key') as string,
};

const estimated_hours = ref(0);
const spent_hours_cur = ref(0);
const spent_hours_sub = ref(0);
const loaded = ref(false);

const spent_hours = computed(() => spent_hours_cur.value + spent_hours_sub.value);
const left_hours = computed(() => Math.max(estimated_hours.value - spent_hours.value, 0));

const rmReq = async (url: string): Promise<object> => new Promise(async (resolve, reject) => {
  GM.xmlHttpRequest({
    url,
    headers,
    responseType: 'json',
    onload: (res) => (res.status === 200) ? resolve(res.response as object) : reject(),
  });
});

const rmIssue = async (id: number): Promise<Issue> =>
    (await rmReq(`/issues/${id}.json`) as { issue: Issue }).issue;

const rmIssues = async (id: number): Promise<Issue[]> =>
    (await rmReq(`/issues.json?parent_id=${id}&amp;limit=100`) as { issues: Issue[] }).issues;

const rmTimeEn = async (id: number): Promise<TimeEntry[]> =>
    (await rmReq(`/time_entries.json?issue_id=${id}&amp;limit=100`) as { time_entries: TimeEntry[] }).time_entries;

const toTime = (hours: number): string => Math.trunc(hours).toString().padStart(2, '0') + ':' + Math.round(hours * 60 % 60).toString().padStart(2, '0');

const sumDevHours = (entries: TimeEntry[]): number =>
    entries
        .filter((entry: TimeEntry) => entry.activity.id === 9)
        .reduce((sum: number, entry: TimeEntry) => sum + entry.hours, 0);

onBeforeMount(async () => {
  estimated_hours.value = (await rmIssue(issue_id)).estimated_hours;

  if (estimated_hours.value > 0) {
    const ids: number[] = [issue_id, ...(await rmIssues(issue_id)).map((issue: Issue) => issue.id)];
    const entries = _.flatten(await Promise.all(ids.map(id => rmTimeEn(id))));
    [spent_hours_cur.value, spent_hours_sub.value] = _.partition(entries, (entry: TimeEntry) => entry.issue.id === issue_id).map(sumDevHours);
  }

  loaded.value = true;
});


</script>

<template>
  <div v-if="estimated_hours">
    <template v-if="loaded">
      <span class="cur">{{ toTime(spent_hours_cur) }}</span>
      <span>+</span>
      <span class="sub">{{ toTime(spent_hours_sub) }}</span>
      <span>=</span>
      <span class="spent">{{ toTime(spent_hours) }}</span>
      <span>/</span>
      <span class="left">{{ toTime(left_hours) }}</span>
    </template>
    <span v-else>Loading...</span>
  </div>
</template>

<style scoped>
div {
  height: 50px;
  display: flex;
  align-items: center;
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
  color: orange;;
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
</style>
