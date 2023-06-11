import { Session, User, createClient } from "@supabase/supabase-js";
import { Database } from "@/db_schema";
import { useSupabase } from "@/app/supabase-context";
import { PATHS } from './constants'
import Cookies from "js-cookie";
import { useEffect, useState } from "react";



export async function loginUser(email: string, password: string) {
    const req = await fetch(PATHS.APIS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        })
    })

    const reqData = await req.json()
    return reqData
}



export async function signUpUser(email: string, password: string) {
    const req = await fetch(PATHS.APIS.SIGNUP, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        })
    })

    const reqData = await req.json()
    return reqData
}



export async function getTodosFromSB() {
    const req = await fetch(PATHS.APIS.TODOS)
    return await req.json()
}

type TodosResponse = Awaited<ReturnType<typeof getTodosFromSB>>
export type TodosResponseSuccess = TodosResponse['data']
export type TodosResponseError = TodosResponse['error']


export async function addTodo(todoData: { id: string, created_at: string, name: string, description: string }) {
    const { id, created_at, name, description } = todoData
    
    const req = await fetch(PATHS.APIS.TODOS, {
        method: 'POST',
        body: JSON.stringify({
            id: id,
            created_at: created_at,
            name: name,
            description: description
        })
    })

    return await req.json()
}


export async function removeTodo(id: string) {
    const encodedId = encodeURIComponent(id)
    const req = await fetch(`${PATHS.APIS.TODOS}?id=${encodedId}`, {
        method: 'DELETE'
    })
    return await req.json()
}

export async function setTodoAsDone(id: string) {
    const encodedId = encodeURIComponent(id)
    const req = await fetch(`${PATHS.APIS.TODOS}?id=${encodedId}&done=true`, {
        method: 'PUT'
    })

    return await req.json()
}

export async function setTodoAsNotDone(id: string) {
    const encodedId = encodeURIComponent(id)
    const req = await fetch(`${PATHS.APIS.TODOS}?id=${encodedId}&done=false`, {
        method: 'PUT'
    })

    return await req.json()
}

export function useSupabaseUserSession() {
    const [session, setSession] = useState<null | 'guest' | User>(null)
    const { supabase } = useSupabase()
    
    useEffect(() => {
        
        if (Cookies.get('supabase-auth-token'))
            supabase.auth.getSession().then(({ data: { session } }) => {
                (!session) ? setSession('guest') : setSession(session.user)
            }).catch(err => {
                console.error(err)
                setSession('guest')
            })
        else
            setSession('guest')    
    }, [supabase])

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            
            if(!session)
                setSession('guest')
            else 
                setSession(session.user)
        })
    }, [])

    return session
}

export function useLoggedUser() {
    const [session, setSession] = useState<'loading' | boolean>('loading')
    const { supabase } = useSupabase()
    
    useEffect(() => {
        
        if (Cookies.get('supabase-auth-token'))
            supabase.auth.getSession().then(({ data: { session } }) => {
                (!session) ? setSession(false) : setSession(true)
            }).catch(err => {
                console.error(err)
                setSession(false)
            })
        else
            setSession(false)    
    }, [supabase])

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if(!session)
                setSession(false)
            else 
                setSession(true)
        })
    }, [])

    return session
}