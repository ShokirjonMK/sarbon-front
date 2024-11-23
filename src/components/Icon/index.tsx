import { IconType } from "react-icons/lib";

const IconComponent = (name: string | IconType | undefined):JSX.Element => {
  if(name) { 
    const NewIconComponent = name;
    return <NewIconComponent/>
  }else{
    return <span></span>
  }
}

export default IconComponent;
