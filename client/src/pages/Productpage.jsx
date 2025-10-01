import React, { useEffect, useState } from 'react'
import SummaryApi from '../comman/summaryApi'
import AxiosToastError from '../utils/AxiosToastErroe'
import Axios from '../utils/axios'


const Productpage = () => {
    const [productData,setProductData] = useState([])
    const [page,setPage] = useState(1)
    
    const fetchProductData = async()=>{
        try {
            const response = await Axios({
            ...SummaryApi.getProduct,
            data : {
                page : page,
            }
            })

            const { data : responseData } = response 

            if(responseData.success){
            
            setProductData(responseData.data)
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }
    
    useEffect(()=>{
        fetchProductData()
    },[])

    return (
        <div>
            Product
        </div>
    )
}

export default Productpage
