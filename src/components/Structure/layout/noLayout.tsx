import React from "react";
import "./style.scss";

const NoLayout: React.FC<{children: React.ReactNode}> = ({ children }): JSX.Element => {

  return(
    <div className="no-layout">
      <div className="content">{children}</div>
    </div>
  )
}

export default NoLayout