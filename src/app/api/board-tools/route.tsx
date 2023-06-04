import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";



export async function GET() {
    const supabase = createRouteHandlerSupabaseClient({
        headers,
        cookies
    })

    const { data, error } = await supabase.from('board-tools').select('tools')

    return NextResponse.json({ data, error })
}



export async function POST() {
    const supabase = createRouteHandlerSupabaseClient({
        headers,
        cookies
    })

    const user = await supabase.auth.getUser()
    console.log(user)
    if (user.error)
        return NextResponse.json({ data: null, error: 'need login' }, { status: 500 })


    const id = user.data.user.id
    const toolsCookie = cookies().get('devboard-tools')
    if (!toolsCookie)
        return NextResponse.json({ data: null, error: 'invalid request' }, { status: 400 })

    const { data, error } = await supabase.from('board-tools').upsert({
        user_id: id,
        tools: toolsCookie.value
    })

    if (error) {
        console.error(error)
        return NextResponse.json({ data: null, error: 'error updating' }, { status: 500 })
    }

    const now = new Date();
    const time = now.getTime();
    const expireTime = time + 1000 * 60 * 60 * 24 * 365;
    now.setTime(expireTime);
    return new Response(undefined, {
        status: 200,
        headers: {
            'Set-cookie': `devboard-tools=${toolsCookie.value}; path=/; expires${now.toUTCString()}`
        }
    })
}
