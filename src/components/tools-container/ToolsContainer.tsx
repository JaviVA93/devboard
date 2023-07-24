"use client"

import { cloneElement, useRef } from 'react';
import style from './toolsContainer.module.css'


interface Props {
    toolsToShow: {
        id: string;
        component: JSX.Element;
    }[]
}

export default function ToolsContainer(props: Props) {
    const { toolsToShow } = props

    const toolsContainer = useRef<HTMLDivElement | null>(null)


    function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
        if (!toolsContainer.current) return

        e.preventDefault()
        e.dataTransfer.dropEffect = "move";
        toolsContainer.current.classList.add(style.draggingOver)
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        if (!toolsContainer.current) return

        e.preventDefault()
        e.dataTransfer.dropEffect = "move";
        toolsContainer.current.classList.add(style.draggingOver)
    }

    function hadleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        if (!toolsContainer.current) return

        toolsContainer.current.classList.remove(style.draggingOver)
    }
    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        if (!toolsContainer.current) return

        const dropEventName = e.dataTransfer.getData('text')
        const dropEvent = new Event(dropEventName)
        window.dispatchEvent(dropEvent)
        toolsContainer.current.classList.remove(style.draggingOver)
    }

    return (
        <div ref={toolsContainer}
            className={style.toolsContainer}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={hadleDragLeave}
            onDrop={handleDrop}
        >
            {toolsToShow.map(t => cloneElement(t.component, { key: t.id }))}
        </div>
    )
}