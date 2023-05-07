"use client"


import { useEffect, useRef, useState } from 'react';
import style from './loginPage.module.css'
import GithubLoginMenuItem from '@/components/github-login/GithubLoginMenuItem';
import { useSupabase } from '../supabase-context';
import { loginUser, signUpUser } from '@/utils/supabase'
import { toast } from 'react-hot-toast';
import { Session } from '@supabase/supabase-js';
import Cookies from 'js-cookie';

export default function LoginPage() {

    const emailInput = useRef<HTMLInputElement | null>(null);
    const { supabase } = useSupabase()
    const [session, setSession] = useState<null | 'guest' | Session>(null)

    function loginSubmit(e: React.FormEvent) {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const formJson = Object.fromEntries(formData.entries())

        const email = formJson.email.toString()
        const password = formJson.password.toString()


        // SHOW "LOADING" ANIMATION

        supabase.auth.signInWithPassword({
            email: email,
            password: password
        }).then(res => {
            if (res.error)
                toast.error(res.error.message, { duration: 10000 })
            else
                document.location.pathname = "/"
        })

    }


    function signUpSubmit(e: React.FormEvent) {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const formJson = Object.fromEntries(formData.entries())

        const email = formJson.email.toString()
        const password = formJson.password.toString()
        loginUser(email, password).then(responseData => {
            console.log(responseData)
        })
    }


    async function signOut() {
        supabase.auth.signOut().then(() => location.href = '/')
    }


    useEffect(() => {
        if (Cookies.get('supabase-auth-token'))
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (!session)
                    setSession('guest')
                else
                    setSession(session)
            })
        else
            setSession('guest')
    }, [])

    if (session === 'guest')
        return (
            <section className={style.section}>
                <div className={style.column}>
                    <form className={style.loginForm} method='post' onSubmit={loginSubmit}>
                        <div className={style.fieldWrapper}>
                            <input name="email"
                                type="email"
                                ref={emailInput}
                                id="login-form-email"
                                placeholder=" "
                            />
                            <label htmlFor="login-form-email" className={style.todoFormLabel}>Email</label>
                        </div>
                        <div className={style.fieldWrapper}>
                            <input name="password"
                                type="password"
                                ref={emailInput}
                                id="login-form-password"
                                placeholder=" "
                            />
                            <label htmlFor="login-form-password" className={style.todoFormLabel}>Password</label>
                        </div>
                        <button type='submit'>Login</button>
                    </form>
                    <div className={style.socialLoginContainer}>
                        {/* <GithubLoginMenuItem /> */}
                    </div>
                </div>
                <div className={style.column}>
                    <form className={style.loginForm} method='post' onSubmit={signUpSubmit}>
                        <div className={style.fieldWrapper}>
                            <input name="email"
                                type="email"
                                ref={emailInput}
                                id="signup-form-email"
                                placeholder=" "
                            />
                            <label htmlFor="signup-form-email" className={style.todoFormLabel}>Email</label>
                        </div>
                        <div className={style.fieldWrapper}>
                            <input name="password"
                                type="password"
                                ref={emailInput}
                                id="signup-form-password"
                                placeholder=" "
                            />
                            <label htmlFor="signup-form-password" className={style.todoFormLabel}>Password</label>
                        </div>
                        <button type='button'>Sign in</button>
                    </form>
                </div>
            </section>
        )
    if (session) {
        return (
            <button type='button' onClick={signOut}>Logout</button>
        )
    }

}