
import Pomodoro from "@/components/pomodoro/Pomodoro";
import ToDo from "@/components/to-do/toDo";
import style from './workoardPage.module.css'

export default function Workboard() {
    return (
        <main className={style.workboard}>
            <h1>Your Workboard</h1>
            <Pomodoro />
            <ToDo />
        </main>
    )
}