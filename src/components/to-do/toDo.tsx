"use client"

import { useEffect, useState } from 'react';
import Issue from './issue'
import style from './toDo.module.css'

const ToDo = () => {

    const [issues, setIssues] = useState<{ id: string, title: string, text: string }[]>([]);

    function createCard(title: string, text: string) {
        const issuesTmp = issues || [];
        issuesTmp.push({
            id: Math.floor(Math.random() * 100000).toString(),
            title: title,
            text: text
        })
        window.localStorage.setItem('cards_data', JSON.stringify(issuesTmp))
        setIssues(issuesTmp)
    }

    function removeCard(card_id: string) {
        if (issues) {
            const issuesTmp = issues.filter(issue => issue.id !== card_id)
            window.localStorage.setItem('cards_data', JSON.stringify(issuesTmp))
            setIssues(issuesTmp)
        }
    }

    useEffect(() => {
        let ls_cards_data = window.localStorage.getItem('cards_data');
        if (ls_cards_data)
            setIssues(JSON.parse(ls_cards_data))

    }, [])

    return (
        <div className={style.todoWrapper}>
            <h1 className={style.todoWrapperTitle}>TODO</h1>
            <div className={style.horizontalUine}></div>
            <div className={style.issuesContainer}>
                {
                    issues.map(data =>
                        <Issue
                            removeIssueOnList={removeCard} 
                            key={data.id} 
                            id={data.id} 
                            title={data.title} 
                            text={data.text} 
                        />)
                }
            </div>
            <div className={style.issueFormContainer}>
                {/* <NewIssueForm @create-card="createCard" /> */}
            </div>
        </div>
    )
}

export default ToDo