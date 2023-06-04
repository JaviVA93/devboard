
"use client"

import style from './toolsBar.module.css'
import ToolItemCard from './toolItemCard'
import { useRef } from 'react'
import PlusSvg from '../assets/PlusSvg'
import ToolsSvg from '../assets/ToolsSvg'
import FastArrowRightSvg from '../assets/FastArrowRightSvg'

const ToolsBar = () => {

    const toolsList = [{
        toolName: 'Pomodoro',
        imagePreviewPath: '/images/pomodoro-preview.png',
        mainCardColor: '#567794',
        titleColor: '#151b24',
        toolId: 'pomodoro',
    },
    {
        toolName: 'To-Do List',
        imagePreviewPath: '/images/todo-tool-preview.png',
        mainCardColor: '#1E2E1E',
        titleColor: '#5e765ed7',
        toolId: 'todo',
    },
    {
        toolName: 'Clamp Calculator',
        imagePreviewPath: '/images/clampcalc-preview.png',
        mainCardColor: '#AB7B76',
        titleColor: '#c9c9c9',
        toolId: 'clampcalc',
    },{
        toolName: 'Weather',
        imagePreviewPath: '/images/weather-preview.png',
        mainCardColor: '#ffffff',
        titleColor: '#2e6dcc',
        toolId: 'weather',
    }]

    const toolsBar = useRef<HTMLDivElement | null>(null)

    function openCloseToolsBar() {
        if (!toolsBar.current) return;

        toolsBar.current.classList.contains(style.toolsListHidden) ?
            toolsBar.current.classList.remove(style.toolsListHidden) :
            toolsBar.current.classList.add(style.toolsListHidden)
    }

    // TO-DO: remove/add button on each card based on active tools on the workboard
    // pass some "add/remove" function on props to control the behavior by the parent (Workboard page)

    return (
        <div ref={toolsBar} className={`${style.toolsBar} ${style.toolsListHidden}`}>
            <button className={style.addToolsIconsWrapper} type='button' onClick={openCloseToolsBar}>
                <PlusSvg />
                <ToolsSvg />
            </button>
            <button className={style.closeToolsBar} onClick={openCloseToolsBar}>
                <FastArrowRightSvg />
            </button>
            <div className={style.toolsList}>
                {toolsList.map(v => <ToolItemCard
                    key={v.toolId}
                    toolName={v.toolName}
                    imagePreviewPath={v.imagePreviewPath}
                    mainCardColor={v.mainCardColor}
                    titleColor={v.titleColor}
                    toolId={v.toolId}
                />)}
            </div>
        </div>
    )
}

export default ToolsBar