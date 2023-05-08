
import { SupabaseClient } from "@supabase/supabase-js"
import style from "./signupForm.module.css"
import { loginUser } from "@/utils/supabase"
import { useRef } from "react";

export default function SignupForm(props: { supabase: SupabaseClient, className: string }) {

    const emailInput = useRef<HTMLInputElement | null>(null);

    const { supabase, className } = props

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

    

    return (
        <section className={className}>
            <form className={style.signupForm} method='post' onSubmit={signUpSubmit}>
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
        </section>
    )
}