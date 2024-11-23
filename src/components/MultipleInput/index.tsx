import { useState } from "react";
import { Button, Col, Drawer, Form, Input, Space } from "antd";
import { useTranslation } from "react-i18next";
import { LocalLanguage16Filled } from "@fluentui/react-icons";
import useGetData from "hooks/useGetData";
import { ILanguage } from "components/Structure/header/components/types";
import { globalConstants } from "config/constants";
import { IoClose } from "react-icons/io5";
import { generateAntdColSpan } from "utils/others_functions";

type PropsMultipleInput = {
  layout?: "vertical" | "horizontal";
  textAreaRows?: number;
  isDescription?: boolean;
  isName?: boolean;
  inputSpan?:
  | number
  | {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  }
  | undefined;
  textAreaSpan?:
  | number
  | {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  }
  | undefined;
};

function MultipleInput({
  textAreaRows = 3,
  inputSpan,
  textAreaSpan,
  isName,
  isDescription = true,
}: PropsMultipleInput): JSX.Element {
  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [inputName, setinputName] = useState<string>();

  const { data: languages } = useGetData<ILanguage>({
    queryKey: ["languages"],
    url: "languages",
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = (val: boolean, type: string) => {
    setOpen(val);
    setinputName(type);
  };

  return (
    <>
      {
        isName === false ? (null) :

          <Col {...generateAntdColSpan(inputSpan ?? 24)}>
            <label htmlFor={`name[${i18n.language}]`} className="mb-2 block">
              <span className=" text-red-400">*</span> {t("Name")} ({i18n.language})
            </label>
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item
                name={`name[${i18n.language}]`}
                shouldUpdate
                rules={[
                  {
                    required: true,
                    message: `Please input name(${i18n.language})`,
                  },
                ]}
                className="mb-4 w-[100%]"
              >
                <Input
                  placeholder={`${t("Enter the name")} (${i18n.language}) ...`}
                />
              </Form.Item>
              <Button onClick={() => onOpen(true, "name")} className="bg-[#FAFAFA]">
                <LocalLanguage16Filled />
              </Button>
            </Space.Compact>
          </Col>
      }

      {isDescription ? <Col {...generateAntdColSpan(textAreaSpan ?? 24)}>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor={`description[${i18n.language}]`}>
            <span className=" text-red-400">*</span> {t("Description")} (
            {i18n.language})
          </label>
          <Button type="text" onClick={() => onOpen(true, "description")}>
            <LocalLanguage16Filled />
          </Button>
        </div>
        <Form.Item
          name={`description[${i18n.language}]`}
          shouldUpdate
          className="mb-5"
        >
          <Input.TextArea
            rows={textAreaRows}
            showCount
            maxLength={globalConstants.textAreaLength}
            placeholder={`${t("Enter the description")} (${i18n.language})`}
          />
        </Form.Item>
      </Col> : null}

      {/* <Col {...generateAntdColSpan(textAreaSpan ?? 24)}>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor={`description[${i18n.language}]`}>
            <span className=" text-red-400">*</span> {t("Description")} (
            {i18n.language})
          </label>
          <Button type="text" onClick={() => onOpen(true, "description")}>
            <LocalLanguage16Filled />
          </Button>
        </div>
        <Form.Item
          name={`description[${i18n.language}]`}
          shouldUpdate
          rules={[
            {
              required: true,
              message: `Please input description(${i18n.language}) ...`,
            },
          ]}
          className="mb-5"
        >
          <Input.TextArea
            rows={textAreaRows}
            showCount
            maxLength={globalConstants.textAreaLength}
            placeholder={`${t("Enter the description")} (${i18n.language})`}
          />
        </Form.Item>
      </Col> */}

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-[16px] m-0 capitalize">
              Name translations
            </h5>
            <IoClose
              onClick={() => setOpen(false)}
              className="text-[24px] cursor-pointer text-[#00000073]"
            />
          </div>
        }
        placement={"right"}
        width={globalConstants.antdDrawerWidth}
        onClose={onClose}
        closable={false}
        open={open && inputName === "name"}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
      >
        {languages?.items?.map((item, index) => (
          <div key={index}>
            <label htmlFor={`name[${item?.lang_code}]`} className="capitalize">
              <span className=" text-red-400">*</span> {t(`Name`)} (
              {item?.lang_code})
            </label>
            <Form.Item
              name={`name[${item?.lang_code}]`}
              shouldUpdate
              rules={[
                {
                  required: open,
                  message: `Please input name(${item?.lang_code})`,
                },
              ]}
              className="mt-2 mb-5"
            >
              <Input
                placeholder={`${t("Enter the name")} (${item?.lang_code})`}
              />
            </Form.Item>
          </div>
        ))}
        <Button className="mr-4" onClick={() => setOpen(false)}>
          {t("Cancel")}
        </Button>
        <Button type="primary" onClick={() => setOpen(false)}>
          {t("Submit")}
        </Button>
      </Drawer>

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-[16px] m-0 capitalize">
              Description translations
            </h5>
            <IoClose
              onClick={() => setOpen(false)}
              className="text-[24px] cursor-pointer text-[#00000073]"
            />
          </div>
        }
        placement={"right"}
        width={globalConstants.antdDrawerWidth}
        onClose={onClose}
        closable={false}
        open={open && inputName === "description"}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
      >
        {languages?.items?.map((item, index) => (
          <div key={index}>
            <label htmlFor={`description[${item?.lang_code}]`}>
              <span className=" text-red-400">*</span> {t(`Description`)} (
              {item?.lang_code})
            </label>
            <Form.Item
              name={`description[${item?.lang_code}]`}
              shouldUpdate
              rules={[
                {
                  required: open,
                  message: `Please input description(${item?.lang_code})`,
                },
              ]}
              className="mt-2 mb-5"
            >
              <Input.TextArea
                rows={3}
                showCount
                maxLength={globalConstants.textAreaLength}
                placeholder={`${t("Enter the description")} (${item?.lang_code
                  })`}
              />
            </Form.Item>
          </div>
        ))}
        <Button className="mr-4" onClick={() => setOpen(false)}>
          {t("Cancel")}
        </Button>
        <Button type="primary" onClick={() => setOpen(false)}>
          {t("Submit")}
        </Button>
      </Drawer>
    </>
  );
}

export default MultipleInput;
