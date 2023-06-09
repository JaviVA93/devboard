
import { validateEmail } from "@/utils/utils";
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
    if (!validateEmail(email)) {
        return NextResponse.json({data: null, error: 'invalid request data'}, { status: 400 })
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    })

    return NextResponse.json({ data, error})
}