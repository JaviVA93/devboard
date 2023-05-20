"use client"

import { useEffect, useState, useRef } from "react"
import style from "./clampCalculator.module.css"
import { toast } from "react-hot-toast"
import CopySvg from "../assets/CopySvg"

export default function ClampCalculator() {

    const [clampResult, setClampResult] = useState('-')
    const minSizeInput = useRef<HTMLInputElement>(null)
    const maxSizeInput = useRef<HTMLInputElement>(null)
    const minViewportInput = useRef<HTMLInputElement>(null)
    const maxViewportInput = useRef<HTMLInputElement>(null)



    function calculateClampResult() {
        console.log('clampcalc')
        if (!maxSizeInput.current || !minSizeInput.current || !minViewportInput.current || !maxViewportInput.current)
            return

        const minSize = parseInt(minSizeInput.current.value),
            maxSize = parseInt(maxSizeInput.current.value),
            minViewport = parseInt(minViewportInput.current.value),
            maxViewport = parseInt(maxViewportInput.current.value)

        const change = (maxSize - minSize) / (maxViewport - minViewport)
        const preferred = maxSize - maxViewport * change
        const preferredRounded = Math.round((preferred + Number.EPSILON) * 100) / 100
        const rate = change * 100
        const rateRounded = Math.round((rate + Number.EPSILON) * 100) / 100

        const result = `clamp(${minSize}px, ${preferredRounded}px + ${rateRounded}vw, ${maxSize}px)`
        setClampResult(result)
        console.log(result)
    }


    function copyResultToClipboard() {
        navigator.clipboard.writeText(clampResult);
        toast('Clamp result copied to clipboard!', { 
            position: 'bottom-center',
            style: {
                color: '#c9c9c9',
                fontWeight: '600',
                backgroundColor: '#AB7B76',
                border: '1px solid #c9c9c9'
            }
        })
    }

    useEffect(() => {
        console.log('first render')
        calculateClampResult()
    }, [])

    return (
        <div className={style.clampCalc}>
            <h1>Clamp Calculator</h1>
            <div className={style.valuesWrapper}>
                <label>
                    Minimum Size (px)
                    <input type='number'
                        defaultValue={16}
                        onChange={calculateClampResult}
                        ref={minSizeInput} />
                </label>
                <label>
                    Maximum Size (px)
                    <input type='number'
                        defaultValue={18}
                        onChange={calculateClampResult}
                        ref={maxSizeInput} />
                </label>
                <label>
                    Maximum Viewport (px)
                    <input type='number'
                        defaultValue={500}
                        onChange={calculateClampResult}
                        ref={minViewportInput} />
                </label>
                <label>
                    Maximum Viewport (px)
                    <input type='number'
                        defaultValue={1200}
                        onChange={calculateClampResult}
                        ref={maxViewportInput} />
                </label>
            </div>
            <h2>Result</h2>
            <div className={style.resultWrapper}>
                <span className={style.result}>{clampResult}</span>
                <button className={style.copyBtn} aria-label="copy to clipboard" type="button" onClick={copyResultToClipboard}>
                    <CopySvg />
                </button>
            </div>
        </div>
    )
}

