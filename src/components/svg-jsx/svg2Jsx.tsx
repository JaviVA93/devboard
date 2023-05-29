"use client"

import { useRef, useState } from "react"
import style from "./svg2Jsx.module.css"

export default function Svg2Jsx() {
    
    const svgTextArea = useRef<null | HTMLTextAreaElement>(null)
    const [jsxOutput, setJsxOutput] = useState('')

    async function getJsx() {
        if (!svgTextArea.current)
            return

        const req = await fetch('/api/svgr', {
            method: 'POST',
            body: JSON.stringify({
                svg: svgTextArea.current.value
            })
        })
        const reqData = await req.json()
        setJsxOutput(reqData.svgComponent)
    }
    
    return (
        <div className={style.svg2jsx}>
            <textarea ref={svgTextArea}>
            </textarea>
            <textarea value={jsxOutput}>
            </textarea>
            <button type="button" onClick={getJsx}>Convert</button>
        </div>
    )
}