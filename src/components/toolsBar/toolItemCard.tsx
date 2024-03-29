"use client"

import Image from 'next/image'
import style from './toolItemCard.module.css'
import TrashSvg from '../assets/TrashSvg';
import PlusSvg from '../assets/PlusSvg';
import { getCookieValue } from '@/utils/utils';
import { PATHS } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoaderIcon } from 'react-hot-toast';

interface Props {
    toolName: string,
    imagePreviewPath: string,
    mainCardColor: string,
    titleColor: string,
    toolId: string,
    isActive: boolean,
}

const ToolItemCard = (props: Props) => {

    const { toolName, imagePreviewPath, mainCardColor, titleColor, toolId, isActive } = props;
    const router = useRouter();
    const [isUpdatingTools, setIsUpdatingTools] = useState(false)
    const [active, setActive] = useState(isActive)



    function addToolToBoard() {
        console.log('addtool test')

        setIsUpdatingTools(true)

        const workboardToolsCookie = getCookieValue('devboard-tools')
        let result = ''
        if (!workboardToolsCookie) {
            result = toolId
        }
        else if (!workboardToolsCookie.includes(toolId)) {
            result = `${workboardToolsCookie},${toolId}`
        }

        const now = new Date();
        const time = now.getTime();
        const expireTime = time + 1000 * 60 * 60 * 24 * 365;
        now.setTime(expireTime);
        document.cookie = `devboard-tools=${result}; path=/; expires=${now.toUTCString()}`

        updateInDB().then(() => {
            router.refresh()
            setTimeout(() => { 
                setIsUpdatingTools(false)
                setActive(true)
            }, 1000)
        })
    }



    function removeToolFromBoard() {

        setIsUpdatingTools(true)

        const workboardToolsCookie = getCookieValue('devboard-tools')
        if (!workboardToolsCookie)
            return

        const toolsArr = workboardToolsCookie.split(',')
        const index = toolsArr.indexOf(toolId)
        if (index === -1)
            return

        toolsArr.splice(index, 1)

        const now = new Date();
        const time = now.getTime();
        const expireTime = time + 1000 * 60 * 60 * 24 * 365;
        now.setTime(expireTime);
        document.cookie = `devboard-tools=${toolsArr.join(',')}; path=/; expires=${now.toUTCString()}`

        updateInDB().then(() => {
            router.refresh()
            setTimeout(() => { 
                setIsUpdatingTools(false) 
                setActive(false)
            }, 1000)
        })
    }


    async function updateInDB() {
        if (!getCookieValue('supabase-auth-token'))
            return


        const req = await fetch(PATHS.APIS.BOARD_TOOLS, {
            method: 'POST'
        })
        return
    }


    function handleDragStart (e: React.DragEvent<HTMLDivElement>) {
        e.dataTransfer.setData("text", `toolDrop-addTool-${toolId}`);
        e.dataTransfer.effectAllowed = "move";
    }


    let toolsCookie = getCookieValue('devboard-tools')
    const toolOnBoard = (toolsCookie?.includes(toolId)) ? true : false;

    const removeWrapperElement =
        <button type='button'
            className={`${style.addRemoveWrapper} ${!isUpdatingTools ? style.removeBtn : ''}`}
            onClick={removeToolFromBoard}>
            {(isUpdatingTools) ? <LoaderIcon /> : <><TrashSvg /> Remove </>}
        </button>

    const addWrapperElement =
        <button type='button'
            className={`${style.addRemoveWrapper} ${!isUpdatingTools ? style.addBtn : ''}`}
            onClick={addToolToBoard}>
            {(isUpdatingTools) ? <LoaderIcon /> : <><PlusSvg />Add</>}
        </button>


    useEffect(() => {
        window.addEventListener(`toolDrop-addTool-${toolId}`, addToolToBoard)
        return () => {
            window.removeEventListener(`toolDrop-addTool-${toolId}`, addToolToBoard)
        }
    }, [])

    return (
        <div className={style.card}
            style={{ backgroundColor: mainCardColor, cursor: (active ? 'auto' : 'grab') }}
            draggable={!active}
            onDragStart={handleDragStart}>
            <h2 style={{ color: titleColor }}>{toolName}</h2>
            <Image src={imagePreviewPath}
                alt={`${toolName} image preview`}
                width='100'
                height='70'
                draggable="false"
                loading="lazy"
            />
            {!!(active)
                ? removeWrapperElement
                : addWrapperElement}
        </div>
    )
}

export default ToolItemCard