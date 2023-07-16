
import Pomodoro from "@/components/pomodoro/Pomodoro";
import ToDo from "@/components/to-do/toDo";
import style from './page.module.css'
import ToolsBar from "@/components/toolsBar/toolsBar";
import ClampCalculator from "@/components/clamp-calculator/ClampCalculator";
import Weather from "@/components/weather/weather";
import { cookies, headers } from "next/headers";
import { cloneElement } from "react";
import ArrowSvg from "@/components/assets/ArrowSvg";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import ColorPicker from "@/components/color-picker/ColorPicker";
import CodeEditor from "@/components/code-editor/CodeEditor";
import SvgToComponent from "@/components/svg-to-component/SvgToComponent";
import { TOOLS_LIST as tools } from "@/utils/constants";


export default async function Workboard() {
    const toolsToShow: { id: string, component: JSX.Element }[] = []

    let toolsCookie: null | string = null
    let toolsConfigFromDB: null | string = null
    const supabase = createRouteHandlerSupabaseClient({
        headers,
        cookies
    })
    if (cookies().get('supabase-auth-token')) {

        const { data, error } = await supabase.from('board-tools').select('tools')

        if (data && data.length > 0) {
            toolsCookie = data[0].tools
            toolsConfigFromDB = data[0].tools
        }
    }

    if (!toolsCookie) {
        toolsCookie = cookies().get('devboard-tools')?.value || null

        if (!toolsConfigFromDB) {
            const user = await supabase.auth.getUser()
            if (user.data.user) {
                const id = user.data.user.id
                supabase.from('board-tools').upsert({
                    user_id: id,
                    tools: toolsCookie
                }).then(() => { /* DO NOTHING */ })
            }
        }

    }

    if (toolsCookie) {
        const toolsSplited = toolsCookie.split(',');
        toolsSplited.forEach(id => {
            const tool = tools.find(v => v.id === id)
            if (tool)
                toolsToShow.push({id: tool.id, component: tool.component})
        })
    }

    return (
        <section className={style.workboard}>
            <ToolsBar />
            <h1>Your Board</h1>
            {toolsToShow.length > 0
                ? <div className={style.toolsContainer}>
                    {toolsToShow.map(t => cloneElement(t.component, { key: t.id }))}
                </div>
                : <div>
                    <h1 className={style.emptyBoardMsg}>Add tools to your workboard!</h1>
                    <div className={style.emptyBoardArrowWrapper}>
                        <ArrowSvg className={style.emptyBoardArrow} />
                    </div>
                </div>}

        </section>
    )
}