export interface ChildIssue {
    id: number
}

export interface Issue extends ChildIssue {
    id: number
    parent: {
        id: number
    },
    total_estimated_hours: number,
    children: undefined|ChildIssue[]
}

export type TimeEntry = {
    id: number
    issue: {
        id: number
    },
    user: {
        id: number
        name: string
    },
    activity: {
        id: number
        name: string
    },
    hours: number
}

export type Project = {
    id: number
    name: string
}

export type Activity = {
    id: number
    name: string
}

export type User = {
    id: number,
}

export type Config = {
    api_key: string,
    activity_ids: number[],
    saved: boolean
}
