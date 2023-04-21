"use client"

import { useRef } from 'react';
import style from './newIssueForm.module.css'

export default function NewIssueForm(
    props: {
        createIssueOnList: Function
    }) {

    const { createIssueOnList } = props;
    const titleInput = useRef<HTMLInputElement | null>(null);
    const textInput = useRef<HTMLInputElement | null>(null);
    const urlInput = useRef<HTMLInputElement | null>(null);


    function createCard() {

        let title = (titleInput.current?.value !== '') ? titleInput.current?.value : 'title not set';

        let text = (textInput.current?.value !== '') ? textInput.current?.value : 'Text not set';

        createIssueOnList(title, text);
        clearInputs();
    }

    function clearInputs() {
        if (titleInput.current) titleInput.current.value = '';
        if (textInput.current) textInput.current.value = '';
    }

    return (
        <div className={style.newCardForm}>
            <div className={style.fieldWrapper}>
                <input type="text" ref={titleInput} id="todo-form-title-field" placeholder=" " />
                <label htmlFor="todo-form-title-field" className={style.todoFormLabel}>Task title</label>
            </div>
            <div className={style.fieldWrapper}>
                <input type="text" ref={textInput} id="todo-form-text-field" placeholder=" " />
                <label htmlFor="todo-form-text-field" className={style.todoFormLabel}>Task description</label>
            </div>
            <button onClick={createCard}>Add task</button>
        </div>
    )
}