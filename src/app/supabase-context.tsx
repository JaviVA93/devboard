"use client"

import { SupabaseClient, createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState, useContext } from 'react'
import { toast } from "react-hot-toast";


type SupabaseContext = {
    supabase: SupabaseClient
}

const Context = createContext<SupabaseContext | undefined>(undefined)


export default function SupabaseProvider({
    children,
}: { children: React.ReactNode }) {

    const router = useRouter()
    const [supabase] = useState(() => createBrowserSupabaseClient())

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            
            console.log('AuthState changed')

            if (document.location.href.includes('access_token')) {
                const cleanURL = document.location.origin + document.location.pathname
                history.replaceState({}, '', cleanURL)
    
                
                // SHOW TOAST LOGIN SUCCESS!

            }

            // router.refresh()
            
        })


        return () => {
            subscription.unsubscribe();
        }
    }, [supabase, router])


    return (
        <Context.Provider value={{ supabase }}>
            <>{children}</>
        </Context.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(Context)

    if (context === undefined)
        throw new Error('useSupabase must be used inside SupabaseProvider')

    return context
}
