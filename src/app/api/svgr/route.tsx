import { transform } from '@svgr/core'
import jsxPlugin from '@svgr/plugin-jsx'
import prettierPlugin from '@svgr/plugin-prettier'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { code } = await request.json()
        if (!code)
            return NextResponse.json({data: null, error: 'code is empty'}, {status: 400})
        debugger
        const jsCode = await transform(
            code, {jsxRuntime: 'automatic', plugins: [jsxPlugin, prettierPlugin]},
            { componentName: 'SvgComponent' },
        )
    
        return NextResponse.json({data: jsCode})
        
    } catch (e) {
        console.error(e)
        return NextResponse.json({data: null, error: e}, {status: 400})
    }
}