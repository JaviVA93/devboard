"use client"
import { MouseEventHandler, useEffect, useRef, useState } from 'react'
import SearchSvg from '../assets/SearchSvg'
import style from './weather.module.css'
import Image from 'next/image'
import SimpleLoader from '../assets/simple-loader/SimpleLoader'

export default function Weather() {

    const [weatherData, setWeatherData] = useState<any>(null)
    const searcherElement = useRef<HTMLInputElement | null>(null)
    const [isLoadingData, setIsLoadingData] = useState(false)


    function saveLastSearchInLocalStorage(searchValue: string) {
        window.localStorage.setItem('weatherLastSearch', searchValue)
    }

    function getLastSearchFromLocalStorage() {
        return window.localStorage.getItem('weatherLastSearch')
    }

    async function getWeatherData(searchValue: string) {
        setIsLoadingData(true)

        const req = await fetch(`/api/weather?q=${searchValue}`, {
            method: 'GET',
        })
        const data = await req.json()
        setWeatherData(data)
        setIsLoadingData(false)
    }

    function doSearch(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        if(!searcherElement.current)
            return

        const searchValue = searcherElement.current.value
        if (searchValue === '')
            return

        saveLastSearchInLocalStorage(searchValue)

        getWeatherData(searchValue)
    }

    function initValuesFromLastSearch() {
        const lastSearchValue = getLastSearchFromLocalStorage();
        if (!lastSearchValue)
            return
        
        getWeatherData(lastSearchValue)

        if (!searcherElement.current)
            return
        
        searcherElement.current.value = lastSearchValue
    }

    useEffect(initValuesFromLastSearch, [])

    return (weatherData && !weatherData.error) 
        ?   (<div className={style.weather}>
                <form className={style.searchWrapper}>
                    {/* CHANGE THE SEARCH COMPOSITION TO A "FORM" IN ORDER TO USE ENTER TO START A SEARCH */}
                    <input type='text' ref={searcherElement} placeholder='How is the weather in...' />
                    <button className={style.searchBtn} onClick={doSearch} type='submit'>
                        {(!isLoadingData) ? <SearchSvg /> : <SimpleLoader style={{width: 15, height: 15}} />}
                    </button>
                </form>
                <div className={style.locationInfo}>
                    <span>{weatherData.location.name}, {weatherData.location.region}</span>
                    <span>{weatherData.location.country}</span>
                </div>
                <div className={style.weatherInfo}>
                    <div className={style.degreesWrapper}>
                        <h1 className={style.degrees}>{weatherData.current.temp_c}</h1>
                        <span>°C</span>
                    </div>
                    <div className={style.conditionWrapper}>
                        <Image src={`https:${weatherData.current.condition.icon}`} 
                            height={64} width={64} alt='weather image' />
                        <span>{weatherData.current.condition.text}</span>
                    </div>
                </div>
            </div>)
        :   <div className={style.weather} style={{display: 'flex', flexDirection: 'column'}}>
                <div className={style.searchWrapper}>
                    <input ref={searcherElement} placeholder='How is the weather in...' />
                    <button className={style.searchBtn} onClick={doSearch}>
                        {(!isLoadingData) ? <SearchSvg /> : <SimpleLoader style={{width: 15, height: 15}}/>}
                    </button>
                </div>
                <span>{(weatherData && weatherData.error)? weatherData.error.message : ''}</span>
            </div>
        
}