
import Image from 'next/image'
import style from './toolItemCard.module.css'

const ToolItemCard = (props: {
    toolName: string, imagePreviewPath: string, mainCardColor: string, titleColor: string
}) => {
    const { toolName, imagePreviewPath, mainCardColor, titleColor } = props;
    return (
        <div className={style.card} style={{ backgroundColor: mainCardColor }} draggable>
            <h2 style={{color: titleColor}}>{toolName}</h2>
            <Image src={imagePreviewPath} alt={`${toolName} image preview`} width='100' height='70' draggable="false" />
        </div>
    )
}

export default ToolItemCard