"use client"

import { cloneElement, useRef, useState } from 'react';
import style from './toolsContainer.module.css'
import ArrowSvg from '../assets/ArrowSvg';


interface Props {
    toolsToShow: {
        id: string;
        component: JSX.Element;
    }[]
}

export default function ToolsContainer(props: Props) {
    const { toolsToShow } = props

    const toolsContainerWrapper = useRef<HTMLDivElement | null>(null)
    const [showDropMessage, setShowDropMessage] = useState(false)


    function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
        if (!toolsContainerWrapper.current) return

        e.preventDefault()
        e.dataTransfer.dropEffect = "move";
        // toolsContainerWrapper.current.classList.add(style.draggingOver)
        setShowDropMessage(true)
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        if (!toolsContainerWrapper.current) return

        e.preventDefault()
        e.dataTransfer.dropEffect = "move";
        // toolsContainerWrapper.current.classList.add(style.draggingOver)
        setShowDropMessage(true)
    }

    function hadleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        if (!toolsContainerWrapper.current) return

        // toolsContainerWrapper.current.classList.remove(style.draggingOver)
        setShowDropMessage(false)
    }
    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        if (!toolsContainerWrapper.current) return

        const dropEventName = e.dataTransfer.getData('text')
        const dropEvent = new Event(dropEventName)
        window.dispatchEvent(dropEvent)
        // toolsContainerWrapper.current.classList.remove(style.draggingOver)
        setShowDropMessage(false)
    }

    return (
        <div ref={toolsContainerWrapper}
            className={style.toolsContainerWrapper}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={hadleDragLeave}
            onDrop={handleDrop}>

            {(toolsToShow.length > 0)
                ? <div className={`${style.toolsContainer} ${showDropMessage ? style.blurFilter: ''}`}>
                    {toolsToShow.map(t => cloneElement(t.component, { key: t.id }))}
                </div>
                : <div>
                    <h1 className={style.emptyBoardMsg}>Add tools to your workboard!</h1>
                    <div className={style.emptyBoardArrowWrapper}>
                        <ArrowSvg className={style.emptyBoardArrow} />
                    </div>
                </div>
            }
            {showDropMessage
                ? <span className={style.draggingOver}>Drop to add</span>
                : ''
            }
        </div>
    )
}