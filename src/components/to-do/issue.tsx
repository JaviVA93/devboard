"use client"

import { useRef, useState } from 'react';
import style from './issue.module.css'
import { gsap } from 'gsap'
import Trash2Svg from '../assets/Trash2Svg';
import DoneSvg from '../assets/DoneSvg';
import UndoSvg from '../assets/UndoSvg';
import PencilSvg from '../assets/PencilSvg';
import CrossSvg from '../assets/CrossSvg';
import CheckSvg from '../assets/CheckSvg';
import Linkify from "linkify-react";

const Issue = (props: {
    removeIssueOnList: (card_id: string) => void,
    updateTaskStatus: (taskId: string, isCompleted: boolean) => void,
    updateTaskContent: (id: string, name: string, description: string) => void,
    id: string,
    name: string,
    description: string,
    isDone: boolean
}) => {

    const { removeIssueOnList,
        updateTaskStatus,
        updateTaskContent,
        id,
        name,
        description,
        isDone } = props
    const [isEditing, setIsEditing] = useState(false)
    const card = useRef<HTMLDivElement | null>(null)
    const [taskTitle, setTaskTitle] = useState(name)
    const [taskDescription, setTaskDescription] = useState(description)
    const titleInput = useRef<HTMLInputElement | null>(null)
    const descriptionInput = useRef<HTMLInputElement | null>(null)


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


    function updateContent() {
        if (!titleInput.current || !descriptionInput.current)
            return

        const updatedName = titleInput.current.value;
        const updatedDescription = descriptionInput.current.value


        if (updatedName !== taskTitle || updatedDescription !== taskDescription) {
            setTaskTitle(updatedName)
            setTaskDescription(updatedDescription)

            updateTaskContent(id, updatedName, updatedDescription)
        }

        setIsEditing(false)
    }



    if (!isEditing) {
        return (
            <div className={(isDone) ? `${style.card} ${style.cardDone}` : style.card} id={id} ref={card}>
                <h1>{taskTitle}</h1>
                {/* <span> */}
                <Linkify as="span" options={{target: '_blank'}}>
                    {taskDescription}
                </Linkify>
                {/* </span> */}
                {!isDone
                    ? <div className={style.ctasWrapper}>
                        <div className={style.btnsLeftSide}>
                            <button className={style.removeBtn} onClick={removeCard}>
                                <Trash2Svg />
                            </button>
                            <button className={style.editBtn} onClick={() => setIsEditing(true)}>
                                <PencilSvg className={style.pencil} />
                            </button>
                        </div>
                        <button className={style.completeBtn} onClick={() => updateTaskStatus(id, true)}>
                            <DoneSvg />
                        </button>
                    </div>
                    : <div className={`${style.ctasWrapper} ${style.ctasWrapperDone}`}>
                        <button className={style.removeBtn} onClick={removeCard}>
                            <Trash2Svg />
                        </button>
                        <button className={style.undoBtn} onClick={() => updateTaskStatus(id, false)}>
                            <UndoSvg />
                        </button>
                    </div>
                }
            </div>
        )
    }
    else {
        return (
            <div className={`${style.card} ${style.editingCard}`} id={id} ref={card}>
                <div className={style.nameInput}>
                    <label htmlFor={`${id}-taskName`}></label>
                    <input id={`${id}-taskName`} type='text' defaultValue={taskTitle} ref={titleInput} />
                </div>
                <div className={style.descriptionInput}>
                    <label htmlFor={`${id}-taskDescription`}></label>
                    <input id={`${id}-taskDescription`} type='text' defaultValue={taskDescription} ref={descriptionInput} />
                </div>
                <div className={`${style.ctasWrapper} ${style.ctasWrapperEditing}`}>
                    <button className={style.rejectChangesBte} onClick={() => setIsEditing(false)}>
                        <CrossSvg />
                    </button>
                    <button className={style.acceptChangesBte} onClick={updateContent}>
                        <CheckSvg />
                    </button>
                </div>
            </div>
        )
    }
}

export default Issue;