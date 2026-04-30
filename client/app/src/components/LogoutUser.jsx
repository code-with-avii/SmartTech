import axios from "axios";
import { API_URL } from "../Utils/config.js";

const LogoutUser = async () =>{
    try{
        await axios.post(
            `${API_URL}/api/auth/logout`,
            {},
            {withCredentials:true}
        );

    }
    catch(err){
        console.error(err);
    } finally {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    }

}
export default LogoutUser;