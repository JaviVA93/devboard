
"use client"

import style from './toolsBar.module.css'
import ToolItemCard from './toolItemCard'
import { useEffect, useRef, useState } from 'react'
import PlusSvg from '../assets/PlusSvg'
import ToolsSvg from '../assets/ToolsSvg'
import FastArrowRightSvg from '../assets/FastArrowRightSvg'
import { PATHS } from '@/utils/constants'
import { useLoggedUser, sessionState } from '@/utils/supabase'


export default function ToolsBar() {

    const [isLoadingBoardConfig, setIsLoadingBoardConfig] = useState(true)
    const toolsBar = useRef<HTMLDivElement | null>(null)
    const loggedState = useLoggedUser()

    const toolsList = [{
        toolName: 'Pomodoro',
        imagePreviewPath: '/svg/undraw_time_management_re_tk5w.svg',
        mainCardColor: '#567794',
        titleColor: '#151b24',
        toolId: 'pomodoro',
    },
    {
        toolName: 'To-Do List',
        imagePreviewPath: '/svg/undraw_to_do_re_jaef.svg',
        mainCardColor: '#76B576',
        titleColor: '#1B291B',
        toolId: 'todo',
    },
    {
        toolName: 'Clamp Calculator',
        imagePreviewPath: '/svg/undraw_file_bundle_re_6q1e.svg',
        mainCardColor: '#AB7B76',
        titleColor: '#c9c9c9',
        toolId: 'clampcalc',
    }, {
        toolName: 'Weather',
        imagePreviewPath: '/svg/undraw_weather_re_qsmd.svg',
        mainCardColor: '#ffffff',
        titleColor: '#2e6dcc',
        toolId: 'weather',
    }, {
        toolName: 'Color Picker',
        imagePreviewPath: '/svg/undraw_specs_re_546x.svg',
        mainCardColor: '#960093',
        titleColor: '#ffffff',
        toolId: 'colorpicker',
    }, {
        toolName: 'Code Editor',
        imagePreviewPath: '/svg/undraw_code_review_re_woeb.svg',
        mainCardColor: '#7F90F5',
        titleColor: '#F5F067',
        toolId: 'codeeditor',
    }]




    function showHideToolsBar() {
        if (!toolsBar.current)
            return

        if (toolsBar.current.classList.contains(style.toolsListHidden)) {
            window.addEventListener('click', outsideClicksListener, true)
            toolsBar.current.classList.remove(style.toolsListHidden)
        }
        else {
            window.removeEventListener('click', outsideClicksListener, true)
            toolsBar.current.classList.add(style.toolsListHidden)
        }
    }



    function outsideClicksListener(event: MouseEvent) {
        if (!event.target || !(event.target instanceof Node))
            return

        if (event.target !== toolsBar.current && !toolsBar.current?.contains(event.target)) {
            toolsBar.current?.classList.add(style.toolsListHidden)
            window.removeEventListener('click', outsideClicksListener, true)
        }
    }


    useEffect(() => {
        if (loggedState === sessionState.logged)
            fetch(PATHS.APIS.BOARD_TOOLS).then(() => {
                setIsLoadingBoardConfig(false)
            }).catch(() => {
                setIsLoadingBoardConfig(false)
            })
        else
            setIsLoadingBoardConfig(false)
    }, [loggedState])


    if (isLoadingBoardConfig)
        return <></>

    return (
        <div ref={toolsBar} className={`${style.toolsBar} ${style.toolsListHidden}`}>
            <button className={style.addToolsIconsWrapper} type='button' onClick={showHideToolsBar}>
                <PlusSvg />
                <ToolsSvg />
            </button>
            <button className={style.closeToolsBar} onClick={showHideToolsBar}>
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