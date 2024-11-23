import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "antd";
import { getLanguages } from "services/language";
import { ILanguage } from "./types";
import i18next from 'i18next';
import { useAppDispatch } from "store";
import { changeLocaleLanguage } from "store/ui";
import uzImg from 'assets/images/flags/uz.png'
import ruImg from 'assets/images/flags/ru.png'
import enImg from 'assets/images/flags/en.png'

const LanguageDropdown = () => {

  const [languages, setLanguages] = useState<ILanguage[]>();
  const [selectedLanguage, setselectedLanguage] = React.useState<string>(localStorage.getItem('i18lang') ?? 'uz');

  const dispatch = useAppDispatch();

  useEffect(() => {
    (
      async () => {
        const response = await getLanguages();
        setLanguages(response?.items)
      }
    )()
  }, [])

  const changeLang = (key: string) => {
    localStorage.setItem("i18lang", key);
    setselectedLanguage(key);
    i18next.changeLanguage(key);
    dispatch(changeLocaleLanguage(key))
  }
  
  const renderFrag = (lang_code: string) => {
    if (lang_code == "uz") {
      return uzImg
    } else if (lang_code == "ru") {
      return ruImg
    } else if (lang_code == "en") {
      return enImg
    }
  }

  const items = languages?.map(lang => {
    return {
      label: <span
        key={lang?.id}
        onClick={() => changeLang(lang?.lang_code)}
        className="flex items-center"
      >
        <img className="w-[20px] h-auto inline-block mr-[8px]" src={renderFrag(lang?.lang_code)} alt="" />{lang?.name.slice(0, 3)}
      </span>,
      key: lang?.lang_code
    }
  })

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button type="text" className="mr-[12px] ml-[8px] px-[8px]">
        <div className="cursor-pointer text-[1rem] ">
          <span className="capitalize">{items?.find(e => e?.key === selectedLanguage)?.label}</span>
        </div>
      </Button>
    </Dropdown>
  )
}
export default LanguageDropdown;