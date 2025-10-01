// for production
// import toast from "react-hot-toast"
// const AxiosToastError = (error) =>{
    //     toast.error(
        //         error.response?.data.message
        //     )
        // }
        
// export default AxiosToastError
        
        


// for testing and debuging
import toast from "react-hot-toast"
const AxiosToastError = (error) => {
    console.error("Upload Error:", error); // log entire error
    let message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
    toast.error(message);
};
export default AxiosToastError