import api from "../Utils/api.js";

const LogoutUser = async () =>{
    try{
        await api.post("/api/auth/logout");

    }
    catch(err){
        console.error(err);
    } finally {
        localStorage.removeItem("user");
    }

}
export default LogoutUser;