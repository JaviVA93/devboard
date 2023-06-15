"use client"

import { useRef } from 'react';
import style from './issue.module.css'
import { gsap } from 'gsap'
import Trash2Svg from '../assets/Trash2Svg';
import DoneSvg from '../assets/DoneSvg';
import { setTodoAsDone, setTodoAsNotDone, useLoggedUser } from '@/utils/supabase';
import UndoSvg from '../assets/UndoSvg';
import { toast } from 'react-hot-toast';

const Issue = (props: {
    removeIssueOnList: Function,
    updateTasks: Function,
    updateTaskStatus: Function,
    id: string,
    title: string,
    text: string,
    isDone: boolean
}) => {

    const { removeIssueOnList, id, title, text } = props;
    const card = useRef<HTMLDivElement | null>(null)
    const logged = useLoggedUser()

    function removeCard() {
        if (!card.current) return;

        let computed_height = window.getComputedStyle(card.current).getPropertyValue('height');
        card.current.style.height = computed_height;

        let tl = gsap.timeline();
        tl.to(card.current, { width: 0, opacity: 0, duration: 0.25, ease: "power3.inOut" });
        tl.call(() => {
            if (props.id)
                removeIssueOnList(id);
            tl.kill();
        });

    }


    function markCardAsCompleted() {
        if (!card.current) return;

        // CONTROL THE BEHAVIOR IF THE USER IS NOT LOGGED
        
        // IF THE USER IS LOGGED THEN
        if (logged && logged !== 'loading')
            setTodoAsDone(props.id).then(r => {
                // REFRESH THE TASKS AFTER THE UPDATE
                if (r.error) {
                    toast.error('Error updating the task status')
                    return
                }
                
                props.updateTasks()
            })

        // ELSE
        // IF IS NOT LOGGED THEN, UPDATE THE TASK LOCALLY
        else {

        }
    }

    function markCardAsIncompleted() {
        if (!card.current) return;


        // CONTROL THE BEHAVIOR IF THE USER IS NOT LOGGED
        
        // IF THE USER IS LOGGED THEN
        setTodoAsNotDone(props.id).then(r => {
            // REFRESH THE TASKS AFTER THE UPDATE
            if (r.error) {
                toast.error('Error updating the task status')
                return
            }

            props.updateTasks()
        })

        // ELSE
        // IF IS NOT LOGGED THEN, UPDATE THE TASK LOCALLY
    }


    return (
        <div className={(props.isDone) ? `${style.card} ${style.cardDone}` : style.card} id={id} ref={card}>
            <h1>{title}</h1>
            <span>{text}</span>
            {!props.isDone
                ? <div className={style.ctasWrapper}>
                    <button className={style.removeBtn} onClick={removeCard}>
                        <Trash2Svg />
                    </button>
                    <button className={style.completeBtn} onClick={() => props.updateTaskStatus(id, true)}>
                        <DoneSvg />
                    </button>
                </div>
                : <div className={style.ctasWrapper}>
                    <button className={style.undoBtn} onClick={() => props.updateTaskStatus(id, false)}>
                        <UndoSvg />
                    </button>
                </div>
            }
        </div >
    )
}

export default Issue;