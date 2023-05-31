"use client"
import { useRef, useState } from 'react'

export default function Weather() {

    const [weatherData, setWeatherData] = useState('')
    const searcherElement = useRef<HTMLInputElement | null>(null)

    async function getWeatherData() {
        if(!searcherElement.current)
            return

        const searchValue = searcherElement.current.value
        if (searchValue === '')
            return

        const req = await fetch(`/api/weather?q=${searchValue}`, {
            method: 'GET',
        })
        const data = await req.json()
        setWeatherData(JSON.stringify(data, undefined, 2))
    
    }
    return (
        <div>
            <input ref={searcherElement} placeholder='How is the weather in...'></input>
            <button onClick={getWeatherData}>Search</button>
            <br></br>
            <pre>{weatherData}</pre>
        </div>
    )
}