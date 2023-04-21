import Pomodoro from "@/components/pomodoro/Pomodoro";
import ToDo from "@/components/to-do/toDo";

export default function Workboard() {
    return (
        <div>
            <h1>Your Workboard</h1>
            <Pomodoro />
            <ToDo />
        </div>
    )
}