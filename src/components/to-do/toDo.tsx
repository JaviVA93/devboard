"use client"

import { useEffect, useState } from 'react'
import Issue from './issue'
import NewIssueForm from './newIssueForm'
import style from './toDo.module.css'
import { TodosResponseSuccess, addTodo, removeTodo, getTodos, supabase } from '@/utils/supabase'
import { v4 as uuidv4 } from 'uuid';

const ToDo = () => {

    const [issues, setIssues] = useState<TodosResponseSuccess>([])
    const [loadingIssues, setLoadingIssues] = useState(true)


    async function createCard(name: string, description: string) {
        const userResponse = await supabase.auth.getUser()
        const isLogged = (userResponse.data.user?.id) ? true : false
        let userId = userResponse.data.user?.id || 'guest';

        const issuesTmp = (issues) ? [...issues] : []; // forze re-render without using "issues" direct reference
        const currentDate = new Date().toISOString()
        const newIssue = {
            id: uuidv4(),
            name: name,
            description: description,
            created_at: currentDate,
            user_id: userId
        }
        issuesTmp.push(newIssue)
        window.localStorage.setItem('cards_data', JSON.stringify(issuesTmp))

        if (isLogged) {
            const { error } = await addTodo(newIssue)
            if (error)
                console.error(error)
        }

        setIssues(issuesTmp)
    }



    async function removeCard(card_id: string) {
        const issuesTmp = issues?.filter(issue => issue.id !== card_id)
        if (!issuesTmp)
            return

        window.localStorage.setItem('cards_data', JSON.stringify(issuesTmp))
        setIssues(issuesTmp)


        const userResponse = await supabase.auth.getUser()
        if (userResponse.data?.user) {
            const { error } = await removeTodo(card_id)
            if (error)
                console.error(error)
        }
    }

    function updateTodoListFromLocal() {
        let ls_cards_data = window.localStorage.getItem('cards_data');
        if (ls_cards_data)
            setIssues(JSON.parse(ls_cards_data))
    }

    async function updateTodoList() {
        const { data, error } = await getTodos()

        if (error) {
            console.error(error)
            updateTodoListFromLocal()
        }
        else
            setIssues(data)

        setLoadingIssues(false)
    }


    useEffect(() => {
        setLoadingIssues(true)
        updateTodoList()

    }, [])





    return (
        <div className={style.todoWrapper}>
            <h1 className={style.todoWrapperTitle}>TODO</h1>
            <div className={style.horizontalUine}></div>
            <div className={style.issuesContainer}>
                {loadingIssues
                    ? <span>Loading...</span>
                    : issues?.map(data =>
                        <Issue
                            removeIssueOnList={removeCard}
                            key={data.id}
                            id={data.id}
                            title={data.name}
                            text={data.description}
                        />)
                }
            </div>
            <div className={style.issueFormContainer}>
                <NewIssueForm createIssueOnList={createCard} />
            </div>
        </div>
    )
}

export default ToDo