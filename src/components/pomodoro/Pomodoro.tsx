'use client';

import { useEffect, useState, useRef } from "react";
import PlayButton from "../assets/PlayButton";
import PauseButton from "../assets/PauseButton";
import StopButton from "../assets/StopButton";
import style from './pomodoro.module.css'
import BatteryProgressBar from "./BatteryProgressBar";
import { convertMsToTime, convertTimeToMS } from "@/utils/utils";
import toast, { Toaster } from "react-hot-toast";


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

    const pomo_vars = useRef<PomoData>({
        state: POMO_STATE.start,
        interval: {
            minutes: 25,
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
    const playButton = <PlayButton fillColor="#567794" />
    const pauseButton = <PauseButton fillColor="#567794" />
    const [pomoTime, setPomoTime] = useState('00:00');
    const [playPause, setPlayPause] = useState(playButton);
    const [progressBar, setProgressBar] = useState(<BatteryProgressBar percentageLoaded={100} />)
    const [pomoAlarm, setPomoAlarm] = useState<HTMLAudioElement | null>(null)
    const pomoInterval = useRef<null | NodeJS.Timer>(null);
    const intervalTimeInMiliseconds = convertTimeToMS(pomo_vars.current.interval.minutes, pomo_vars.current.interval.seconds);



    function startPauseResumePomodoro() {

        if (pomo_vars.current.state === POMO_STATE.running) {
            pomo_vars.current.state = POMO_STATE.paused;
            setPlayPause(playButton)
            if (pomoInterval.current)
                clearInterval(pomoInterval.current);
        }
        else {
            if (pomo_vars.current.state === POMO_STATE.start) {
                showToast("Let's work!")
                pomo_vars.current.timeRemain = JSON.parse(JSON.stringify(pomo_vars.current.interval));
                pomo_vars.current.timeRemain.totalInMiliseconds =
                    convertTimeToMS(pomo_vars.current.timeRemain.minutes, pomo_vars.current.timeRemain.seconds);
                pomo_vars.current.timeElapsed.miliseconds = 0;
            }
            pomo_vars.current.lastUpdateTimestamp = new Date().getTime();

            pomo_vars.current.state = POMO_STATE.running;

            setPlayPause(pauseButton)

            pomoInterval.current = setInterval(updatePomodoro, 250);
        }
    }



    function stopPomodoro() {

        pomo_vars.current.state = POMO_STATE.start;
        if (pomoAlarm) {
            pomoAlarm.pause();
            pomoAlarm.currentTime = 0;
        }
        if (!pomo_vars.current.interval) return;
        pomo_vars.current.timeRemain = JSON.parse(JSON.stringify(pomo_vars.current.interval));
        if (pomoInterval.current) clearInterval(pomoInterval.current);

        const timeRemain = getTimeRemainAsString();
        setPomoTime(timeRemain)

        setPlayPause(playButton)

        updateProgressBar(100)
    }



    function updateProgressBar(percentage?: number) {
        let finalPercentageValue = (percentage) ? percentage : undefined;
        if (!finalPercentageValue) {
            const remainingTime = intervalTimeInMiliseconds - pomo_vars.current.timeElapsed.miliseconds;
            const remainingPercentage = (remainingTime / intervalTimeInMiliseconds) * 100;
            const remainingPercentageRounded = Math.round(remainingPercentage * 100) / 100;
            finalPercentageValue = remainingPercentageRounded;
        }

        setProgressBar(<BatteryProgressBar percentageLoaded={finalPercentageValue} />);
    }


    function updateTimeRemain() {

        let elapsedTimeSinceLastUpdate = new Date().getTime() - pomo_vars.current.lastUpdateTimestamp;
        let elapsedTimeUpdatedMs =
            elapsedTimeSinceLastUpdate + pomo_vars.current.timeElapsed.miliseconds;

        pomo_vars.current.timeElapsed.miliseconds = elapsedTimeUpdatedMs;

        let timeRemainMs = pomo_vars.current.timeRemain.totalInMiliseconds - elapsedTimeUpdatedMs;
        let timeRemain = convertMsToTime(timeRemainMs);

        pomo_vars.current.timeRemain.minutes = timeRemain.minutes;
        pomo_vars.current.timeRemain.seconds = timeRemain.seconds;

        pomo_vars.current.lastUpdateTimestamp = new Date().getTime();
    }



    function getTimeRemainAsString() {
        let min = pomo_vars.current.timeRemain.minutes.toString();
        min = (min.length === 1) ? `0${min}` : min;
        let sec = pomo_vars.current.timeRemain.seconds.toString();
        sec = (sec.length === 1) ? `0${sec}` : sec;

        return `${min}:${sec}`
    }


    function updatePomodoro() {

        if (pomo_vars.current.state !== POMO_STATE.running) {
            return;
        }

        updateTimeRemain();
        updateProgressBar();
        const timeRemain = getTimeRemainAsString() || '';
        setPomoTime(timeRemain)

        if (pomo_vars.current.timeRemain.seconds <= 0 && pomo_vars.current.timeRemain.minutes <= 0) {
            pomo_vars.current.timeRemain.seconds = 0;
            pomo_vars.current.timeRemain.minutes = 0;
            pomo_vars.current.state = POMO_STATE.ended;

            pomoAlarm?.play();
            pomoEndNotification();
            setPlayPause(pauseButton)
            if (pomoInterval.current)
                clearInterval(pomoInterval.current);
        }
        else if (pomo_vars.current.state === POMO_STATE.paused)
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


    useEffect(() => {

        setPomoAlarm(new Audio(alarmFilePath));
        const tmpCurrentInterval = { ...structuredClone(pomo_vars.current.interval), totalInMiliseconds: 0 };
        pomo_vars.current.timeRemain = tmpCurrentInterval;

        const timeRemain = getTimeRemainAsString();
        setPomoTime(timeRemain);

        requestNotificatinoPermission();
        setPlayPause(playButton)

    }, []);


    return (
        <div className={style.pomoCard}>
            <h1>POMODORO</h1>
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
        </div>
    )
}

export default Pomodoro;