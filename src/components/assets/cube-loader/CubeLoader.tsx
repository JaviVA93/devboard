
import style from './cubeLoader.module.css'

export default function CubeLoader(props?: any) {
    const { className } = props
    return (
        <div {...props} className={`${style.spinner} ${className}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}