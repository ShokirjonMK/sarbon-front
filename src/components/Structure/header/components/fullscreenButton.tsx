import { Avatar } from "antd";
import { useState } from "react";
import { RiFullscreenExitFill, RiFullscreenLine } from "react-icons/ri";

const AllowFullScreenButton = () => {

    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);


    const toggleFullscreen = () => {
        if (!isFullscreen) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } 
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } 
        }
        setIsFullscreen(!isFullscreen);
      };

    
  return (
    <Avatar
      className="cursor-pointer max-md:hidden"
      size={44}
      style={{ background: "#F4F7F9" }}
      onClick={toggleFullscreen}
      icon={
        isFullscreen ? 
          <RiFullscreenExitFill className="text-[18px] text-[rgba(61,67,74,0.9)]" />
            : <RiFullscreenLine className="text-[18px] text-[rgba(61,67,74,0.9)]" />
      }
    />
  );
};
export default AllowFullScreenButton;
