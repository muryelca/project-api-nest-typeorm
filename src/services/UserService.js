import axios from "axios"
import Config from "../util/Config"

class UserService{

    async create(user){
        return axios({
            url: Config.API_URL + "api/auth/register",
            method: "POST",
            timeout: Config.TIMEOUT_REQUEST,
            data: user,
            headers: Config.HEADER_REQUEST
        }).then((response) => {
            return Promise.resolve(response)
        }).catch((error) => {
            return Promise.reject(error)
        })
    }
}

const userService = new UserService()
export default userService