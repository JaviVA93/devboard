

import { SupabaseClient, User } from "@supabase/supabase-js"
import GitHubLogo from "../assets/GitHubLogo"
import style from "./githubLoginButton.module.css"
import { PATHS } from "@/utils/constants"

// import { supabase } from '@/utils/supabase'

const GithubLoginButton = (props: { supabase: SupabaseClient }) => {
    
    const { supabase } = props



    async function signUp() {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: document.location.origin + PATHS.BOARD
            }
        })
    }

    

    return (
        <button className={style.ghMenuItem} onClick={signUp}>
            Login with GitHub
            <GitHubLogo className={style.ghIcon} />
        </button>
    )


}

export default GithubLoginButton