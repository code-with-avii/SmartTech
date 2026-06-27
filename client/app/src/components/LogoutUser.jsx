import axios from "axios";
import { API_URL } from "../Utils/config.js";

const LogoutUser = async () =>{
    const token = localStorage.getItem("accessToken");
    try{
        await axios.post(
            `${API_URL}/api/auth/logout`,
            {},
            {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
        );

    }
    catch(err){
        console.error(err);
    } finally {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    }

}
export default LogoutUser;