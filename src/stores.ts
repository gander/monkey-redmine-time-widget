import {defineStore} from 'pinia';
import {GM} from '$';
import {Activity, Config, Issue, Project, TimeEntry, User} from './types';

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
        entries: [] as TimeEntry[],
    }),
    getters: {
        hoursEst({current_issue}): number {
            return current_issue?.estimated_hours || 0;
        },

        hoursCur({entries, current_issue}): number {
            const {activity_ids} = useConfigStore();
            return entries
                .filter(({issue}) => issue.id === current_issue?.id)
                .filter(({activity}) => activity_ids.includes(activity.id))
                .reduce((sum: number, {hours}) => sum + hours, 0);
        },
        hoursSub({entries, current_issue}): number {
            const {activity_ids} = useConfigStore();

            return entries
                .filter(({issue}) => issue.id !== current_issue?.id)
                .filter(({activity}) => activity_ids.includes(activity.id))
                .reduce((sum: number, {hours}) => sum + hours, 0);
        },
        hoursSpent(): number {
            // @ts-ignore
            return this.hoursCur + this.hoursSub;
        },
        hoursLeft({current_issue}): number {
            return Math.max((current_issue?.estimated_hours || 0) - this.hoursSpent, 0);
        },
        hoursOver({current_issue}): number {
            return Math.abs(Math.min((current_issue?.estimated_hours || 0) - this.hoursSpent, 0));
        },
        activityOptions({activities}): { label: string, value: number }[] {
            return activities.map(({id, name}) => ({label: name, value: id}));
        },
    },
    actions: {
        async addTimeEntry(...entries: TimeEntry[]) {
            entries.forEach(entry => this.entries[entry.id] = entry);
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

        async getIssue(issue_id: number): Promise<Issue> {
            return (await this.makeRequest(`/issues/${issue_id}.json`) as { issue: Issue }).issue;
        },

        async getSubIssues(parent_id: number): Promise<Issue[]> {
            return (await this.makeRequest(`/issues.json?parent_id=${parent_id}&amp;limit=100`) as { issues: Issue[] }).issues;
        },

        async getMyAccountId(): Promise<number> {
            return (await this.makeRequest(`/my/account.json`) as { user: { id: number } }).user.id;
        },

        async getProjects(): Promise<Project[]> {
            return (await this.makeRequest(`/projects.json`) as { projects: Project[] })
                .projects
                .map(({id, name}) => ({id, name}));
        },

        async getActivities(): Promise<Activity[]> {
            return (await this.makeRequest(`/enumerations/time_entry_activities.json`) as { time_entry_activities: Activity[] }).time_entry_activities;
        },

        async loadActivities() {
            this.$patch({activities: await this.getActivities()});
        },

        async getProjectTimeEntries(): Promise<TimeEntry[]> {
            return [];
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



