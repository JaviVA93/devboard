"use client"

import { Session } from "@supabase/supabase-js"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import {  useRouter } from "next/navigation"
import { PATHS } from "@/utils/constants"
import { useSupabase } from "../supabase-context"
import style from "./profilePage.module.css"
import LoaderBlock from "@/components/loader-block/loaderBlock"

export default function ProfilePage() {

    const router = useRouter()
    const { supabase } = useSupabase()
    const [session, setSession] = useState<null | 'guest' | Session>(null)


    async function signOut() {
        supabase.auth.signOut().then(() => {
            router.push('/')
        })
    }


    

    useEffect(() => {

        if (Cookies.get('supabase-auth-token'))
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (!session)
                    router.push(PATHS.LOGIN)
                else
                    setSession(session)
            }).catch(err => {
                console.error(err)
                setSession('guest')
            })
        else
            router.push(PATHS.LOGIN)
    }, [supabase])
    
    


    if (session) 
            return (
                <section className={style.section}>
                    <div>You are logged in 🙃</div>
                    <button type='button' onClick={signOut}>Logout</button>
                </section>
            )
    else 
        return (
            <section className={style.section}>
                <div style={{display: 'flex', flexDirection: 'column' ,alignItems: 'center', gap: '10px'}}>
                    <LoaderBlock className={style.loaderBlock} height={412} width={600}/>
                </div>
            </section>
        )

}