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

        const req = await fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${searchValue}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '3bb3ed3a00msh08871bb7e87fcf7p196ee9jsnb2d8c2e70838',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
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