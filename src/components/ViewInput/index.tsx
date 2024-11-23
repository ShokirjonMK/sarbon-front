import { ReactNode } from "react";

const ViewInput = ({ label, value, placeholder, className }: { label: string, value: string | ReactNode, placeholder?: string | null, className?: string }) => {

    return (
        <div>
            <label className="text-[14px] mb-1 block" htmlFor="">{label}</label>
            <div className={`px-[12px] py-[8px] rounded-md mb-5 ${className}`} style={{border: "1px dashed rgba(106, 113, 133, 0.3)"}}>
                {value}
                {(!value && placeholder) && <span className="opacity-40">{placeholder}</span>}
            </div>
        </div>
    )

}

export default ViewInput;