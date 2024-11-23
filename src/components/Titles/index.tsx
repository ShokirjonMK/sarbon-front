import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";

const TitlePage: FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
  const {t} = useTranslation();

  return (
    <h5 className="font-medium text-[16px] m-0 capitalize">
      { typeof children === "string" ? t(children) : children }
    </h5>
  )
}

export default TitlePage

export const TitleModal: FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
  const {t} = useTranslation();

  return (
    <h6 className="m-0 capitalize font-bold text-[17px] text-[#000000D9]">
      { typeof children === "string" ? t(children) : children }
    </h6>
  )
}

export const TitleLabel: FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
  const {t} = useTranslation();

  return (
    <>
      { typeof children === "string" ? t(children) : children }
    </>
  )
}

export const TitleHeader: FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
  const {t} = useTranslation();

  return (
    <>
      { typeof children === "string" ? t(children) : children }
    </>
  )
}

