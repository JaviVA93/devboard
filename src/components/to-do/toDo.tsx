"use client"

import { useEffect, useState } from 'react'
import Issue from './issue'
import NewIssueForm from './newIssueForm'
import style from './toDo.module.css'
import { addTodo, removeTodo, getTodosFromSB } from '@/utils/supabase'
import { v4 as uuidv4 } from 'uuid';
import { useSupabase } from '@/app/supabase-context'
import CubeLoader from '../assets/cube-loader/CubeLoader'

type Issue = {
    created_at: string
    description: string
    id: string
    name: string
}

const ToDo = () => {

    const [todos, setTodos] = useState<Issue[]>([])
    const [loadingIssues, setLoadingIssues] = useState(true)
    const { supabase } = useSupabase();



    async function createCard(name: string, description: string) {

        const userResponse = await supabase.auth.getUser()
        const isLogged = (userResponse.data.user?.id) ? true : false

        const todosTmp = (todos) ? [...todos] : []
        const currentDate = new Date().toISOString()
        const newIssue = {
            id: uuidv4(),
            name: name,
            description: description,
            created_at: currentDate
        }
        todosTmp.push(newIssue)
        window.localStorage.setItem('todos_data', JSON.stringify(todosTmp))

        if (isLogged) {
            const { error } = await addTodo(newIssue)

            if (error)
                console.error(error)
        }

        setTodos(todosTmp)
    }



    async function removeCard(card_id: string) {

        const issuesTmp = todos?.filter(issue => issue.id !== card_id)
        if (!issuesTmp)
            return

        window.localStorage.setItem('todos_data', JSON.stringify(issuesTmp))
        setTodos(issuesTmp)


        // const userResponse = await supabase.auth.getUser()
        // if (userResponse.data?.user) {
        const { error } = await removeTodo(card_id)
        if (error)
            console.error(error)
        // }
    }



    function updateTodoListFromLocal() {

        let lsCardsData = window.localStorage.getItem('todos_data');
        if (lsCardsData)
            setTodos(JSON.parse(lsCardsData))

    }



    async function updateTodoList() {

        // TO-DO: UPDATE TODOS IN LOCALSTORAGE
        // CHECK IF LOCAL AND REMOTE DATA IS THE SAME, IF NOT, CREATE LOCAL ISSUES INTO DB

        const { data, error }:{ data: Issue[], error: any} = await getTodosFromSB()

        if (error || data.length === 0) {
            updateTodoListFromLocal()
        }
        else {
            const rawLocalTodos = window.localStorage.getItem('todos_data')
            const localTodos:Issue[] | [] = (rawLocalTodos) ? JSON.parse(rawLocalTodos) : []

            
            const diff = localTodos.filter(x => !data.find(y => y.id === x.id))
            diff.forEach(todo => addTodo(todo))

            const concateTodos = data.concat(diff)
            window.localStorage.setItem('todos_data', JSON.stringify(concateTodos))

            setTodos(concateTodos)
        }

        setLoadingIssues(false)
    }



    const todosListElements = (todos.length === 0)
        ? <h1 className={style.tasksCompletedTitle}>All tasks completed 😃</h1>
        : todos?.map(data =>
            <Issue
                removeIssueOnList={removeCard}
                key={data.id}
                id={data.id}
                title={data.name}
                text={data.description}
            />)


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
                    ? <div className={style.loadingWrapper}>
                        <h2>Loading tasks</h2>
                        <CubeLoader />
                    </div>
                    : todosListElements
                }
            </div>
            {loadingIssues
                ? ''
                : <div className={style.issueFormContainer}>
                    <NewIssueForm createIssueOnList={createCard} />
                </div>
            }
        </div>
    )
}

export default ToDo