
import style from './page.module.css'
import ToolsBar from "@/components/toolsBar/toolsBar";
import { cookies, headers } from "next/headers";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { TOOLS_LIST as tools } from "@/utils/constants";
import ToolsContainer from '@/components/tools-container/ToolsContainer';


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
                toolsToShow.push({ id: tool.id, component: tool.component })
        })
    }


    return (
        <section className={style.workboard}>
            <ToolsBar activeTools={toolsToShow.map(t => t.id)} />
            <h1>Your Board</h1>
            <ToolsContainer toolsToShow={toolsToShow} />
        </section>
    )
}