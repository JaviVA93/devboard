"use client"
import { useEffect, useRef, useState } from 'react'
import SearchSvg from '../assets/SearchSvg'
import style from './weather.module.css'
import Image from 'next/image'

export default function Weather() {

    const [weatherData, setWeatherData] = useState<any>(null)
    const searcherElement = useRef<HTMLInputElement | null>(null)


    function saveLastSearchInLocalStorage(searchValue: string) {
        window.localStorage.setItem('weatherLastSearch', searchValue)
    }

    function getLastSearchFromLocalStorage() {
        return window.localStorage.getItem('weatherLastSearch')
    }

    async function getWeatherData(searchValue: string) {
        const req = await fetch(`/api/weather?q=${searchValue}`, {
            method: 'GET',
        })
        const data = await req.json()
        setWeatherData(data)
    }

    function doSearch() {
        if(!searcherElement.current)
            return

        const searchValue = searcherElement.current.value
        if (searchValue === '' || searchValue === getLastSearchFromLocalStorage())
            return

        saveLastSearchInLocalStorage(searchValue)

        getWeatherData(searchValue)
    }

    function initValuesFromLastSearch() {
        const lastSearchValue = getLastSearchFromLocalStorage();
        if (!lastSearchValue)
            return
        
        getWeatherData(lastSearchValue)
    }

    useEffect(initValuesFromLastSearch, [])

    return (weatherData) 
        ?   (<div className={style.weather}>
                <div className={style.searchWrapper}>
                    {/* CHANGE THE SEARCH COMPOSITION TO A "FORM" IN ORDER TO USE ENTER TO START A SEARCH */}
                    <input ref={searcherElement} placeholder='How is the weather in...'></input>
                    <button className={style.searchBtn} onClick={doSearch}>
                        <SearchSvg />
                    </button>
                </div>
                <div className={style.locationInfo}>
                    <span>{weatherData.location.name}, {weatherData.location.region}</span>
                    <span>{weatherData.location.country}</span>
                </div>
                <div className={style.degreesWrapper}>
                    <h1 className={style.degrees}>{weatherData.current.temp_c}</h1>
                    <span>°C</span>
                </div>
                <div className={style.conditionWrapper}>
                    <Image src={`https:${weatherData.current.condition.icon}`} 
                        height={50} width={50} alt='weather image' />
                    <span>{weatherData.current.condition.text}</span>
                </div>
            </div>)
        :   <div className={style.searchWrapper}>
                <input ref={searcherElement} placeholder='How is the weather in...'></input>
                <button className={style.searchBtn} onClick={doSearch}>
                    <SearchSvg />
                </button>
            </div>
        
}