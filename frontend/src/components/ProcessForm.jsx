import { useState } from "react";
import { motion } from "motion/react";
import IndexNum from './IndexNum';
import { createUniqueId } from "../utils/actions";

export default function ProcessForm({processes, validation, setRecipe}) {
    const handleAddProcess = i => {
        setRecipe(prev => {
            const initial = {description: '', hasImage: false, file: null, ImageUrl: null, imageFilename: '', tempKey: createUniqueId()};
            const newArray = [...prev.processes.slice(0, i+1), initial, ...prev.processes.slice(i+1)]
            return {...prev, processes: newArray}
        });
    };

    const handleChange = (e, i) => {
        let { name, value, files } = e.target;
        const newProcesses = [...processes];
        if (files && files.length > 0) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            newProcesses[i].file = file;
            newProcesses[i].imageUrl = url;
        } else {
            newProcesses[i][name] = value
        };
        setRecipe(prev => {
            return {...prev, processes: newProcesses};
        })
    };

    const handleDeleteprocess = (e, i) => {
        const newProcesses = [...processes];
        newProcesses.splice(i, 1);
        setRecipe(prev => ({...prev, processes: newProcesses}))
    };

    return (
        <div className="w-70 mx-auto">
            {processes.map((process, i) => (
                <motion.div 
                    key={process.tempKey} 
                    className='w-70 mx-auto my-13 py-5 px-10 shadow-md rounded-xl outline-1 outline-gray-200' 
                    layout initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{duration: .5}}>
                    <IndexNum i={i} mt="-mt-9 relative z-10"/>
                    {process.imageUrl ? 
                    <img
                        src={process.imageUrl}
                        alt={process.description}
                        className='w-50 h-50 -mb-6 object-cover rounded-xl'
                    />
                    :
                    <div className='w-full -mb-6 h-50 bg-gray-200 rounded-xl flex items-center justify-center'>
                        <p>No Image</p>    
                    </div>}
                    <div className='relative mb-2'>
                        <svg className="bg-amber-700 text-white w-12 h-12 p-2 block mx-auto rounded-4xl dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/>
                            <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        </svg>

                        <input type="file" name="image"
                            onChange={(e) => handleChange(e, i)}
                            className='bg-sky-300 w-15 h-15 block mx-auto rounded-4xl absolute top-0 left-0 right-0 opacity-0'
                        />
                    </div>
                    <textarea name="description"
                        placeholder="手順を書き込んでください。"
                        value={process.description}
                        onChange={(e) => handleChange(e, i)}
                        rows={4}
                        className='block mx-auto w-full mb-3 p-2 rounded-xl bg-gray-50 outline-1 outline-amber-300 focus:outline-2 focus:outline-amber-500'
                    ></textarea>

                    <button
                        className='hover:cursor-pointer btn btn-danger block mx-auto '
                        onClick={e => handleDeleteprocess(e, i)}    
                    >この工程を削除</button>
                    <button
                        className='hover:cursor-pointer btn bg-amber-700 text-white font-bold block mx-auto mt-8 -mb-10 relative z-10'
                        onClick={() => handleAddProcess(i)}    
                    >＋工程を追加</button>
                </motion.div>
            ))}

            {validation && 
            <p className="text-red-600 text-center -mt-8 mb-5">画像の有無は任意、手順欄は必須です。</p>
            }
        </div>
    )
}