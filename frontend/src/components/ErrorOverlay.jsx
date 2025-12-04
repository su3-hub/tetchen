export default function ErrorOverlay ({errors, action, buttonMsg}) {
    console.log(errors);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className='absolute inset-0 bg-black opacity-50'></div>
                
            <div className="bg-white p-6 rounded-lg shadow-2xl w-7/10 max-w-md h-50 relative z-10 flex flex-col overflow-scroll">
                {/* <h2 className="">問題が発生しました。お手数ですがやり直しをお願いします。</h2> */}
                <p className="my-3">{errors}</p>
                <button
                    className="btn bg-red-600 text-white block mx-auto my-3 hover:cursor-pointer hover:opacity-70 gradual"
                    onClick={action}
                >{buttonMsg}</button>
            </div>

        </div>
    )
}