
"use client"

import style from './toolsBar.module.css'
import ToolItemCard from './toolItemCard'
import { useEffect, useRef, useState } from 'react'
import PlusSvg from '../assets/PlusSvg'
import ToolsSvg from '../assets/ToolsSvg'
import FastArrowRightSvg from '../assets/FastArrowRightSvg'
import { PATHS } from '@/utils/constants'
import { useLoggedUser, sessionState } from '@/utils/supabase'
import { TOOLS_LIST as toolsList } from '@/utils/constants'


export default function ToolsBar(props: { activeTools: string[] }) {

    const [isLoadingBoardConfig, setIsLoadingBoardConfig] = useState(true)
    const toolsBar = useRef<HTMLDivElement | null>(null)
    const loggedState = useLoggedUser()


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
                    key={v.id}
                    toolName={v.name}
                    imagePreviewPath={v.imagePreviewPath}
                    mainCardColor={v.mainCardColor}
                    titleColor={v.titleColor}
                    toolId={v.id}
                    isActive={!!props.activeTools.find(tId => tId === v.id)}
                />)}
            </div>
        </div>
    )
}