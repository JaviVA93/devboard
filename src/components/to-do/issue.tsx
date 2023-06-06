"use client"

import { useRef } from 'react';
import style from './issue.module.css'
import { gsap } from 'gsap'
import Trash2Svg from '../assets/Trash2Svg';
import DoneSvg from '../assets/DoneSvg';

const Issue = (props: {
    removeIssueOnList: Function,
    id: string,
    title: string,
    text: string
}) => {

    const { removeIssueOnList, id, title, text } = props;
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


    function markCardAsCompleted() {
        if (!card.current) return;
    }


    return (
        <div className={style.card} id={id} ref={card}>
            <h1>{title}</h1>
            <span>{text}</span>
            <div className={style.ctasWrapper}>
                <button className={style.removeBtn} onClick={removeCard}>
                    <Trash2Svg />
                </button>
                <button className={style.completeBtn} onClick={markCardAsCompleted}>
                    <DoneSvg />
                </button>
            </div>
        </div >
    )
}

export default Issue;