import { useEffect, useState } from "react";

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<{ width: number, height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    useEffect(() => {
        function handleSize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        window.addEventListener("resize", handleSize);
        handleSize();
        return () => window.removeEventListener("resize", handleSize);
    }, [])

    return windowSize
}

export default useWindowSize;