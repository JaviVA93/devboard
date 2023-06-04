"use client"

import { SupabaseClient, createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useEffect, useState, useContext } from 'react'



type SupabaseContext = {
    supabase: SupabaseClient
}

const Context = createContext<SupabaseContext | undefined>(undefined)


export default function SupabaseProvider({
    children,
}: { children: React.ReactNode }) {

    
    const [supabase] = useState(() => createBrowserSupabaseClient())

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
