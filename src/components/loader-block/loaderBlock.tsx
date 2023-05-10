
import style from "./loaderBlock.module.css"

export default function LoaderBlock( props: { className?: string, width?: number, height?: number }) {
    const { className, width, height } = props

    return (
        <div className={`${style.loaderBlock} ${className}`} style={{width, height}}></div>
    )
}