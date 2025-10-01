import Axios from "./axios"
import SummaryApi from "../comman/summaryApi"

const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.userDetails
        })

        return response.data
    } catch (error) { 
        console.log(error)
    }
}

export default fetchUserDetails