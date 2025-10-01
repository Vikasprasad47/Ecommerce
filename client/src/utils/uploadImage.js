import SummaryApi from '../comman/summaryApi'
import Axios from './axios'

const uploadImage = async (image) => {
    try {
        const formData = new FormData()
        formData.append('Image', image)
        const response = await Axios({
            ...SummaryApi.uploadImage,
            data: formData
        })
        return response
    } catch (error) {
        return error
    }
}
export default uploadImage