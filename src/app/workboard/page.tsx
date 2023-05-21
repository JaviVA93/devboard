
import Pomodoro from "@/components/pomodoro/Pomodoro";
import ToDo from "@/components/to-do/toDo";
import style from './workoardPage.module.css'
import ToolsBar from "@/components/toolsBar/toolsBar";
import ClampCalculator from "@/components/clamp-calculator/ClampCalculator";
import { cookies } from "next/headers";
import { cloneElement } from "react";
import { useRouter } from "next/navigation";

export default function Workboard() {
    const toolsToShow: {id: string, component: JSX.Element}[] = []

    const tools = [
        {
            id:'pomodoro',
            component: <Pomodoro />
        },
        {
            id:'todo',
            component: <ToDo />
        },
        {
            id: 'clampcalc',
            component: <ClampCalculator />
        }
    ]

    const toolsCookie = cookies().get('workboard-tools')?.value
    if (toolsCookie) {
        const toolsSplited = toolsCookie.split(',');
        toolsSplited.forEach(id => {
            const tool = tools.find(v => v.id === id)
            if (tool)
                toolsToShow.push(tool)
        })
    }



    return (
        <section className={style.workboard}>
            <ToolsBar />
            <h1>Your Workboard</h1>
            {toolsToShow.length > 0
                ? toolsToShow.map(t =>  cloneElement(t.component, {key: t.id}))
                : <h1>Add tools to your workboard!</h1>}
        </section>
    )
}