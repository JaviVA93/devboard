"use client"

import { useCallback, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import style from "./svgToComponent.module.css"
import toast from "react-hot-toast";
import SimpleLoader from "../assets/simple-loader/SimpleLoader";
import debounce from "lodash.debounce"

export default function SvgToComponent() {
    const defaultValueOnEditor = '<!--- Paste your svg code here --->'

    const [jsxComponent, setJsxComponent] = useState('')
    const [loadingJsx, setLoadingJsx] = useState(false)
    const activeEditor = useRef<any>(null)
    const rightSide = useRef<HTMLDivElement | null>(null)

    const doRequest = async () => {
        if (!activeEditor.current)
            return

        const svgCode = activeEditor.current.getValue()
        if (svgCode === defaultValueOnEditor || svgCode === "")
            return

        setLoadingJsx(true)

        const req = await fetch('/api/svgr', {
            method: 'POST',
            body: JSON.stringify({ code: svgCode })
        })

        const reqdata = await req.json()

        if (!reqdata.data) {
            toast.error("Unable to parse the SVG", { position: 'bottom-center' })
            if (rightSide.current) {
                rightSide.current.classList.add(style.shake)
                setTimeout(() => rightSide.current?.classList.remove(style.shake), 1000)
            }
        }
        else
            setJsxComponent(reqdata.data)

        setLoadingJsx(false)
    }

    function handleEditorDidMount(editor: any, monaco: any) {
        activeEditor.current = editor;
    }

    const debounceFn = useCallback(debounce(doRequest, 1000), [])

    const clearEditors = () => {
        if (!activeEditor.current) return

        activeEditor.current.setValue(defaultValueOnEditor)
        setJsxComponent('')
    }


    const copyJsxToClipboard = () => {
        navigator.clipboard.writeText(jsxComponent);
        toast('JSX copied to clipboard!', {
            position: 'bottom-center',
            style: {
                color: '#00D9ED',
                fontWeight: '600',
                backgroundColor: '#A14300',
                border: '1px solid #00D9ED'
            }
        })
    }

    return (
        <div className={style.svg2component}>
            <h1>SVG to React component</h1>
            <div className={style.editorsWrapper}>
                <div className={style.leftSide}>
                    <h3>SVG Input</h3>
                    <Editor
                        options={{ minimap: { enabled: false } }}
                        theme='vs-dark'
                        width="100%"
                        height={500}
                        defaultLanguage="html"
                        onMount={handleEditorDidMount}
                        defaultValue={defaultValueOnEditor}
                        onChange={() => debounceFn()} />
                </div>
                <div className={style.rightSide} ref={rightSide}>
                    <h3>JSX Output</h3>
                    <Editor
                        options={{ readOnly: true, minimap: { enabled: false } }}
                        theme='vs-dark'
                        width="100%"
                        height={500}
                        defaultLanguage="javascript"
                        value={jsxComponent} />
                    {
                        (loadingJsx)
                            ? <SimpleLoader className={style.loadingJsx} />
                            : ''
                    }
                </div>
            </div>
            <div className={style.buttonsWrapper}>
                <button className={style.clearBtn} type="button" onClick={clearEditors}>
                    Clear all
                </button>
                {
                    (jsxComponent === '')
                        ? ''
                        : <button className={style.copyClipboardBtn} type="button" onClick={copyJsxToClipboard}>
                            Copy to clipboard
                        </button>
                }
            </div>
        </div>
    )
}