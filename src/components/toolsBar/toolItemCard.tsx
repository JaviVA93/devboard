
import Image from 'next/image'
import style from './toolItemCard.module.css'
import TrashSvg from '../assets/TrashSvg';
import PlusSvg from '../assets/PlusSvg';
import { getCookieValue } from '@/utils/utils';

const ToolItemCard = (props: {
    toolName: string, imagePreviewPath: string, mainCardColor: string, titleColor: string, toolId: string
}) => {

    const { toolName, imagePreviewPath, mainCardColor, titleColor, toolId } = props;
    const toolsCookie = getCookieValue('workboard-tools')
    let toolOnBoard = (toolsCookie?.includes(toolId)) ? true : false;

    // TO-DO: Add "mainColor" to the SVG stroke attribute

    const removeWrapperElement =
        <div className={style.addRemoveWrapper}>
            <TrashSvg /> Remove
        </div>

    const addWrapperElement =
        <div className={style.addRemoveWrapper}>
            <PlusSvg /> Add
        </div>

    return (
        <div className={style.card} style={{ backgroundColor: mainCardColor }} draggable>
            <h2 style={{ color: titleColor }}>{toolName}</h2>
            <Image src={imagePreviewPath}
                alt={`${toolName} image preview`}
                width='100'
                height='70'
                draggable="false"
            />
            {!!(toolOnBoard)
                ? removeWrapperElement
                : addWrapperElement}
        </div>
    )
}

export default ToolItemCard