"use client"

import style from './colorPicker.module.css'
import { ChangeEvent, useEffect, useState } from 'react'
import { invertColor } from '@/utils/utils'
import Image from 'next/image'

export default function ColorPicker() {

    const [imageSrc, setImageSrc] = useState('/images/color_spectrum.jpg')
    const [eyeDropperSupport, setEyeDropperSupport] = useState<boolean | 'loading'>('loading')
    const [color, setColor] = useState('#808080')
    const [textColor, setTextColor] = useState('black')

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

    if (eyeDropperSupport === 'loading') {
        return ''
    }
    else if (eyeDropperSupport)
        return (
            <div className={style.container}>
                <div className={style.leftWrapper}>
                    <label>
                        Choose a profile picture:
                        <input type="file" accept="image/png, image/jpeg" onChange={handleInputFile} />
                    </label>
                    <button type='button' onClick={openEyeDropper}>
                        Open Eye Dropper
                    </button>
                    <span className={style.colorValue} style={{ color: textColor, backgroundColor: color}}>
                        Color: {color}
                    </span>
                </div>
                <div className={style.rightWrapper}>
                    <Image className={style.backgroundImage} src={imageSrc} alt="background image for color picker" width={200} height={200} />
                    <Image className={style.image} src={imageSrc} width={200} height={200} alt="image for color picker" />
                </div>
            </div>
        )
    else
            return (
                'not supported'
            )
}