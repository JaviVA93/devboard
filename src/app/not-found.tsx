import Link from "next/link";
import Image from "next/image"
import style from "./not-found.module.css"
import { PATHS } from "@/utils/constants";


export default function NotFound() {
    return (
        <section className={style.notFoundSection}>
            <h1>Page Not Found</h1>
            <Image src="/gifs/this-is-fine-meme.gif" width={480} height={270} alt="this is fine meme" priority/>
            {/* USING "STANDAR" ANCHOR INSTEAD OF LINK DUE TO A BUG ON 404 PAGE */}
            <a href={PATHS.BOARD}>
                Back to board
            </a>
        </section>
    )
}