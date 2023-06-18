"use client"

import { useRef } from 'react';
import style from './issue.module.css'
import { gsap } from 'gsap'
import Trash2Svg from '../assets/Trash2Svg';
import DoneSvg from '../assets/DoneSvg';
import UndoSvg from '../assets/UndoSvg';

const Issue = (props: {
    removeIssueOnList: Function,
    updateTasks: Function,
    updateTaskStatus: Function,
    id: string,
    title: string,
    text: string,
    isDone: boolean
}) => {

    const { removeIssueOnList, id, title, text } = props
    const card = useRef<HTMLDivElement | null>(null)

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
                : <div className={`${style.ctasWrapper} ${style.ctasWrapperDone}`}>
                    <button className={style.removeBtn} onClick={removeCard}>
                        <Trash2Svg />
                    </button>
                    <button className={style.undoBtn} onClick={() => props.updateTaskStatus(id, false)}>
                        <UndoSvg />
                    </button>
                </div>
            }
        </div >
    )
}

export default Issue;