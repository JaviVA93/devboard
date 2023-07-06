'use client';

import { useEffect, useState, useRef } from "react";
import PlayButton from "../assets/PlayButton";
import PauseButton from "../assets/PauseButton";
import StopButton from "../assets/StopButton";
import style from './pomodoro.module.css'
import BatteryProgressBar from "./BatteryProgressBar";
import { convertMsToTime, convertTimeToMS } from "@/utils/utils";
import toast, { Toaster } from "react-hot-toast";
import SettingsSvg from "../assets/SettingsSvg";


type PomoData = {
    state: string,
    interval: {
        minutes: number,
        seconds: number,
    },
    timeRemain: {
        seconds: number,
        minutes: number,
        totalInMiliseconds: number,
    },
    timeElapsed: {
        miliseconds: number,
    },
    lastUpdateTimestamp: number,
}

const POMO_STATE = {
    running: 'running',
    paused: 'pause',
    start: 'start',
    ended: 'ended'
}




const Pomodoro = () => {

    const alarmFilePath = '/audio/clock-alarm.mp3'

    const playButton = <PlayButton fillColor="#567794" />
    const pauseButton = <PauseButton fillColor="#567794" />
    const [pomoTime, setPomoTime] = useState('00:00');
    const [playPause, setPlayPause] = useState(playButton);
    const [progressBar, setProgressBar] = useState(<BatteryProgressBar percentageLoaded={100} />)
    const [pomoAlarm, setPomoAlarm] = useState<HTMLAudioElement | null>(null)
    const [confPomoTime, setConfPomoTime] = useState<number>(25)
    const confPomoTimeSelect = useRef<HTMLSelectElement | null>(null)
    const [view, setView] = useState<'timer' | 'settings'>('timer')
    const pomoInterval = useRef<null | NodeJS.Timer>(null);
    const pomoVars = useRef<PomoData>({
        state: POMO_STATE.start,
        interval: {
            minutes: confPomoTime,
            seconds: 0,
        },
        timeRemain: {
            seconds: 0,
            minutes: 0,
            totalInMiliseconds: 0,
        },
        timeElapsed: {
            miliseconds: 0,
        },
        lastUpdateTimestamp: 0,
    });
    const intervalTimeInMiliseconds = convertTimeToMS(pomoVars.current.interval.minutes, pomoVars.current.interval.seconds);



    function startPauseResumePomodoro() {

        if (pomoVars.current.state === POMO_STATE.running) {
            pomoVars.current.state = POMO_STATE.paused;
            setPlayPause(playButton)
            if (pomoInterval.current)
                clearInterval(pomoInterval.current);
        }
        else {
            if (pomoVars.current.state === POMO_STATE.start) {
                showToast("Let's work!")
                pomoVars.current.timeRemain = JSON.parse(JSON.stringify(pomoVars.current.interval));
                pomoVars.current.timeRemain.totalInMiliseconds =
                    convertTimeToMS(pomoVars.current.timeRemain.minutes, pomoVars.current.timeRemain.seconds);
                pomoVars.current.timeElapsed.miliseconds = 0;
            }
            pomoVars.current.lastUpdateTimestamp = new Date().getTime();

            pomoVars.current.state = POMO_STATE.running;

            setPlayPause(pauseButton)

            pomoInterval.current = setInterval(updatePomodoro, 250);
        }
    }



    function stopPomodoro() {

        pomoVars.current.state = POMO_STATE.start;
        if (pomoAlarm) {
            pomoAlarm.pause();
            pomoAlarm.currentTime = 0;
        }
        if (!pomoVars.current.interval) return;
        pomoVars.current.timeRemain = JSON.parse(JSON.stringify(pomoVars.current.interval));
        if (pomoInterval.current) clearInterval(pomoInterval.current);

        const timeRemain = getTimeRemainAsString();
        setPomoTime(timeRemain)

        setPlayPause(playButton)

        updateProgressBar(100)
    }



    function updateProgressBar(percentage?: number) {
        let finalPercentageValue = (percentage) ? percentage : undefined;
        if (!finalPercentageValue) {
            const remainingTime = intervalTimeInMiliseconds - pomoVars.current.timeElapsed.miliseconds;
            const remainingPercentage = (remainingTime / intervalTimeInMiliseconds) * 100;
            const remainingPercentageRounded = Math.round(remainingPercentage * 100) / 100;
            finalPercentageValue = remainingPercentageRounded;
        }

        setProgressBar(<BatteryProgressBar percentageLoaded={finalPercentageValue} />);
    }


    function updateTimeRemain() {

        let elapsedTimeSinceLastUpdate = new Date().getTime() - pomoVars.current.lastUpdateTimestamp;
        let elapsedTimeUpdatedMs =
            elapsedTimeSinceLastUpdate + pomoVars.current.timeElapsed.miliseconds;

        pomoVars.current.timeElapsed.miliseconds = elapsedTimeUpdatedMs;

        let timeRemainMs = pomoVars.current.timeRemain.totalInMiliseconds - elapsedTimeUpdatedMs;
        let timeRemain = convertMsToTime(timeRemainMs);

        pomoVars.current.timeRemain.minutes = timeRemain.minutes;
        pomoVars.current.timeRemain.seconds = timeRemain.seconds;

        pomoVars.current.lastUpdateTimestamp = new Date().getTime();
    }



    function getTimeRemainAsString() {
        let min = pomoVars.current.timeRemain.minutes.toString();
        min = (min.length === 1) ? `0${min}` : min;
        let sec = pomoVars.current.timeRemain.seconds.toString();
        sec = (sec.length === 1) ? `0${sec}` : sec;

        return `${min}:${sec}`
    }


    function updatePomodoro() {

        if (pomoVars.current.state !== POMO_STATE.running) {
            return;
        }

        updateTimeRemain();
        updateProgressBar();
        const timeRemain = getTimeRemainAsString() || '';
        setPomoTime(timeRemain)

        if (pomoVars.current.timeRemain.seconds <= 0 && pomoVars.current.timeRemain.minutes <= 0) {
            pomoVars.current.timeRemain.seconds = 0;
            pomoVars.current.timeRemain.minutes = 0;
            pomoVars.current.state = POMO_STATE.ended;

            pomoAlarm?.play();
            pomoEndNotification();
            setPlayPause(pauseButton)
            if (pomoInterval.current)
                clearInterval(pomoInterval.current);
        }
        else if (pomoVars.current.state === POMO_STATE.paused)
            setPlayPause(playButton)
        else
            setPlayPause(pauseButton)
    }


    function getNotificationPermission() {
        return (window.Notification) ? window.Notification.permission : null;
    }


    function requestNotificatinoPermission() {
        let notifPermission = getNotificationPermission();
        if (notifPermission !== 'default')
            return;

        window.Notification.requestPermission();
    }


    function pomoEndNotification() {
        let notifPermission = getNotificationPermission();
        if (notifPermission === 'granted') {
            let notification = new Notification('Pomodoro finished! Time for a break :)');
            notification.onclick = () => {
                parent.focus();
                window.focus();
            }
        }
        showToast('Pomodoro finished! Time for a break.')
    }


    function showToast(message: string) {
        toast(message, {
            position: 'bottom-center',
            icon: '⏰',
            style: {
                fontSize: 18,
                fontWeight: 600,
                backgroundColor: '#567794',
                color: '#151b24',
                border: '1px solid #acb9b7'
            }
        });
    }


    function changePomoTimeConfig() {
        if (!confPomoTimeSelect.current)
            return

        const selectedRawValue = confPomoTimeSelect.current.value
        const numValue = parseInt(selectedRawValue)
        const lsSettings = JSON.parse(window.localStorage.getItem('pomodoro') || '{}')
        lsSettings.time = numValue
        window.localStorage.setItem('pomodoro', JSON.stringify(lsSettings))

        setConfPomoTime(numValue)

        pomoVars.current.interval.minutes = numValue
        const tmpCurrentInterval = { ...structuredClone(pomoVars.current.interval), totalInMiliseconds: 0 };
        pomoVars.current.timeRemain = tmpCurrentInterval;
        stopPomodoro();
    }


    function getLocalSettings() {
        return JSON.parse(window.localStorage.getItem('pomodoro') || '{}')
    }


    useEffect(() => {

        setPomoAlarm(new Audio(alarmFilePath));


        const settings = getLocalSettings()
        const settingsTime = settings.time || null

        if (settingsTime) {
            setConfPomoTime(settingsTime)
            pomoVars.current.interval.minutes = settingsTime
        }

        const tmpCurrentInterval = { ...structuredClone(pomoVars.current.interval), totalInMiliseconds: 0 };
        pomoVars.current.timeRemain = tmpCurrentInterval;

        const timeRemain = getTimeRemainAsString();
        setPomoTime(timeRemain);

        requestNotificatinoPermission();
        setPlayPause(playButton)

    }, []);


    function getViewToRender() {
        if (view === 'timer') {
            return (
                <>
                    <div className={style.midWrapper}>
                        <span className={style.pomoTime}>{pomoTime}</span>
                        {progressBar}
                    </div>
                    <div className={style.pomoBtnsWrapper}>
                        <button className={style.pomoButton} onClick={e => startPauseResumePomodoro()} aria-label="Start pomodoro">
                            {playPause}
                        </button>
                        <button className={style.pomoButton} onClick={e => stopPomodoro()} aria-label="Stop pomodoro">
                            <StopButton fillColor="#567794" />
                        </button>
                    </div>
                </>
            )
        }
        else {
            return (
                <div className={style.settingsPomoTime}>
                    <span>Pomodoro Time</span>
                    <select ref={confPomoTimeSelect} name="pomodoro time" onChange={changePomoTimeConfig} value={confPomoTime}>
                        <option value="25">25 minutes</option>
                        <option value="40">40 minutes</option>
                        <option value="60">60 minutes</option>
                    </select>
                </div>
            )
        }
    }


    return (
        <div className={style.pomoCard}>
            <header>
                <h1>POMODORO</h1>
                <button type="button" className={style.settingsBtn} onClick={() => (view === 'timer') ? setView('settings') : setView('timer')}>
                    <SettingsSvg className={style.settingsSvg} />
                </button>
            </header>
            {getViewToRender()}
        </div>
    )
}

export default Pomodoro;