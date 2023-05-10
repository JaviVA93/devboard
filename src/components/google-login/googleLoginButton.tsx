

import { SupabaseClient, User } from "@supabase/supabase-js"
import style from "./googleLoginButton.module.css"
import GoogleLogo from "../assets/GoogleLogo"

const GoogleLoginButton = (props: { supabase: SupabaseClient }) => {
    
    const { supabase } = props



    async function signUp() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: document.location.origin + '/'
            }
        })
    }

    

    return (
        <button className={style.gMenuItem} onClick={signUp}>
            Login with Google
            <GoogleLogo className={style.gIcon} />
        </button>
    )


}

export default GoogleLoginButton