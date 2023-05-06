
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {

    // Update the expired supabase sessions
    const res = NextResponse.next()
    const supabase = createMiddlewareSupabaseClient({ req, res })
    await supabase.auth.getSession()
    return res;
}