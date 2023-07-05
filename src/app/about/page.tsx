
import GitHubLogo from '@/components/assets/GitHubLogo'
import style from './aboutPage.module.css'
import Image from 'next/image'
import DeveloperIllustrationSvg from '@/components/assets/DeveloperIllustrationSvg'

export default function AboutPage() {
    return (
        <section className={style.aboutSection}>
            <h1>About the devboard</h1>
            <p>Just some tools to help you with your daily work routine. Thanks for visiting! 🙂</p>
            <DeveloperIllustrationSvg className={style.illustration} />
            <footer>
                <span>Check the repo on</span>
                <a href='https://github.com/JaviVA93/devboard' target='_blank'>
                    GitHub
                    <GitHubLogo strokeColor='#39F0C1'/>
                </a>
                
            </footer>
        </section>
    )
}