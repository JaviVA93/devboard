"use client"

import { Session, UserMetadata } from "@supabase/supabase-js"
import Cookies from "js-cookie"
import { useCallback, useEffect, useMemo, useState } from "react"
import {  useRouter } from "next/navigation"
import { PATHS } from "@/utils/constants"
import { useSupabase } from "../supabase-context"
import style from "./profilePage.module.css"
import LoaderBlock from "@/components/loader-block/loaderBlock"
import Image from "next/image"
import { IMAGES } from "../../utils/constants"
import GitHubLogo from "@/components/assets/GitHubLogo"
import GoogleLogo from "@/components/assets/GoogleLogo"
import { useSupabaseSession } from "@/utils/supabase"

export default function ProfilePage() {

    const router = useRouter()
    const { supabase } = useSupabase()
    const [profileImg, setProfileImg] = useState(IMAGES.PROFILE_DEFAULT)
    const [email, setEmail] = useState<string | null>(null)
    const [name, setName] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [hasGithubProvider, setHasGithubProvider] = useState(false)
    const [hasGoogleProvider, setHasGoogleProvider] = useState(false)
    const session = useSupabaseSession()


    async function signOut() {
        supabase.auth.signOut().then(() => {
            router.push(PATHS.LOGIN)
        })
    }


    function setUserData(session: Session | null | 'guest') {
        
        if (!session || session === 'guest')
            return

        if (session.user.email)
            setEmail(session.user.email)

        if (session.user.user_metadata.name)
            setName(session.user.user_metadata.name)

        if (session.user.user_metadata.user_name)
            setUsername(session.user.user_metadata.user_name)

        if (session.user.user_metadata.picture)
            setProfileImg(session.user.user_metadata.picture)
        else if (session.user.user_metadata.avatar_url)
            setProfileImg(session.user.user_metadata.avatar_url)

        if(session.user.app_metadata.provider === 'github')
            setHasGithubProvider(true)
        else if(session.user.app_metadata.providers && session.user.app_metadata.providers.includes('github'))
            setHasGithubProvider(true)

        if(session.user.app_metadata.provider === 'google')
            setHasGoogleProvider(true)
        else if(session.user.app_metadata.providers && session.user.app_metadata.providers.includes('google'))
            setHasGoogleProvider(true)
        
        return session
    }


    useMemo(() => setUserData(session), [session])

    useEffect(() => {
        if (session === 'guest')
            router.replace(PATHS.LOGIN)
    }, [router, session])
        


    if (session && session !== 'guest') 
            return (
                <section className={style.section}>
                    <Image className={style.profileImage} src={profileImg} height={100} width={100} alt="Profile Image"/>
                    <div className={style.userData}>
                        { (email) ? <div>📧 {email}</div> : '' }
                        { (name) ? <div>{name}</div> : '' }
                        { (username) ? <div>{username}</div> : '' }
                    </div>
                    <div className={style.providers}>
                        { (hasGithubProvider) ? <GitHubLogo /> : '' }
                        { (hasGoogleProvider) ? <GoogleLogo className={style.googleLogo} /> : '' }
                    </div>
                    <button className={style.signout} type='button' onClick={signOut}>Sign out</button>
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