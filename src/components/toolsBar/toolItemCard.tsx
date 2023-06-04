
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

    function addToolToBoard() {
        const workboardToolsCookie = getCookieValue('workboard-tools')
        let result = ''
        if (!workboardToolsCookie) {
            result = toolId
        }
        else if (!workboardToolsCookie.includes(toolId)) {
            result = `${workboardToolsCookie},${toolId}`
        }

        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000*36000;
        now.setTime(expireTime);
        document.cookie = `workboard-tools=${result}; path=/; expires=${now.toUTCString()}`
        document.location.reload()
    }

    function removeToolFromBoard() {
        const workboardToolsCookie = getCookieValue('workboard-tools')
        if (!workboardToolsCookie)
            return
        
        const toolsArr = workboardToolsCookie.split(',')
        const index = toolsArr.indexOf(toolId)
        if (index === -1)
            return
        
        toolsArr.splice(index, 1)

        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000*36000;
        now.setTime(expireTime);
        document.cookie = `workboard-tools=${toolsArr.join(',')}; path=/; expires=${now.toUTCString()}`
        document.location.reload()
    }

    const removeWrapperElement =
        <button type='button' className={`${style.addRemoveWrapper} ${style.removeBtn}`} onClick={removeToolFromBoard}>
            <TrashSvg /> Remove
        </button>

    const addWrapperElement =
        <button type='button' className={`${style.addRemoveWrapper} ${style.addBtn}`} onClick={addToolToBoard}>
            <PlusSvg /> Add
        </button>

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