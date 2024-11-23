import React from 'react';
import { Button, Dropdown } from 'antd';
import verification from 'config/_axios/verification';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import userIcon from 'assets/images/user.svg'
import { ArrowExit20Filled, PersonSettings20Regular } from '@fluentui/react-icons';
import _logout from 'config/_axios/logout';
import { FILE_URL } from 'config/utils';
import { useQueryClient } from '@tanstack/react-query';

const UserDropdown: React.FC = (): JSX.Element => {
  
  const auth = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const changeRole = (key: string) => {
    localStorage.setItem("active_role", key);
    verification(key);
    navigate("/");
  }

  const items: any = [
    {
      key: '4',
      type: 'group',
      label: "Roles",

      children: auth.user?.role?.map(role => {
              return {
                label: <span
                  onClick={() => auth.user?.role?.length && auth.user?.role?.length > 1 && changeRole(role)}
                  className="flex items-center"
                >
                  {role}
                </span>,
                key: role
              }
            }),
    },
    { type: "divider" },
    { label: <span>Profile</span>, key: 1, icon: <PersonSettings20Regular />, onClick: () => { navigate("/profile") } },
    { label: "Logout", key: 2, icon: <ArrowExit20Filled />, onClick: () => { _logout().then(() => { navigate("/") }).then(() => queryClient.clear()) } },
  ]

  return (
    <div className="profile flex-between">
      <Dropdown menu={{ items, selectable: !!auth.user?.role?.length && auth.user?.role?.length > 1, defaultSelectedKeys: [auth.user?.active_role ?? ""] }} trigger={['click']} >
        <Button type="text" className="flex rounded-full items-center px-[2px] pl-[2px] pr-[12px]" style={{ height: "min-content" }}>
          {
            auth?.user?.avatar?.length ? <img src={`${FILE_URL}${auth.user?.avatar}`} alt="admin image"  className="w-[32px] h-[32px] mr-[6px] rounded-full"/> : (auth?.user?.profile?.image?.length) ? <img src={`${FILE_URL}${auth.user?.profile?.image}`} className="w-[32px] h-[32px] mr-[6px]" alt="" /> : <img src={userIcon} className="inline-block mr-[6px] cursor-pointer" alt="" />
          }
          
          <div className="text-left flex flex-col gap-1">
            <p className="font-medium text-[14px] mb-0 leading-[15px]">{auth.user?.first_name} {auth.user?.last_name}</p>
            <div className="opacity-50 text-[12px] leading-[12px] d-f flex-wrap gap-1">{auth.user?.active_role}</div>
          </div>
        </Button>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;