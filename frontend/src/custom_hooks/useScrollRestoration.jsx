import { useEffect } from "react";

export default function useScrollRestoration () {
    const SCROLL_KEY = "recipe-list-scroll";

    const restoreScroll = () => {
        const savedScrollY = parseInt(sessionStorage.getItem(SCROLL_KEY));
        if (savedScrollY) {
            const y = parseInt(savedScrollY, 10);
            window.scrollTo(0, y);
            sessionStorage.removeItem(SCROLL_KEY);
        }
    };

    // useEffect(() => {
    //     console.log('UseEFFECT')
    //     return () => {
    //         sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
    //         console.log(window.scrollY, '==========')
    //         console.log(sessionStorage.getItem(SCROLL_KEY), 'sjflkdf')
    //     };
    // }, [])

    const saveScroll = ()=> {
        sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
    }
    return {restoreScroll, saveScroll};
};