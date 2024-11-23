import React from "react"
import {WeatherMoon20Filled, WeatherMoon20Regular} from '@fluentui/react-icons'
import { IUi } from "store/ui";

const DarkMode: React.FC<{ ui: IUi, dispatch: any }> = ({ ui, dispatch }): JSX.Element => {


  const selectTheme = React.useMemo(() => {
    if (ui.theme === "light") return "blue";
    if (ui.theme === "blue") return "light";
    return "light"
  }, [ui.theme]);

  return (
    <div className="flex-center bg-element cursor-pointer w-[30px] h-[30px] rounded-[50%] me-[1rem]"
      // onClick={() => dispatch(changeTheme(selectTheme))}
    >
      {
        ui.theme === "blue" ? <WeatherMoon20Regular /> : <WeatherMoon20Filled />
      }
    </div>
  )
}

export default DarkMode;