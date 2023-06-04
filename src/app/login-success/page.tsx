"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PATHS } from "@/utils/constants"

export default function LoginSuccessPage() {
    const router = useRouter()

    useEffect(() => { 
        setTimeout(() => router.replace(PATHS.BOARD), 3000)
    }, [router])

    return (
        <section>
            <span>Loged successfully! Redirecting to your board...</span>
        </section>
    )
}