import { CreateBtn } from "components/Buttons";
import TitlePage from "components/Titles";
import { FC, ReactNode } from "react";

const HeaderPage: FC <{title: string, create_permission: string, createOnClick: React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>, buttons?: ReactNode, className?: string, createClassName?: string}> = ({title, create_permission, createOnClick, className, createClassName, buttons}): JSX.Element => {

  return(
    <div className={`flex-between mb-2 ${className}`}>
        <TitlePage>{title}</TitlePage>
        <div className="d-f" >
          {buttons}
          <CreateBtn onClick={createOnClick} permission={create_permission} className={`${createClassName} ms-3 h-[32px]`} />
        </div>
      </div>
  )
}

export default HeaderPage