
import style from "./glitchText.module.css"

export default function GlitchText(props: { text: string, className?: string }) {

    const { text, className } = props


    return (
        <div className={`${style.glitchWrapper} ${className}`}>
            <div className={style.glitch}
                data-glitch={text}>
                {text}
            </div>
        </div>
    )
}