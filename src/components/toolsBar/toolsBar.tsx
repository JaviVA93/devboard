
"use client"

import Image from 'next/image'
import style from './toolsBar.module.css'
import ToolItemCard from './toolItemCard'
import { useRef } from 'react'

const ToolsBar = () => {

    const toolsList = [{
        toolName: 'Item Name',
        imagePreviewPath: '/images/todo-tool-preview.png',
        mainCardColor: '#FFFFFF',
        titleColor: '#000000',
    },
    {
        toolName: 'Item Name',
        imagePreviewPath: '/images/todo-tool-preview.png',
        mainCardColor: '#FFFFFF',
        titleColor: '#000000',
    },
    {
        toolName: 'Item Name',
        imagePreviewPath: '/images/todo-tool-preview.png',
        mainCardColor: '#FFFFFF',
        titleColor: '#000000',
    },
    {
        toolName: 'Item Name',
        imagePreviewPath: '/images/todo-tool-preview.png',
        mainCardColor: '#FFFFFF',
        titleColor: '#000000',
    },]

    const toolsBar = useRef<HTMLDivElement | null>(null)

    function openCloseToolsBar() {
        if (!toolsBar.current) return;

        toolsBar.current.classList.contains(style.toolsListHidden) ?
            toolsBar.current.classList.remove(style.toolsListHidden) :
            toolsBar.current.classList.add(style.toolsListHidden)
    }

    return (
        <div ref={toolsBar} className={`${style.toolsBar} ${style.toolsListHidden}`}>
            <button className={style.addToolsIconsWrapper} type='button' onClick={openCloseToolsBar}>
                <Image src='/svg/plus.svg' className={style.plusIcon} alt='plus icon' width={25} height={25} />
                <Image src='/svg/tools.svg' className={style.toolsIcon} alt='tools icon' width={25} height={25} />
            </button>
            <button className={style.closeToolsBar} onClick={openCloseToolsBar}>
                <Image src='/svg/fast-arrow-right.svg' width={25} height={25} alt='close tools bar icon' />
            </button>
            <div className={style.toolsList}>
                { toolsList.map(v => <ToolItemCard
                        key={v.toolName}
                        toolName={v.toolName}
                        imagePreviewPath={v.imagePreviewPath}
                        mainCardColor={v.mainCardColor}
                        titleColor={v.titleColor} />)}
            </div>
        </div>
    )
}

export default ToolsBar