
import { SupabaseClient } from "@supabase/supabase-js"
import style from "./signupForm.module.css"
import { signUpUser } from "@/utils/supabase"
import { useRef, useState } from "react";
import { validateEmail } from "@/utils/utils";
import { toast } from "react-hot-toast";
import CubeLoader from "../assets/cube-loader/CubeLoader";

export default function SignupForm(props: { supabase: SupabaseClient, className: string }) {

    const [isSuccess, setIsSuccess] = useState(false)
    const [isWaiting, setIsWaiting] = useState(false)
    const emailInput = useRef<HTMLInputElement | null>(null)

    const { supabase, className } = props

    function signUpSubmit(e: React.FormEvent) {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const formJson = Object.fromEntries(formData.entries())

        const email = formJson.email.toString()
        const password = formJson.password.toString()

        if (!validateEmail(email)) {
            toast.error('Invalid email')
            return
        }


        setIsWaiting(true)

        signUpUser(email, password).then(responseData => {
            console.log(responseData)

            if (responseData.error) {
                toast.error('Something was wrong, try again later.')
                return
            }

            setIsSuccess(true)
        })
    }

    if (!isSuccess)
        return (
            <section className={`${style.signupContainer} ${className}`}>
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
                    {!isWaiting
                        ? <button type='submit'>Sign up</button>
                        : <CubeLoader className={style.waiting} />
                    }

                </form>
            </section>
        )
    else
        return (
            <section className={style.signupContainer}>
                <div className={style.successMsg}>
                    <h2>Thank you for signing up!</h2>
                    <span>To complete the registration process, please check your email inbox 📨</span>
                </div>
            </section>
        )

}

function setState(arg0: boolean): [any, any] {
    throw new Error("Function not implemented.");
}
