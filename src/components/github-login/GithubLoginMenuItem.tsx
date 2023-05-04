"use client"

import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import GitHubLogo from "../assets/GitHubLogo"
import style from './githubLoginMenuItem.module.css'
import { useSupabase } from "@/app/supabase-context"

// import { supabase } from '@/utils/supabase'

const GithubLoginMenuItem = () => {
    const [user, setUser] = useState<User | null>(null)
    const { supabase } = useSupabase()

    async function signUpGithub() {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: document.location.origin + document.location.pathname
            }
        })
    }

    async function signOutGithub() {
        await supabase.auth.signOut()
        location.reload()
    }

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }



    useEffect(() => {
        checkUser()
    }, [])





    return <li className={style.ghMenuItem} onClick={!user ? signUpGithub : signOutGithub}>
        {!user ? 'Login' : 'Logout'}
        <GitHubLogo className={style.icon}/> 
    </li>


}

export default GithubLoginMenuItem