

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

function padZero(str: string, len=2) {
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

export function invertColor(hexColor: string, blackWhiteResult: boolean) {
    if (hexColor.indexOf('#') === 0) {
        hexColor = hexColor.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hexColor.length === 3) {
        hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2];
    }
    if (hexColor.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    let rInt = parseInt(hexColor.slice(0, 2), 16),
        gInt = parseInt(hexColor.slice(2, 4), 16),
        bInt = parseInt(hexColor.slice(4, 6), 16);
    console.warn('test')
    if (blackWhiteResult) {
        // https://stackoverflow.com/a/3943023/112731
        return (rInt * 0.299 + gInt * 0.587 + bInt * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    let r = (255 - rInt).toString(16),
    g = (255 - gInt).toString(16),
    b = (255 - bInt).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
