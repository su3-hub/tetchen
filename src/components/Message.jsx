import { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function Message ({message, setMessage}) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
            // if (message) setIsVisible(true);
            const timer = setTimeout(()=> {
                setIsVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        }, [isVisible]);    
    
    const removeMessage = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        if (!isVisible) {
            setTimeout(onClose, 200);
        }
    }, [isVisible]);

    const onClose = () => {
        setMessage(null);
    }

    return (
    <>
        <motion.div
            className="w-9/10 mx-auto my-5 outline-3 outline-red-200 bg-red-100 rounded-xl p-2  flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }} animate={{opacity: .8, y: 0}} exit={{opacity: 0}} transition={{ duration: .2}}
            onClick={removeMessage}
        >

            <p>{message}</p>
            <i className="ri-close-line mr-2 text-xl"></i>
        </motion.div>
        
    </>
    )
}