import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { useAtom } from "jotai";
import { userAtom } from "./context/jotai.js";
import Message from "./components/Message"
import useScrollRestoration from './custom_hooks/useScrollRestoration.jsx';
import { applyFiltersAndSort } from "./utils/actions";
import ErrorOverlay from "./components/ErrorOverlay.jsx"
import CreateButton from './components/CreateButton';
import api from './utils/axiosInstance.js';
    
export default function Index() {
    const [rawData, setRawData] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);
    const [filterCondition, setFilterCondition] = useState({ascending: false});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user,] = useAtom(userAtom);
    const { state } = useLocation();
    const [message, setMessage] = useState(state?.message);
    const {restoreScroll, saveScroll} = useScrollRestoration();

    useEffect( () => {
        async function getData() {
            setIsLoading(true);
            try {
                const { data } = await api.get('/recipes');
                setRawData(data);
                setError(null);
            } catch (error) {
                console.error(error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        getData();
    }, [user]);

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
    
    const filterAndOrder = (e) => {
        const { name } = e.target;
        setFilterCondition(prev => ({...prev, [name]: !filterCondition[name]}))
    };

    if (isLoading) {
        return <div>Loading Now...</div>
    };

    if (error) {
        return (
            <ErrorOverlay 
                errors={error.message}
                action={() => window.location.reload()}
                buttonMsg={"再読み込み"}
            />
        )
    };

    return (
    <div className="w-full">
        {user && <p className='text-center'>こんにちは<span className='font-bold'>{user?.username}</span>さん</p>}
        <AnimatePresence>
            {message && <Message message={message} setMessage={setMessage}/>}
        </AnimatePresence>
        <h1 className='text-center my-4'>さあ、ご飯の時間だ</h1>
        {filterCondition.ascending ?
            <button name="ascending" className="tag bg-gray-500 text-white rounded-2xl py-1 px-2 hover:bg-gray-600 mx-auto block mb-2" onClick={filterAndOrder}>新しい順にする</button>
            :
            <button name="ascending" className="tag bg-gray-500 text-white rounded-2xl py-1 px-2 hover:bg-gray-600 mx-auto block mb-2" onClick={filterAndOrder}>古い順にする</button>
        }
        <motion.div 
            className="w-60 sm:w-full mx-auto sm:flex sm:flex-wrap sm:justify-center sm:gap-5"
            layout initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: .5}}
        >
            {displayedData.map((d, i) => (
                <Link key={i} to={`/recipes/${d._id}`} onClick={saveScroll} className='hover:opacity-80 gradual'>
                    <li className='mx-auto mb-6 bg-gray-50 outline-3 outline-gray-200 rounded-2xl overflow-hidden shadow-md sm:w-60'>
                        <h1 className='text-center my-2 text-xl font-bold'>{d.title}</h1>
                        {d.topImage?.url ? 
                            <img src={d.topImage.url} className='w-full h-50 object-cover '/>
                            :
                            <div className="text-center h-40 bg-gray-200 flex items-center">
                                <p className='mx-auto'>No Image</p>
                            </div>
                        }
                        <div className="">
                            <p className='p-2'>{ d.caption && (
                                d.caption.length < 40 ? d.caption : d.caption.slice(0, 40)+'......')}</p>
                            <p className='px-2 border-y-2 border-gray-200 text-sm'>書いた人: <b className="">{d.author?.username}</b></p>
                            <p className='px-2 py-1 text-sm'>最終更新日: {new Date(d.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </li>
                </Link>
            ))}
        </motion.div>

        <CreateButton />
    </div>
    )
}