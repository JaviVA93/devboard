import { createClient } from "@supabase/supabase-js";
import { Database } from "@/db_schema";
import { useSupabase } from "@/app/supabase-context";
import { PATHS } from './constants'

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''


const supabase = createClient<Database>(supabaseURL, supabaseKey)



async function loginUser(email: string, password: string) {
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



async function signUpUser(email: string, password: string) {
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



async function getTodosFromSB() {
    const req = await fetch(PATHS.APIS.TODOS)
    return await req.json()
}

type TodosResponse = Awaited<ReturnType<typeof getTodosFromSB>>
export type TodosResponseSuccess = TodosResponse['data']
export type TodosResponseError = TodosResponse['error']


async function addTodo(todoData: { id: string, created_at: string, name: string, description: string }) {
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


async function removeTodo(id: string) {
    const encodedId = encodeURIComponent(id)
    const req = await fetch(`${PATHS.APIS.TODOS}?id=${encodedId}`, {
        method: 'DELETE'
    })
    return await req.json()
    // return await supabase.from('todos').delete().eq('id', id)
}


export {
    supabase,
    loginUser,
    signUpUser,
    getTodosFromSB,
    addTodo,
    removeTodo
};