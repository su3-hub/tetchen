export default function Confirmation({onClose, action, message}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className='absolute inset-0 bg-black opacity-50' onClick={onClose}></div>
                
            <div className="bg-white p-6 rounded-lg shadow-2xl w-9/10 max-w-lg h-50 relative z-10 ">
                <p>{message}</p>
                <div className="flex justify-around text-white mt-7">
                    <button onClick={action} className="w-25 btn bg-red-600">削除</button>
                    <button onClick={onClose} className="w-25 btn bg-gray-600">キャンセル</button>
                </div>
            </div>

        </div>
    )
}