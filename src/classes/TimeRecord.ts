import {TimeEntry} from '../types';

export function getSeconds(hours: number): number {
    return hours * 60 * 60;
}

export function getMinutes(hours: number, rounded: boolean = false): number {
    return rounded ? Math.round(hours * 60) : hours * 60;
}

export default class TimeRecord {
    public readonly id: number;
    public readonly issueId: number;
    public readonly userId: number;
    public readonly activityId: number;
    public readonly hours: number;
    public readonly seconds: number;
    public readonly diff: number;
    public readonly income: null | boolean;

    constructor(entry: TimeEntry) {
        this.id = entry.id;
        this.issueId = entry.issue.id;
        this.userId = entry.user.id;
        this.activityId = entry.activity.id;
        this.hours = entry.hours;
        this.seconds = getSeconds(entry.hours);
        this.diff = getMinutes(entry.hours, false) - getMinutes(entry.hours, true);
        this.income = this.diff === 0 ? null : this.diff > 0;
    }
}
