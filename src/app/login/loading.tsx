
import style from "./loginPage.module.css"
import LoaderBlock from "@/components/loader-block/loaderBlock"

export default function SuspenseLoginPage() {
    return (
        <section className={style.section}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <LoaderBlock className={style.loaderBlock} height={212} width={400} />
                <LoaderBlock className={style.loaderBlock} height={70} width={247} />
                <LoaderBlock className={style.loaderBlock} height={70} width={247} />
            </div>
            <div style={{ alignSelf: 'center', justifySelf: 'center' }}>
                <LoaderBlock className={style.loaderBlock} height={214} width={400} />
            </div>
        </section>
    )
}