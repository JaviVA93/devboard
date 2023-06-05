"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PATHS } from "@/utils/constants"

export default function LoginSuccessPage() {
    const router = useRouter()
    const [seconds, setSeconds] = useState('3')

    useEffect(() => {
        let s = 3
        const int = setInterval(() => {
            if (s <= 0) {
                clearInterval(int)
                router.replace(PATHS.BOARD)
            }
            setSeconds(s.toString())
            s--
        }, 1000)
    }, [router])

    return (
        <section>
            <span>You logged in successfully! Redirecting to your board in {seconds}...</span>
        </section>
    )
}