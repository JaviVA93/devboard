"use client"

import { Session, User, UserMetadata } from "@supabase/supabase-js"
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
import { useSupabaseUserSession } from "@/utils/supabase"

export default function ProfilePage() {

    const router = useRouter()
    const { supabase } = useSupabase()
    const [profileImg, setProfileImg] = useState(IMAGES.PROFILE_DEFAULT)
    const [email, setEmail] = useState<string | null>(null)
    const [name, setName] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [hasGithubProvider, setHasGithubProvider] = useState(false)
    const [hasGoogleProvider, setHasGoogleProvider] = useState(false)
    const userSession = useSupabaseUserSession()


    async function signOut() {
        supabase.auth.signOut().then(() => {
            router.push(PATHS.LOGIN)
        })
    }


    function setUserData(userSession: User | null | 'guest') {
        
        if (!userSession || userSession === 'guest')
            return

        if (userSession.email)
            setEmail(userSession.email)

        if (userSession.user_metadata.name)
            setName(userSession.user_metadata.name)

        if (userSession.user_metadata.user_name)
            setUsername(userSession.user_metadata.user_name)

        if (userSession.user_metadata.picture)
            setProfileImg(userSession.user_metadata.picture)
        else if (userSession.user_metadata.avatar_url)
            setProfileImg(userSession.user_metadata.avatar_url)

        if(userSession.app_metadata.provider === 'github')
            setHasGithubProvider(true)
        else if(userSession.app_metadata.providers && userSession.app_metadata.providers.includes('github'))
            setHasGithubProvider(true)

        if(userSession.app_metadata.provider === 'google')
            setHasGoogleProvider(true)
        else if(userSession.app_metadata.providers && userSession.app_metadata.providers.includes('google'))
            setHasGoogleProvider(true)
        
        return userSession
    }


    useMemo(() => setUserData(userSession), [userSession])

    useEffect(() => {
        if (userSession === 'guest')
            router.replace(PATHS.LOGIN)
    }, [router, userSession])
        


    if (userSession && userSession !== 'guest') 
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
                <div className={style.loader} style={{display: 'flex', flexDirection: 'column' ,alignItems: 'center', gap: '10px'}}>
                    <LoaderBlock className={style.loaderBlock} height={412} width={600}/>
                </div>
            </section>
        )

}