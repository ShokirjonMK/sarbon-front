import { Button, Dropdown } from "antd";
import verification from "config/_axios/verification";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "store";

const SelectRole = () => {
  const auth = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const changeRole = (key: string) => {
    localStorage.setItem("active_role", key);
    verification(key);
    navigate("/");
  }

  const items = auth.user?.role?.map(role => {
    return {
      label: <span
        onClick={() => changeRole(role)}
        className="flex items-center"
      >
        {role}
      </span>,
      key: role
    }
  })

  return (
    auth.user?.role?.length && auth.user?.role?.length > 1 ? <Dropdown menu={{ items }} trigger={['click']} >
      <Button type="text" className="mr-[12px] ml-[8px] px-[8px]">
        <div className="cursor-pointer text-[1rem] ">
          <span className="capitalize">{auth.user?.active_role}</span>
        </div>
      </Button>
    </Dropdown> : null
  )
}
export default SelectRole;