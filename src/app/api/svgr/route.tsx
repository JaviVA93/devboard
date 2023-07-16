import { transform } from '@svgr/core'
import jsxPlugin from '@svgr/plugin-jsx'
import prettierPlugin from '@svgr/plugin-prettier'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    console.log('aqui')
    const { code } = await request.json()
    if (!code)
        return NextResponse.json({data: null, error: 'code is empty'}, {status: 400})

    const jsCode = await transform(
        code, {jsxRuntime: 'classic', plugins: [jsxPlugin, prettierPlugin]},
        { componentName: 'MyComponent', filePath: 'newSvgfile.jsx' },
    )

    return NextResponse.json({data: jsCode})
}