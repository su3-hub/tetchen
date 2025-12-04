export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className='absolute inset-0 bg-black opacity-50'></div>
                
            <div className="bg-white p-6 rounded-lg shadow-2xl w-9/10 max-w-lg h-50 relative z-10 ">
                <p className="text-center block my-3">登録中...</p>
                <p className="text-center block my-3 spinner"><i className="ri-loader-3-line text-6xl"></i></p>
            </div>

        </div>
    )
}