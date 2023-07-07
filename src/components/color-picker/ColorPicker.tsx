"use client"

import Image from 'next/image'
import style from './colorPicker.module.css'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { invertColor } from '@/utils/utils'

export default function ColorPicker() {

    const [imageSrc, setImageSrc] = useState('/images/color_spectrum.jpg')
    const [eyeDropperSupport, setEyeDropperSupport] = useState<boolean | null>(null)
    const [color, setColor] = useState('#808080')
    const [textColor, setTextColor] = useState('black')
    const image = useRef<HTMLImageElement | null>(null)

    function handleInputFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target || !e.target.files || e.target.files.length < 1)
            return

        const newImageUrl = URL.createObjectURL(e.target.files[0])
        setImageSrc(newImageUrl)
    }


    async function openEyeDropper() {
        try {
            const eyeDropper = new EyeDropper()
            const result = await eyeDropper.open()
            setColor(result.sRGBHex)

            const blackWhiteColor = invertColor(result.sRGBHex, true)
            setTextColor(blackWhiteColor)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        setEyeDropperSupport(!!window.EyeDropper)
    }, [])


    return (
        <div className={style.container}>
            <div className={style.leftWrapper}>
                <label>
                    Choose a profile picture:
                    <input type="file" accept="image/png, image/jpeg" onChange={handleInputFile} />
                </label>
                <button onClick={openEyeDropper}>
                    Open Eye Dropper
                </button>
                <span className={style.colorValue} style={{ color: textColor, backgroundColor: color}}>
                    Color: {color}
                </span>
            </div>
            <div className={style.rightWrapper}>
                <img ref={image} src={imageSrc} width={300} height={300} alt="image for color picker" />
            </div>
        </div>
    )
}