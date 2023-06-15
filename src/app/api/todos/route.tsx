import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";



export async function GET(request: Request) {
    const supabase = createRouteHandlerSupabaseClient({
        headers,
        cookies
    })

    const { data, error } = await supabase.from('todos').select('id,created_at,name,description,is_done')

    return NextResponse.json({ data, error })
}



export async function POST(request: Request) {
    const supabase = createRouteHandlerSupabaseClient({
        headers,
        cookies
    })

    const { id, created_at, name, description } = await request.json()
    const { data, error } = await supabase.from('todos').insert({
        id: id,
        created_at: created_at,
        name: name,
        description: description
    })
    return NextResponse.json({ data, error })
}



export async function DELETE(request: Request) {
    const supabase = createRouteHandlerSupabaseClient({ headers, cookies })

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    const { data, error } = await supabase.from('todos').delete().eq('id', id)

    return NextResponse.json({ data, error })
}


export async function PUT(request: Request) {
    const supabase = createRouteHandlerSupabaseClient({ headers, cookies })

    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const doneParam = url.searchParams.get('done')
    const done = (doneParam === 'true') 
        ? true 
        : (doneParam === 'false') 
            ? false 
            : null

    if (done === null)
        return NextResponse.json({data: null, error: 'invalid request data'}, { status: 400 })

    const { data, error } = await supabase.from('todos')
        .update({ 'is_done': done })
        .eq('id', id)

    return NextResponse.json({ data, error })
}