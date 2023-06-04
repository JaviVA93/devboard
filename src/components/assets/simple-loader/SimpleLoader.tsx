
import style from './simpleLoader.module.css'

export default function SimpleLoader(props?: any) {
    return <div {...props} className={`${style.loader} ${props.className || ''}`}></div>
}