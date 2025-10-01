import React, { useEffect, useState } from 'react';
import CardLoading from '../components/CardLoading';
import SummaryApi from '../comman/summaryApi';
import Axios from '../utils/axios';
import AxiosToastError from '../utils/AxiosToastErroe';
import CardProduct from '../components/CartProduct';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import nothing from '../assets/nothing here yet.webp'

function SearchPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const params = useLocation();
  const searchText = decodeURIComponent(params?.search?.slice(3) || '');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchProducts,
        data: {
          search: searchText,
          page: page,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data);
        } else {
          setData((prev) => [...prev, ...responseData.data]);
        }
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchText]);

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto p-4">
        <p className="font-semibold">Search Results: {data.length}</p>

        {!loading && data.length === 0 && (
          <div className="text-center mt-10 text-gray-600 text-lg font-medium">
            <div className='flex items-center flex-col justify-center'>
              <img width={170} src={nothing} alt="" className=''/>
              <p>No product found for "<span className="text-black font-semibold">{searchText}</span>"</p>
              </div>
          </div>
        )}

        <InfiniteScroll dataLength={data.length} hasMore={true} next={handleFetchMore}>
          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:gap-8 gap-3 lg:gap-y-6">
              {data.map((p, index) => (
                <CardProduct data={p} key={p?._id + 'searchPage' + index} searchText={searchText} />
              ))}

              {loading &&
                loadingArrayCard.map((_, index) => (
                  <CardLoading key={'loadingSearchpage' + index} />
                ))}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </section>
  );
}

export default SearchPage;
