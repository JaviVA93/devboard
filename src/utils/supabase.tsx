import { createClient } from "@supabase/supabase-js";
import { Database } from "@/db_schema";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''


const supabase = createClient<Database>(supabaseURL, supabaseKey)

const TODOS_URI = '/api/todos'

async function getTodosFromSB() {
    const req = await fetch(TODOS_URI)
    return await req.json()
}

type TodosResponse = Awaited<ReturnType<typeof getTodosFromSB>>
export type TodosResponseSuccess = TodosResponse['data']
export type TodosResponseError = TodosResponse['error']


async function addTodo(todoData: { id: string, created_at: string, name: string, description: string }) {
    const { id, created_at, name, description } = todoData
    
    const req = await fetch(TODOS_URI, {
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
    const req = await fetch(`${TODOS_URI}?id=${encodedId}`, {
        method: 'DELETE'
    })
    return await req.json()
    // return await supabase.from('todos').delete().eq('id', id)
}


export {
    supabase,
    getTodosFromSB,
    addTodo,
    removeTodo
};