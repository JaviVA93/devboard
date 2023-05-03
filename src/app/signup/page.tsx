"use client"

import { TodosResponseSuccess, getTodos, supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";


const SignupPage = () => {

    const [user, setUser] = useState<User | null>(null)
    const [todos, setTodos] = useState<TodosResponseSuccess | undefined>()

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
        if (user)
            checkTodos()
    }

    async function checkTodos() {

        const { data, error }  = await getTodos()
        if (error) {
            console.error(error)
            return
        }

        setTodos(data)
    }



    useEffect(() => {
        checkUser()
    }, [])

    if (user)
        return (
            <div>
                <span>{user.email}</span>
                <button onClick={signOutGithub}>Sign out</button>
                <p>{JSON.stringify(todos)}</p>
            </div>
        )

    return (
        <button onClick={signUpGithub}>Sign up with Github</button>
    )
}

export default SignupPage;



// https://wtgrzcoxnsudoskkfbzp.supabase.co