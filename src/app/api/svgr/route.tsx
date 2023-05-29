
import { transform } from '@svgr/core'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {

        const { svg } = await request.json()
        const svgComponent = await transform(svg, {icon: true}, {componentName: 'newSvgComponent'})
        
        return NextResponse.json({ svgComponent: svgComponent })

    } catch (error) {
        return NextResponse.json({data: null, error: 'invalid request data'}, { status: 400 })
    }

}