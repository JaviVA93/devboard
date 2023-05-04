import { createClient } from "@supabase/supabase-js";
import { Database } from "@/db_schema";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''


const supabase = createClient<Database>(supabaseURL, supabaseKey)


async function getTodos() {
    return await supabase.from('todos').select()
}

type TodosResponse = Awaited<ReturnType<typeof getTodos>>
export type TodosResponseSuccess = TodosResponse['data']
export type TodosResponseError = TodosResponse['error']


async function addTodo(todoData: {id: string, created_at: string, name: string, description: string}) {
    const {id, created_at, name, description} = todoData
    return await supabase.from('todos').insert({
        id: id,
        created_at: created_at,
        name: name,
        description: description
    })
}


async function removeTodo(id: string) {
    return await supabase.from('todos').delete().eq('id', id)
}


export {
    supabase,
    getTodos,
    addTodo,
    removeTodo
};