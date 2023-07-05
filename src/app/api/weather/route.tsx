import { NextResponse } from "next/server"


export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url);
        const searchValue = searchParams.get('q');
        const req = await fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${searchValue}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY || '',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        })
        const data = await req.json()
    
        return NextResponse.json(data)
        
    } catch (err) {

        console.error(err)
        NextResponse.json({ error: "couldn't connect with the Weather API" }, { status: 400 })
        
    }
}