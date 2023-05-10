"use client"


import { useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import style from './loginPage.module.css'
import { useSupabase } from '../supabase-context';
import { Session } from '@supabase/supabase-js';
import Cookies from 'js-cookie';
import LoginForm from '@/components/login-form/loginForm';
import SignupForm from '@/components/signup-form/signupForm';
import GlitchText from '@/components/glitch-text/glitchText';
import LoaderBlock from '@/components/loader-block/loaderBlock';

export default function LoginPage() {

    const { supabase } = useSupabase()
    const [session, setSession] = useState<null | 'guest' | Session>(null)
    const [curtainBtnText, setCurtainBtnText] = useState('Sign up')
    const curtainElement = useRef<HTMLDivElement | null>(null)

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
            setCurtainBtnText('Sign up')
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
    }, [supabase])

    if (session === 'guest')
        return (
            <section ref={curtainElement} className={`${style.section} ${style.showLogin}`}>
                <div className={`${style.curtain}`}>
                    <Image className={style.loginImage}
                        src='/svg/undraw_working_late_re_0c3y.svg'
                        alt="login cover"
                        width={200}
                        height={200}
                    />
                    <Image className={style.signupImage}
                        src='/svg/undraw_launch_day_4e04.svg'
                        alt="signup cover"
                        width={200}
                        height={200}
                    />
                    <button type='button' onClick={moveCurtain}>
                        <GlitchText text={curtainBtnText} className={style.glitchText} />
                    </button>
                </div>
                <LoginForm supabase={supabase} className={style.loginContainer} />
                <SignupForm supabase={supabase} className={style.signupContainer} />
            </section>
        )
    if (session) {
        return (
            <button type='button' onClick={signOut}>Logout</button>
        )
    }
    else {
        // TO-DO: LOADING TEMPLATE
        return (
            <section className={style.section}>
                <div style={{display: 'flex', flexDirection: 'column' ,alignItems: 'center', gap: '10px'}}>
                    <LoaderBlock className={style.loaderBlock} height={212} width={400}/>
                    <LoaderBlock className={style.loaderBlock} height={70} width={247} />
                    <LoaderBlock className={style.loaderBlock} height={70} width={247} />
                </div>
                <div style={{alignSelf: 'center', justifySelf: 'center'}}>
                    <LoaderBlock className={style.loaderBlock} height={214} width={400}/>
                </div>
            </section>
        )
    }

}