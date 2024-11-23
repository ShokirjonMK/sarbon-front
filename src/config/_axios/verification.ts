import SignIn from "pages/login/login";
// import { useNavigate } from "react-router-dom";
import store from "store";


const verification = (role?: string) => {
    // const navigate = useNavigate();
    try {

        const token = localStorage.getItem('access_token')
        const active_role = localStorage.getItem("active_role") ?? undefined

        if (token) {
            store.dispatch(SignIn({ type: 'verification', data: undefined, role: role ?? active_role }));
            sessionStorage.removeItem("page_loading");
        } else {
            // sessionStorage.removeItem("page_loading");
            // navigate("/");
        }

    } catch (error) {
        // sessionStorage.removeItem("page_loading");

    }
}

export default verification;