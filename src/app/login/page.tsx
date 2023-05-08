"use client"


import { useEffect, useRef, useState } from 'react';
import style from './loginPage.module.css'
import { useSupabase } from '../supabase-context';
import { loginUser, signUpUser } from '@/utils/supabase'
import { toast } from 'react-hot-toast';
import { Session } from '@supabase/supabase-js';
import Cookies from 'js-cookie';
import LoginForm from '@/components/login-form/loginForm';
import SignupForm from '@/components/signup-form/signupForm';

export default function LoginPage() {

    const { supabase } = useSupabase()
    const [session, setSession] = useState<null | 'guest' | Session>(null)
    const curtainElement = useRef<HTMLDivElement | null>(null)
    const [curtainBtnText, setCurtainBtnText] = useState('Signup')

    function moveCurtain() {
        if (!curtainElement.current)
            return
        
        if (curtainElement.current.classList.contains(style.showLogin)) {
            curtainElement.current.classList.remove(style.showLogin)
            curtainElement.current.classList.add(style.showSignup)
            setCurtainBtnText('Login')
        }
        else {
            curtainElement.current.classList.remove(style.showSignup)
            curtainElement.current.classList.add(style.showLogin)
            setCurtainBtnText('Signup')
        }
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
                <div ref={curtainElement} className={`${style.curtain} ${style.showLogin}`}>
                    <button type='button' onClick={moveCurtain}>{curtainBtnText}</button>
                </div>
                <LoginForm supabase={supabase} />
                <SignupForm supabase={supabase} className={style.signupContainer}/>
            </section>
        )
    if (session) {
        return (
            <button type='button' onClick={signOut}>Logout</button>
        )
    }

}