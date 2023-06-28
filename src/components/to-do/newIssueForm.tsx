"use client"

import { useRef } from 'react';
import style from './newIssueForm.module.css'
import { toast } from 'react-hot-toast';

export default function NewIssueForm(
    props: {
        createIssueOnList: Function
    }) {

    const { createIssueOnList } = props;
    const titleInput = useRef<HTMLInputElement | null>(null);
    const textInput = useRef<HTMLInputElement | null>(null);
    const urlInput = useRef<HTMLInputElement | null>(null);


    function createCard(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const name = (titleInput.current?.value !== '') ? titleInput.current?.value : null
        if (!name) {
            toast.error('Add a titlte to the task')
            return
        }

        const description = (textInput.current?.value !== '') ? textInput.current?.value : '';

        createIssueOnList(name, description)
        clearInputs();
    }

    function clearInputs() {
        if (titleInput.current) titleInput.current.value = '';
        if (textInput.current) textInput.current.value = '';
    }

    return (
        <form className={style.newCardForm} onSubmit={createCard}>
            <div className={style.fieldWrapper}>
                <input type="text" ref={titleInput} id="todo-form-title-field" placeholder=" " autoComplete="off" />
                <label htmlFor="todo-form-title-field" className={style.todoFormLabel}>Task title</label>
            </div>
            <div className={style.fieldWrapper}>
                <input type="text" ref={textInput} id="todo-form-text-field" placeholder=" " autoComplete="off" />
                <label htmlFor="todo-form-text-field" className={style.todoFormLabel}>Task description</label>
            </div>
            <button type='submit'>Add task</button>
        </form>
    )
}