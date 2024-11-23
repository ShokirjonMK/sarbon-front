import { Input } from "antd"
import { RiSearch2Line } from "react-icons/ri"

const SearchComponent = () => {
    return (
        <Input className="bg-[#F4F7F9] w-[238px] active:w-[268px] focus-within:w-[258px] px-3 py-[10px] text-sm rounded-full border-none max-lg:hidden placeholder:text-[#7C7D7D]" placeholder="Qidirish..." prefix={<RiSearch2Line />} />
    )
}

export default SearchComponent;