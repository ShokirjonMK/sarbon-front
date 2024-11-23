import React, { ReactNode } from 'react';
import './style.scss';

const Loader: React.FC = (): JSX.Element => {

  return(
    <div className='wrapper' >
      <span className="loader"></span>
    </div>
  )
}
const WrappLoader: React.FC<{loading: boolean, children: ReactNode}> = (props): JSX.Element => {

  return(
    <div className='wrapper' >
      {
       props.loading ? <span className="loader"></span>
       : props.children
      }
    </div>
  )
}

export { WrappLoader }
export default Loader;