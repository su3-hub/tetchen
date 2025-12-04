import { useState } from 'react';

export default function OverlayForm({index, handleSaveProcess, initialData, onClose}) {
    const [process, setProcess] = useState(initialData || {image: '', description: ''});

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.target.files) {
            const value = URL.createObjectUrl(value);
        }
        setProcess(prev => ({...prev, [name]: value}))
    };

    const handleSubmit = () => {
        handleSaveProcess(process, index);
        setProcess({image: '', description: ''})
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className='absolute inset-0 bg-black opacity-50' onClick={onClose}></div>
            
            <div className="bg-white p-6 rounded-lg shadow-2xl w-9/10 max-w-lg h-150 relative z-10">
                <h2 className='text-center font-bold text-xl mb-4 pb-3 border-b border-gray-300'>手順 {index+1} を編集</h2>
                <div className='flex flex-col w-3/4 mx-auto mb-6'>
                    <label htmlFor="image">写真を添付する</label>
                    <input
                    onChange={e => handleChange(e)}
                    type="file"name='image'
                    defaultValue={initialData ? initialData.image: ''}
                    className='p-3 outline rounded-xl outline-sky-300 bg-sky-200'
                    />
                </div>
                <div className='flex flex-col w-3/4 mx-auto mb-8'>
                    <label htmlFor="desc">手順</label>
                    <textarea
                    rows='8'
                    onChange={handleChange} 
                    name="description" 
                    id="desc" 
                    placeholder='手順を入力してください'
                    defaultValue={initialData ? initialData.description: ''}
                    className='outline outline-gray-300 rounded-xl bg-gray-50 p-2'
                    ></textarea>
                </div>
                <div className='w-2/5 mx-auto flex flex-col justify-around gap-5'>
                    <button
                        onClick={handleSubmit}
                        type='button'
                        className='btn btn-natural w-30'
                    >OK</button>
                    <button
                        onClick={onClose}
                        type='button'
                        className='btn btn-gray w-30'
                    >キャンセル</button>
                </div>
            </div>
        </div>
    )
}