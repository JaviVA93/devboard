
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const supabase = createRouteHandlerSupabaseClient({
        headers,
        cookies
    })

    // TO-DO: validate the email and the password properly

    const { email, password } = await request.json()
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        return NextResponse.json(error)
    }

    const accessToken = data.session?.access_token || ''
    const refreshToken = data.session?.refresh_token || ''

    const response = NextResponse.next();
    response.cookies.set('access_token', accessToken)
    response.cookies.set('refresh_token', refreshToken)
    
    return NextResponse.redirect(new URL('/', request.url))
}