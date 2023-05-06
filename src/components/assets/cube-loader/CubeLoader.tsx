
import style from './cubeLoader.module.css'

export default function CubeLoader() {
    return (
        <div className={style.spinner}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}