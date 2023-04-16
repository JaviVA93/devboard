'use client';

import { useEffect, useState, useRef } from "react";
import PlayButton from "../assets/PlayButton";
import PauseButton from "../assets/PauseButton";
import StopButton from "../assets/StopButton";
import style from './pomodoro.module.css'


type PomoData = {
    status: string,
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

/////////////////////////////
// USING AN ARROW FUNCTION DUE TO AN ERROR WITH NEXTJS VERSION 13.3 (ON CLIENT SIDE COMPONENTS 'USE CLIENT')
/////////////////////////////
const Pomodoro = () => {

    const alarmFilePath = '/clock-alarm.mp3'

    const pomo_vars = useRef({
        status: '',
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
    const playButton = <PlayButton fillColor="#2c3e50" />
    const [pomoTime, setPomoTime] = useState('');
    const [playPause, setPlayPause] = useState(playButton);
    const pomoInterval = useRef<null | NodeJS.Timer>(null);
    
    const pomoAlarm = new Audio(alarmFilePath);


    
    function startPauseResumePomodoro() {

        if (pomo_vars.current.status === 'running') {
            pomo_vars.current.status = 'pause';
            setPlayPause(playButton)
            if (pomoInterval.current) 
                clearInterval(pomoInterval.current);
        }
        else {
            if (pomo_vars.current.status !== 'pause') {
                pomo_vars.current.timeRemain = JSON.parse(JSON.stringify(pomo_vars.current.interval));
                pomo_vars.current.timeRemain.totalInMiliseconds = 
                    convertTimeToMS(pomo_vars.current.timeRemain.minutes, pomo_vars.current.timeRemain.seconds);
                pomo_vars.current.timeElapsed.miliseconds = 0;
            }
            pomo_vars.current.lastUpdateTimestamp = new Date().getTime();
    
            pomo_vars.current.status = 'running';
    
            // setPlayPauseButtonBackground('pause');
            setPlayPause(<PauseButton />)
    
            pomoInterval.current = setInterval(updatePomodoro, 250);
        }
    }
    
    function stopPomodoro() {
        
        pomo_vars.current.status = 'stop';
        pomoAlarm.pause();
        pomoAlarm.currentTime = 0;
        if (!pomo_vars.current.interval) return;
        pomo_vars.current.timeRemain = JSON.parse(JSON.stringify(pomo_vars.current.interval));
        if (pomoInterval.current) clearInterval(pomoInterval.current);
    
        const timeRemain = getTimeRemainAsString();
        setPomoTime(timeRemain)
    
        setPlayPause(playButton)
    }
    
    function convertMsToTime(miliseconds: number) {
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
    
    function convertTimeToMS(minutes: number, seconds: number): number {
        return (minutes * 60000) + (seconds * 1000);
    }
    
    function calculateTimeRemain() {

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

        if (pomo_vars.current.status === 'pause' || pomo_vars.current.status === 'stop' || pomo_vars.current.status === 'end') {
            return;
        }
    
        calculateTimeRemain();
        const timeRemain = getTimeRemainAsString() || '';
        setPomoTime(timeRemain)
        // printTime();
    
        if (pomo_vars.current.timeRemain.seconds <= 0 && pomo_vars.current.timeRemain.minutes <= 0) {
            pomo_vars.current.timeRemain.seconds = 0;
            pomo_vars.current.timeRemain.minutes = 0;
            pomo_vars.current.status = 'end';
    
            pomoAlarm.play();
            pomoEndNotification();
            // setPlayPauseButtonBackground('play');
            setPlayPause(<PauseButton />)
            if (pomoInterval.current) 
                clearInterval(pomoInterval.current);
        }
        else if (pomo_vars.current.status === 'pause')
            // setPlayPauseButtonBackground('play');
            setPlayPause(playButton)
        else
            // setPlayPauseButtonBackground('pause');
            setPlayPause(<PauseButton />)
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
    }
    

    useEffect(() => {
        pomo_vars.current.timeRemain = JSON.parse(JSON.stringify(pomo_vars.current.interval));

        const timeRemain = getTimeRemainAsString();
        setPomoTime(timeRemain);

        requestNotificatinoPermission();
        setPlayPause(playButton)
    }, []);


    return (
        <div className={style.pomoCard}>
            <h1>POMODORO</h1>
            <span className={style.pomoTime}>{pomoTime}</span>
            <div className={style.pomoBtnsWrapper}>
                <button className={style.pomoButton} onClick={e => startPauseResumePomodoro()} aria-label="Start pomodoro">
                    {playPause}
                </button>
                <button className={style.pomoButton} onClick={e => stopPomodoro()} aria-label="Stop pomodoro">
                    <StopButton fillColor="#2c3e50"/>
                </button>
            </div>
        </div>
    )
}

export default Pomodoro;