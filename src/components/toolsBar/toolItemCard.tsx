"use client"

import Image from 'next/image'
import style from './toolItemCard.module.css'
import TrashSvg from '../assets/TrashSvg';
import PlusSvg from '../assets/PlusSvg';
import { getCookieValue } from '@/utils/utils';
import { PATHS } from '@/utils/constants';
import { useEffect, useState } from 'react';


const ToolItemCard = (props: {
    toolName: string, imagePreviewPath: string, mainCardColor: string, titleColor: string, toolId: string
}) => {

    const { toolName, imagePreviewPath, mainCardColor, titleColor, toolId } = props;


    function addToolToBoard() {
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
        
        updateInDB().then(() => document.location.reload())
    }

    function removeToolFromBoard() {
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
        
        updateInDB().then(() => document.location.reload())
    }

    async function updateInDB() {
        if (!getCookieValue('supabase-auth-token'))
            return
        
        
        const req = await fetch(PATHS.APIS.BOARD_TOOLS, {
            method: 'POST'
        })
        return
    }



    let toolsCookie = getCookieValue('devboard-tools')
    const toolOnBoard = (toolsCookie?.includes(toolId)) ? true : false;

    const removeWrapperElement =
        <button type='button' className={`${style.addRemoveWrapper} ${style.removeBtn}`} onClick={removeToolFromBoard}>
            <TrashSvg /> Remove
        </button>

    const addWrapperElement =
        <button type='button' className={`${style.addRemoveWrapper} ${style.addBtn}`} onClick={addToolToBoard}>
            <PlusSvg /> Add
        </button>

    return (
        <div className={style.card} style={{ backgroundColor: mainCardColor }} draggable>
            <h2 style={{ color: titleColor }}>{toolName}</h2>
            <Image src={imagePreviewPath}
                alt={`${toolName} image preview`}
                width='100'
                height='70'
                draggable="false"
            />
            {!!(toolOnBoard)
                ? removeWrapperElement
                : addWrapperElement}
        </div>
    )
}

export default ToolItemCard