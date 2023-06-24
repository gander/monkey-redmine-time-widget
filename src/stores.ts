import {defineStore} from 'pinia';
import {GM} from '$';
import {Activity, Config, Issue, TimeEntry, User} from './types';
import TimeRecord, {getSeconds} from './classes/TimeRecord';

export const useConfigStore = defineStore('config', {
    state: (): Config & { loaded: boolean } => ({
        loaded: false,
        saved: false,
        api_key: '',
        activity_ids: [],
    }),
    getters: {
        headers({api_key}): { [key: string]: string } {
            return {'X-Redmine-API-Key': api_key};
        },
        setupNeeded(s): boolean {
            return !s.saved || !s.api_key.length || !s.activity_ids.length;
        },
        setupValid(s): boolean {
            return s.api_key.length > 0 && s.activity_ids.length > 0;
        },
        saveData(s): Config {
            return {
                saved: s.saved,
                api_key: s.api_key,
                activity_ids: s.activity_ids,
            };
        },

    },
    actions: {
        async load(): Promise<void> {
            const config = await GM.getValue('config', {
                api_key: '',
                activity_ids: [],
                saved: false,
            });

            this.$patch({...config, loaded: true});
        },

        async save(): Promise<void> {
            if (this.setupValid) {
                this.$patch({saved: true});
                await GM.setValue('config', this.saveData);
            }
        },

        async reset(): Promise<void> {
            await GM.deleteValue('config');
            this.$reset();
            useDataStore().$reset();
            await this.load();
        },
    },
});

export const useDataStore = defineStore('data', {
    state: () => ({
        loading: true,
        current_user: null as User | null,
        current_issue: null as Issue | null,
        activities: [] as Activity[],
        records: [] as TimeRecord[],
    }),
    getters: {
        timeEst(s): number {
            return getSeconds(s.current_issue?.total_estimated_hours || 0);
        },

        timeCur(s): number {
            const {activity_ids} = useConfigStore();

            return s.records
                .filter((r: TimeRecord): boolean => s.current_issue !== null && (r.issueId === s.current_issue.id))
                .filter((r: TimeRecord): boolean => activity_ids.includes(r.activityId))
                .reduce((sum: number, r: TimeRecord): number => sum + r.seconds, 0);
        },

        timeSub(s): number {
            const {activity_ids} = useConfigStore();

            return s.records
                .filter((r: TimeRecord): boolean => s.current_issue !== null && (r.issueId !== s.current_issue.id))
                .filter((r: TimeRecord): boolean => activity_ids.includes(r.activityId))
                .reduce((sum: number, r: TimeRecord): number => sum + r.seconds, 0);
        },

        hasSub(s): boolean {
            return s.records.filter((r: TimeRecord) => r.issueId !== s.current_issue?.id).length > 0;
        },

        timeSpent(): number {
            return this.timeCur + this.timeSub;
        },

        timeLeft(s): number {
            return Math.max((getSeconds(s.current_issue?.total_estimated_hours || 0)) - this.timeSpent, 0);
        },

        timeOver(s): number {
            return Math.abs(Math.min(getSeconds(s.current_issue?.total_estimated_hours || 0) - this.timeSpent, 0));
        },

        activityOptions(s): { label: string, value: number }[] {
            return s.activities.map(({id, name}) => ({label: name, value: id}));
        },
    },

    actions: {
        async addTimeEntry(...entries: TimeEntry[]) {
            entries.forEach(entry => {
                this.records[entry.id] = new TimeRecord(entry);
            });
        },

        async makeRequest(url: string) {
            const {headers} = useConfigStore();
            return new Promise(async (resolve, reject) => {
                GM.xmlHttpRequest({
                    url,
                    // @ts-ignore
                    headers,
                    responseType: 'json',
                    onload: (res) => (res.status === 200) ? resolve(res.response as object) : reject(),
                });
            });
        },

        async init(): Promise<void> {
            if (useConfigStore().setupNeeded) {
                return;
            }

            const current_issue = await this.getCurrentIssue();
            await this.loadTimeEntries(current_issue.id);
            this.$patch({current_issue, loading: false});
        },

        async getCurrentIssue(): Promise<Issue> {
            return (await this.makeRequest((new URL(window.location.href)).pathname + `.json`) as { issue: Issue }).issue;
        },

        async getSubIssues(parent_id: number): Promise<Issue[]> {
            return (await this.makeRequest(`/issues.json?parent_id=${parent_id}&amp;limit=100`) as { issues: Issue[] }).issues;
        },

        async getActivities(): Promise<Activity[]> {
            return (await this.makeRequest(`/enumerations/time_entry_activities.json`) as { time_entry_activities: Activity[] }).time_entry_activities;
        },

        async loadActivities() {
            this.$patch({activities: await this.getActivities()});
        },

        async getIssueTimeEntries(issue_id: number): Promise<TimeEntry[]> {
            return (await this.makeRequest(`/time_entries.json?issue_id=${issue_id}&amp;limit=100`) as { time_entries: TimeEntry[] }).time_entries;
        },

        async loadTimeEntries(issue_id: number): Promise<void> {
            await this.addTimeEntry(...(await this.getIssueTimeEntries(issue_id)));
            await Promise.all(
                (await this.getSubIssues(issue_id)).map(issue => this.loadTimeEntries(issue.id)),
            );
        },
    },

});



