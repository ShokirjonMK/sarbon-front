import { FC } from "react";
import { useNavigate } from "react-router-dom";
import no_data from 'assets/images/no_data.svg'
import "./style.scss"

const NotFound: FC = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <>
      <div className="not-data" >
        <img src={no_data} alt="No data" />
        <h1>Not found page</h1>
        <div className="flex-center" >
          <button onClick={() => navigate(-1)} className="e-btn e-border block px-4 py-2">Go back</button>
          <button onClick={() => navigate("/")} className="e-btn e-border block ml-3 px-4 py-2">Go home</button>
        </div>
      </div>
    </>
  )
}

export default NotFound;