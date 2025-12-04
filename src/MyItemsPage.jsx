import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import { motion } from "motion/react";
import useScrollRestoration from "./custom_hooks/useScrollRestoration";
import { applyFiltersAndSort } from "./utils/actions";

export default function MyItemsPage () {    
    const { userId } = useParams();
    const [rawData, setRawData] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);
    const [filterCondition, setFilterCondition] = useState({draft: false, ascending: false});
    const [isLoading, setIsLoading] = useState(true);
    const { restoreScroll, saveScroll } = useScrollRestoration();
    const reqHeader = {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}};

    useEffect(() => {
        async function getSingleData (userId) {
            try {
                const { data } = await axios.get(`http://localhost:3000/api/recipes/myitems/${userId}`, reqHeader);
                setRawData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        getSingleData(userId);
    }, [userId]);

    useEffect(()=> {
        if (!isLoading && rawData.length > 0) {
            const timer = setTimeout(() => {
                restoreScroll();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isLoading, rawData.length]);
    
    useEffect(() => {
        setDisplayedData(applyFiltersAndSort(rawData, filterCondition));    
    }, [filterCondition, rawData]);

    if (isLoading) {
        return <div>Loading Now...</div>
    };

    const filterAndOrder = (e) => {
        const { name } = e.target;
        setFilterCondition(prev => ({...prev, [name]: !filterCondition[name]}))
    };

    return (
        <div className="w-90 mx-auto sm:w-full">
            <h1 className='text-center text-3xl my-4'>マイアイテム</h1>
            <div className="flex justify-center gap-5 mb-3">
                <button
                    name="draft"
                    className={`tag rounded-2xl py-1 px-2 text-white ${filterCondition.draft ? "bg-gray-700": "bg-gray-500"} hover:bg-gray-600`}
                    onClick={filterAndOrder}
                >
                    {filterCondition.draft ? <i className="ri-checkbox-circle-line"></i>: <i className="ri-checkbox-blank-circle-line"></i>}
                    下書きのみ
                </button>
                {filterCondition.ascending ?
                    <button name="ascending" className="tag bg-gray-500 text-white rounded-2xl py-1 px-2 hover:bg-gray-600" onClick={filterAndOrder}>新しい順にする</button>
                    :
                    <button name="ascending" className="tag bg-gray-500 text-white rounded-2xl py-1 px-2 hover:bg-gray-600" onClick={filterAndOrder}>古い順にする</button>
                }
            </div>
            <motion.div
                className="sm:mx-auto sm:flex sm:flex-wrap sm:justify-center sm:gap-5"
                layout initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: .5}}
            >
                {displayedData.map((d, i) => (
                    <Link to={`/recipes/${d._id}`} state={{ data: d}} onClick={saveScroll} key={i}>
                        <li className='w-70 mx-auto mb-6 bg-gray-50 outline-3 outline-gray-200 rounded-2xl overflow-hidden shadow-md sm:w-60'>
                            <h1 className='text-center my-4 text-xl font-bold'>{d.title}</h1>
                            {d.topImage ?
                                <img src={d.topImage.url} className='w-full h-50 object-cover '/>
                                :
                                <div className="text-center h-40 bg-gray-200 flex items-center">
                                    <p className='mx-auto'>No Image</p>
                                </div>
                            }
                            <div className="">
                            <p className='p-2'>{ d.caption && (
                                d.caption.length < 40 ? d.caption : d.caption.slice(0, 40)+'......')}</p>
                            <p className='px-2 border-y-2 border-gray-200 py-1 text-sm'>最終更新日: {new Date(d.updatedAt).toLocaleDateString()}</p>
                        </div>
                        </li>
                    </Link>
                ))}
            </motion.div>
        </div>
    )
}