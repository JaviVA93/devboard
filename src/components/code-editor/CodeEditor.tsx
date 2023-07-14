"use client"

import Editor from '@monaco-editor/react'
import style from './codeEditor.module.css'

export default function CodeEditor() {
    return (
        <div className={style.ceContainer}>
            <Editor 
                theme='vs-dark'
                height="100%" 
                width="100%" 
                defaultLanguage="javascript" 
                defaultValue="// Start coding 🙂" />
        </div>
    )
}