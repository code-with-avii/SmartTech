import axios from "axios";

const LogoutUser = async () =>{
    try{
        await axios.post(
            "http://localhost:3000/api/auth/logout",
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