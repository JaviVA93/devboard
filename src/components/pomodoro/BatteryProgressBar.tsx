
import style from './batteryProgressBar.module.css'

export default function BatteryProgressBar(props: { percentageLoaded: number }) {
    return (
        <div
            className={style.progress}
            style={{ backgroundSize: props.percentageLoaded }}
        >
        </div>
    )
}