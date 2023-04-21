"use client"

import { useRef } from 'react';
import style from './issue.module.css'
import { gsap } from 'gsap'

const Issue = (props: {
        removeIssueOnList: Function,
        id: string,
        title: string,
        text: string
    }) => {

    const { removeIssueOnList, id, title, text } = props;
    const card = useRef<HTMLDivElement | null>(null)


    // const cardEmit = defineEmits<{
    //     (e: "removeCard", cardId: string): void;
    // }>();

    // const card = ref<HTMLElement | null>(null);

    function removeCard() {
        if (!card.current) return;

        let computed_height = window.getComputedStyle(card.current).getPropertyValue('height');
        card.current.style.height = computed_height;

        let tl = gsap.timeline();
        tl.to(card.current, { width: 0, opacity: 0, duration: 0.25, ease: "power3.inOut" });
        tl.call(() => {
            if (props.id)
            removeIssueOnList(id);
        });
    }


    return (
        <div className="card" id={id} ref={card}>
            <h1>{title}</h1>
            <span>{text}</span>
            <button onClick={removeCard}>Remove card</button>
        </div >
    )
}

export default Issue;