"use client"

import style from './colorPicker.module.css'
import { ChangeEvent, useEffect, useState } from 'react'
import { invertColor } from '@/utils/utils'
import Image from 'next/image'
import PickerSvg from '../assets/PickerSvg'
import ImageFileSvg from '../assets/ImageFileSvg'
import toast from 'react-hot-toast'
import CopySvg from '../assets/CopySvg'
import SimpleLoader from '../assets/simple-loader/SimpleLoader'

declare global {
    interface Window {
        EyeDropper?: any;
    }
}

export default function ColorPicker() {

    const defaultImage = '/images/color_spectrum.jpg'

    const [hasEyeDropper, setHasEyeDropper] = useState<boolean | 'loading'>('loading')
    const [imageSrc, setImageSrc] = useState<string | null>(null)
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
            if (!window.EyeDropper)
                return

            const eyeDropper = new window.EyeDropper()
            const result = await eyeDropper.open()
            setColor(result.sRGBHex)

            const blackWhiteColor = invertColor(result.sRGBHex, true)
            setTextColor(blackWhiteColor)
        } catch (e) {
            console.error(e)
        }
    }

    function copyResultToClipboard() {
        navigator.clipboard.writeText(color);
        toast('Color copied to clipboard!', {
            position: 'bottom-center',
            style: {
                color: textColor,
                fontWeight: '600',
                backgroundColor: color,
                border: '1px solid #c9c9c9'
            }
        })
    }


    useEffect(() => {
        setHasEyeDropper(!!window.EyeDropper)
    }, [])

    if (hasEyeDropper === 'loading') 
        return (
            <div className={`${style.container} ${style.containerNotSupported}`}>
                <SimpleLoader className={style.loader} />
            </div>
        )
    else if (hasEyeDropper)
        return (
            <div className={style.container}>
                <div className={style.leftWrapper}>
                    <label className={style.fileInput}>
                        Choose your picture
                        <ImageFileSvg className={style.imageFileIcon} />
                        <input type="file" accept="image/png, image/jpeg" onChange={handleInputFile} />
                    </label>
                    <button className={style.pickerBtn} type='button' onClick={openEyeDropper}>
                        <PickerSvg />
                        Open Eye Dropper
                    </button>
                    <div className={style.colorValueWrapper} style={{ color: textColor, backgroundColor: color }}>
                        <span>Color: {color}</span>
                        <button className={style.copyBtn}
                            style={{ backgroundColor: textColor }}
                            aria-label="copy to clipboard"
                            type="button"
                            onClick={copyResultToClipboard}
                        >
                            <CopySvg color={color} />
                        </button>
                    </div>
                </div>
                <div className={style.rightWrapper}>
                    <Image className={style.backgroundImage} src={(!imageSrc) ? defaultImage : imageSrc} alt="background image for color picker" width={200} height={200} />
                    <Image className={style.image} src={(!imageSrc) ? defaultImage : imageSrc} width={200} height={200} alt="image for color picker" />
                    {(!imageSrc)
                        ? <span className={style.defaultImageText}>Default Image</span>
                        : ''}
                </div>
            </div>
        )
    else
        return (
            <div className={`${style.container} ${style.containerNotSupported}`}>
                <h1>This browser doesn&apos;t suppor EyeDropper</h1>
                <a href='https://caniuse.com/mdn-api_eyedropper' target='_blank'>
                    Check the compatibility
                </a>
            </div>
        )
}