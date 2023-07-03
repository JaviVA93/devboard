"use client"

import { useEffect, useRef, useState } from 'react'
import Issue from './issue'
import NewIssueForm from './newIssueForm'
import style from './toDo.module.css'
import { addTodo, removeTodo, getTodosFromSB, useSupabaseUserSession, useLoggedUser, setTodoAsDone, sessionState, setTodoAsNotDone, clearCompletedTasks as sbClearCompletedTasks, spUpdateTaskContent } from '@/utils/supabase'
import { v4 as uuidv4 } from 'uuid';
import CubeLoader from '../assets/cube-loader/CubeLoader'
import toast from 'react-hot-toast'


type Issue = {
    created_at: string
    description: string
    id: string
    name: string
    is_done: boolean
}

const ToDo = () => {

    const [todos, setTodos] = useState<{ userId: string, data: Issue[] }[]>([])
    const [loadingIssues, setLoadingIssues] = useState(true)
    const [userId, setUserId] = useState('guest')
    const [showingCompletedTasks, setShowingCompletedTasks] = useState(false)
    const userSession = useSupabaseUserSession()
    const loggedState = useLoggedUser()
    const completedTasksContainer = useRef<HTMLDivElement>(null)

    const userTodosIndex = todos.findIndex(e => e.userId === userId)

    const todosDone = todos[userTodosIndex]?.data.filter(e => e.is_done === true) || []
    const todosPending = todos[userTodosIndex]?.data.filter(e => e.is_done === false) || []


    async function createCard(name: string, description: string) {

        const todosTmp = (todos) ? [...todos] : []
        const currentDate = new Date().toISOString()
        const newIssue = {
            id: uuidv4(),
            name: name,
            description: description,
            created_at: currentDate,
            is_done: false,
        }


        if (userTodosIndex === -1)
            todosTmp.push({
                userId: userId,
                data: [newIssue]
            })
        else
            todosTmp[userTodosIndex].data.push(newIssue)

        window.localStorage.setItem('todos_data', JSON.stringify(todosTmp))
        setTodos(todosTmp)


        if (userId !== 'guest') {
            const { error } = await addTodo(newIssue)

            if (error)
                console.error(error)
        }


        showToast('New to-do created!')
    }



    async function removeCard(card_id: string) {

        if (userTodosIndex === -1)
            return;

        const tempTodos = (todos) ? [...todos] : []
        tempTodos[userTodosIndex].data = tempTodos[userTodosIndex].data.filter(issue => issue.id !== card_id)

        window.localStorage.setItem('todos_data', JSON.stringify(tempTodos))
        setTodos(tempTodos)


        if (loggedState === sessionState.logged) {
            const { error } = await removeTodo(card_id)
            if (error)
                console.error(error)
        }


        showToast('To-do deleted.')
    }



    function updateTodoListFromLocal() {
        let lsCardsData = window.localStorage.getItem('todos_data');
        if (lsCardsData)
            setTodos(JSON.parse(lsCardsData))

    }



    function updateTaskStatus(taskId: string, isCompleted: boolean) {

        if (userTodosIndex === -1)
            return

        const tempTodos = (todos) ? [...todos] : []
        if (tempTodos.length === 0)
            return

        const taskIndex = tempTodos[userTodosIndex].data.findIndex(i => i.id === taskId)
        if (taskIndex === -1)
            toast.error('Error updating task status, task not found.')

        tempTodos[userTodosIndex].data[taskIndex].is_done = isCompleted;

        window.localStorage.setItem('todos_data', JSON.stringify(tempTodos))
        setTodos(tempTodos)

        if (loggedState === sessionState.logged) {
            if (isCompleted) {
                setTodoAsDone(taskId).then(r => {
                    // REFRESH THE TASKS AFTER THE UPDATE
                    if (r.error)
                        toast.error('Error updating the task status')
                })
            }
            else {
                setTodoAsNotDone(taskId).then(r => {
                    // REFRESH THE TASKS AFTER THE UPDATE
                    if (r.error)
                        toast.error('Error updating the task status')
                })
            }
        }
    }



    async function clearCompletedTasks() {
        if (userTodosIndex === -1)
            return;

        const tempTodos = (todos) ? [...todos] : []
        tempTodos[userTodosIndex].data = tempTodos[userTodosIndex].data.filter(issue => !issue.is_done)

        window.localStorage.setItem('todos_data', JSON.stringify(tempTodos))
        setTodos(tempTodos)


        if (loggedState === sessionState.logged) {
            const { error } = await sbClearCompletedTasks()
            if (error)
                console.error(error)
        }


        showToast('To-do deleted.')
    }


    async function updateTaskContent(id: string, name: string, description: string) {
        if (userTodosIndex === -1)
            return

        const tempTodos = (todos) ? [...todos] : []
        if (tempTodos.length === 0)
            return

        const taskIndex = tempTodos[userTodosIndex].data.findIndex(i => i.id === id)
        if (taskIndex === -1)
            toast.error('Error updating task status, task not found.')

        tempTodos[userTodosIndex].data[taskIndex].name = name;
        tempTodos[userTodosIndex].data[taskIndex].description = description;

        window.localStorage.setItem('todos_data', JSON.stringify(tempTodos))
        setTodos(tempTodos)

        if (loggedState === sessionState.logged) {
            const { error } = await spUpdateTaskContent(id, name, description)
            if (error)
                toast.error('Error updating the task remotely')
        }
    }



    function showToast(message: string) {
        toast(message, {
            position: 'bottom-center',
            icon: '📝',
            style: {
                fontSize: 18,
                fontWeight: 600,
                backgroundColor: '#76B576',
                color: '#1B291B',
                border: '1px solid #acb9b7'
            }
        });
    }



    function getUpdatedTasks() {
        return new Promise(resolve => {

            if (loggedState === sessionState.loading || !userSession) {
                resolve('loading')
                return
            }

            const userId = (userSession === 'guest') ? 'guest' : userSession.id
            setUserId(userId)

            if (userId === 'guest') {
                updateTodoListFromLocal()
                resolve('done')
            }
            else {
                getTodosFromSB().then(({ data, error }: { data: Issue[], error: any }) => {
                    if (error || data.length === 0)
                        updateTodoListFromLocal()
                    else {
                        const rawLocalTodos = window.localStorage.getItem('todos_data')
                        const localTodosAll: { userId: string, data: Issue[] }[] = (rawLocalTodos) ? JSON.parse(rawLocalTodos) : []


                        const localTodos: { userId: string; data: Issue[] } = localTodosAll.find(e => e.userId === userId) || { userId: userId, data: [] }

                        const diff = localTodos.data.filter(x => !data.find(y => y.id === x.id))
                        diff.forEach(todo => addTodo(todo))

                        const concateTodos = data.concat(diff)

                        const index = localTodosAll.findIndex(e => e.userId === userId)
                        if (index === -1)
                            localTodosAll.push({ userId: userId, data: concateTodos })
                        else
                            localTodosAll[index].data = concateTodos

                        window.localStorage.setItem('todos_data', JSON.stringify(localTodosAll))

                        setTodos(localTodosAll)
                    }

                    resolve('done')
                })
            }
        })
    }



    useEffect(() => {
        setLoadingIssues(true)
        getUpdatedTasks().then(r => {
            if (r === 'done')
                setLoadingIssues(false)
        })

    }, [loggedState])

    const loadingIssuesElement =
        <div className={style.loadingWrapper}>
            <h2>Loading tasks</h2>
            <CubeLoader />
        </div>


    return (
        <div className={style.todoWrapper}>
            <h1 className={style.todoWrapperTitle}>My Tasks</h1>
            <div className={style.issuesContainer}>
                {loadingIssues
                    ? loadingIssuesElement
                    : (userTodosIndex !== -1 && todosPending.length > 0)
                        ? todosPending.map(data => {
                            return (
                                <Issue
                                    removeIssueOnList={removeCard}
                                    updateTaskStatus={updateTaskStatus}
                                    updateTaskContent={updateTaskContent}
                                    key={data.id}
                                    id={data.id}
                                    name={data.name}
                                    description={data.description}
                                    isDone={data.is_done}
                                />)
                        })
                        : <h1 className={style.tasksCompletedTitle}>All tasks completed 😃</h1>
                }
            </div>
            {!loadingIssues && showingCompletedTasks && todosDone.length > 0
                ? <div ref={completedTasksContainer} className={style.doneIssuesContainer}>
                    <h2>Completed tasks</h2>
                    <button className={`${style.hideCompletedTasksBtn} ${style.completedTasksBtns}`}
                        onClick={() => setShowingCompletedTasks(false)}>
                        Hide completed tasks
                    </button>
                    <div className={style.issuesContainer}>
                        {
                            todosDone.map(data => {
                                return (
                                    <Issue
                                        removeIssueOnList={removeCard}
                                        updateTaskStatus={updateTaskStatus}
                                        updateTaskContent={updateTaskContent}
                                        key={data.id}
                                        id={data.id}
                                        name={data.name}
                                        description={data.description}
                                        isDone={data.is_done}
                                    />)
                            })
                        }
                    </div>
                    <button
                        className={`${style.clearCompletedTasks} ${style.completedTasksBtns}`}
                        onClick={clearCompletedTasks}
                        type='button'>
                        Clear all
                    </button>
                </div>
                : ''
            }
            {loadingIssues
                ? ''
                : <div className={style.issueFormContainer}>
                    <NewIssueForm createIssueOnList={createCard} />
                </div>
            }
            {(!loadingIssues && todosDone.length > 0 && !showingCompletedTasks)
                ? <button className={style.showCompletedTasksBtn} onClick={() => setShowingCompletedTasks(true)}>
                    Show completed tasks
                </button>
                : ''
            }
        </div>
    )
}

export default ToDo