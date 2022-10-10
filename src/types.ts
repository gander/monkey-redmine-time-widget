export type Issue = {
    id: number
    parent: {
        id: number
    },
    estimated_hours: number
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