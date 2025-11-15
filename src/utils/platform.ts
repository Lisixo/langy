// TODO
export default function getCurrentPlatform() {
    if(navigator.userAgent.indexOf("Mac") != -1) return Platform.MacOS
    return Platform.Unknown
}

export enum Platform {
    Windows,
    Linux,
    MacOS,
    Unknown
}