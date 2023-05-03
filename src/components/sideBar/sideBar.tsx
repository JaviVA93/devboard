
import Link from 'next/link'
import style from './sideBar.module.css'

const SideBar = () => {
    const sidebarRoutes = [
        { name: 'Home', route: '/' },
        { name: 'Workboard', route: '/workboard' },
        { name: 'Sign up', route: '/signup' },
        { name: 'About', route: '/about' },
    ]

    return (
        <nav className={style.sideBar}>
            <div className={style.burguer}>
                <svg strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                    <path d="M3 5h18M3 12h18M3 19h18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
            </div>
            <menu>
                {sidebarRoutes.map(r =>
                    <li key={r.route}>
                        <Link href={r.route}>{r.name}</Link>
                    </li>
                )}
            </menu>
        </nav>
    )
}

export default SideBar