export type CGStatus = {
    inProgress: boolean
    loaded: boolean
}
export type CGStatusByKey = { [key: string]: CGStatus }

export type CGError = {
    isError: boolean
    error?: Error
}
export type CGErrorByKey = { [key: string]: CGError }
