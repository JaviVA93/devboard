
import { useRef } from 'react'
import style from './loginForm.module.css'
import { SupabaseClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import GithubLoginButton from '../github-login/GithubLoginButton';
import GoogleLoginButton from '../google-login/googleLoginButton';

export default function LoginForm(props: { supabase: SupabaseClient, className: string }) {
    
    const emailInput = useRef<HTMLInputElement | null>(null);
    const { supabase, className } = props



    function loginSubmit(e: React.FormEvent) {
        e.preventDefault()


        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const formJson = Object.fromEntries(formData.entries())

        const email = formJson.email.toString()
        const password = formJson.password.toString()


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


    return (
        <div className={`${style.loginContainer} ${className}`}>
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
                <GithubLoginButton supabase={supabase} />
                <GoogleLoginButton supabase={supabase}/>
            </div>
        </div>
    )
}