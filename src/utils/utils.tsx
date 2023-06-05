

export function convertMsToTime(miliseconds: number) {
    if (miliseconds <= 0)
        return {
            seconds: 0,
            minutes: 0
        }

    let mins = Math.floor(miliseconds / 60000)
    let secs = Math.floor((miliseconds % 60000) / 1000);

    return (secs === 60) ? {
        seconds: 0,
        minutes: mins + 1
    } : {
        seconds: secs,
        minutes: mins
    }
}


export function convertTimeToMS(minutes: number, seconds: number): number {
    return (minutes * 60000) + (seconds * 1000);
}


export function getCookieValue(name: string) {
    if (typeof window === 'undefined')
        return null

    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || null
}

export function validateEmail(email: string) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
