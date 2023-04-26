"use client"

import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";


const SignupPage = () => {

    const [user, setUser] = useState<User | null>(null)

    async function signUpGithub() {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: 'http://localhost:3000/signup'
            }
        })
    }

    async function signOutGithub() {
        await supabase.auth.signOut()
        checkUser()
    }

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }




    useEffect(() => {
        checkUser()
    }, [])
    // debugger
    if (user)
        return (
            <div>
                <span>{user.email}</span>
                <button onClick={signOutGithub}>Sign out</button> 
            </div>
        )

    return (
        <button onClick={signUpGithub}>Sign up with Github</button> 
    )
}

export default SignupPage;



// https://wtgrzcoxnsudoskkfbzp.supabase.co