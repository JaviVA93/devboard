"use client"


import { useRef } from 'react';
import style from './loginPage.module.css'
import GithubLoginMenuItem from '@/components/github-login/GithubLoginMenuItem';

export default function LoginPage() {

    const emailInput = useRef<HTMLInputElement | null>(null);

    return (
        <section className={style.section}>
            <div className={style.leftSide}>
                <form className={style.loginForm}>
                    <div className={style.fieldWrapper}>
                        <input type="text" ref={emailInput} id="todo-form-text-field" placeholder=" " />
                        <label htmlFor="todo-form-text-field" className={style.todoFormLabel}>Email</label>
                    </div>
                    <div className={style.fieldWrapper}>
                        <input type="text" ref={emailInput} id="todo-form-text-field" placeholder=" " />
                        <label htmlFor="todo-form-text-field" className={style.todoFormLabel}>Password</label>
                    </div>
                    <button type='button'>Login</button>
                </form>
                <div className={style.socialLoginContainer}>
                    <GithubLoginMenuItem />
                </div>
            </div>
            <div className={style.rightSide}>
                <form className={style.loginForm}>
                    <div className={style.fieldWrapper}>
                        <input type="text" ref={emailInput} id="todo-form-text-field" placeholder=" " />
                        <label htmlFor="todo-form-text-field" className={style.todoFormLabel}>Task description</label>
                    </div>
                    <div className={style.fieldWrapper}>
                        <input type="text" ref={emailInput} id="todo-form-text-field" placeholder=" " />
                        <label htmlFor="todo-form-text-field" className={style.todoFormLabel}>Task description</label>
                    </div>
                    <button type='button'>Login</button>
                </form>
            </div>
        </section>
    )
}