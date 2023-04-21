"use client"

import { useEffect, useState } from 'react';
import Issue from './issue'
import style from './toDo.module.css'

const ToDo = () => {
    const [issues, setIssues] = useState<{ id: string, title: string, text: string }[]>([]);

    // onMounted(() => {
    //     let ls_cards_data = window.localStorage.getItem('cards_data');
    //     if (ls_cards_data)
    //         issues.value = JSON.parse(ls_cards_data);

    //     if (!issues.value)
    //         issues.value = [];
    // });

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
        debugger
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
        <div className="todo-wrapper">
            <h1 className="todo-wrapper-title">TODO</h1>
            <div className="horizontal-line"></div>
            <div className="issues-container">
                {/* <div v-for="card in issues" :key="card.id" style="max-width: 100%;">
            <Issue @remove-card="removeCard" :id="card.id" :title="card.title" :text="card.text" />
        </div> */}
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
            <div className="issue-form-container">
                {/* <NewIssueForm @create-card="createCard" /> */}
            </div>
        </div>
    )
}

export default ToDo