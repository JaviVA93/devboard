"use client"

import { Editor } from "@monaco-editor/react";
import style from "./svgToComponent.module.css"
import { useRef, useState } from "react";

export default function SvgToComponent() {
    const [svgComponentResult, setSvgComponentResult] = useState('')
    const activeEditor = useRef<any>(null)

    const doRequest = async () => {
        if (!activeEditor.current)
            return

        const svgCode = activeEditor.current.getValue()

        const req = await fetch('/api/svgr', {
            method: 'POST',
            body: JSON.stringify({ code: svgCode })
        })

        const reqdata = await req.json()

        setSvgComponentResult(reqdata.data)
    }

    function handleEditorDidMount(editor: any, monaco: any) {
        activeEditor.current = editor;
    }

    return (
        <div className={style.svg2component}>
            <h1>SVG to React component</h1>
            <div className={style.editorsWrapper}>
                <div className={style.leftSide}>
                    <Editor
                        theme='vs-dark'
                        height="100%"
                        width="100%"
                        defaultLanguage="html"
                        defaultValue="<!--- Paste your svg code here --->" 
                        onMount={handleEditorDidMount} />
                </div>
                <div className={style.rightSide}>
                    <Editor
                        options={{ readOnly: true }}
                        theme='vs-dark'
                        height="100%"
                        width="100%"
                        defaultLanguage="javascript"
                        value={svgComponentResult} />
                </div>
            </div>
            <button type="button" onClick={doRequest}>convert</button>
        </div>
    )
}