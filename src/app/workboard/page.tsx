
import Pomodoro from "@/components/pomodoro/Pomodoro";
import ToDo from "@/components/to-do/toDo";
import style from './workoardPage.module.css'
import ToolsBar from "@/components/toolsBar/toolsBar";

export default function Workboard() {
    return (
        <section className={style.workboard}>
            <ToolsBar />
            <h1>Your Workboard</h1>
            <Pomodoro />
            <ToDo />
        </section>
    )
}