import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import { Button, Divider, Input, Select, Tag, message } from "antd";
import { useParams } from "react-router-dom";
import doc from 'assets/images/word.png'
import { Eye20Filled } from "@fluentui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { changeLetterForwardToRectorStatus, changedocNumber, requesrData } from "./crud/request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { renderFullName } from "utils/others_functions";
import { IDocument, ILetterOutgoing } from "models/document";
import SunEditor from "suneditor-react";
import { ILOVAFAYLIMG } from "config/constants/staticDatas";
import { editor_buttonList } from "config/constants/suneditor";
import A4FormatModal from "components/A4FormatModal";
import checkPermission from "utils/check_permission";

const LetterForwardToRector: React.FC<{ data: IDocument | undefined, refetch: any }> = ({ data, refetch }): JSX.Element => {

  const { t } = useTranslation();
  const { id: letter_id } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const [desc, setdesc] = useState<string>();
  const [user_id, setuser_id] = useState<number>();
  const [docBody, setdocBody] = useState<string>();
  const [docNumber, setdocNumber] = useState<string>();
  const [replyMessage, setreplyMessage] = useState<string>();
  const [currentOutGoing, setcurrentOutGoing] = useState<ILetterOutgoing>();

  const { data: usersData, isLoading: useLoading } = useGetAllData({
    queryKey: ["users"],
    url: `users?sort=-id&expand=profile`,
    urlParams: { "per-page": "0", filter: { role_name: ["rector", "prorector"] } },
  });

  const writeDocNumber = (e: string) => {
    const docNumberElement = document.getElementsByTagName("code")
     if(docNumberElement?.length) {
      docNumberElement[0].innerHTML = e
     }

  }

  useEffect(() => {
    if (data?.letterOutgoing) {
      setcurrentOutGoing(data?.letterOutgoing)
      setuser_id(data?.letterOutgoing?.user_id)
      setdesc(data?.letterOutgoing?.description)
      setreplyMessage(data?.letterOutgoing?.message)
      setdocNumber(data?.letterOutgoing?.access_number)
      // writeDocNumber(data?.letterOutgoing?.access_number)
    }
  }, [data?.letterOutgoing, data])

  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: () => requesrData( letter_id, desc, user_id, docBody, docNumber),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", "create", res?.message);
        setOpen(false)
        refetch()
      } else {
        Notification("error", "create", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "create", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const { mutate: docNumberMutate, isLoading: docNumLoading } = useMutation({
    mutationFn: () => changedocNumber( data?.letterOutgoing?.id, docNumber, docBody),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        setOpen(false)
        refetch()
      } else {
        Notification("error", "update", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const saveData = () => {
    if(!desc){
      message.warning("Tavsif kiriting!")
    } else if(!user_id) {
      message.warning("Tasdiqlovchi foydalanuvchini tanlang!")
    } else if(!docBody) {
      message.warning("Hujjat tananini kiriting!")
    } else {
      mutate()
    }
  }

  const { mutate: statusMutate } = useMutation({
    mutationFn: (vals: { id: number | undefined, isTrue: any }) => changeLetterForwardToRectorStatus({ id: vals?.id, isTrue: vals?.isTrue }),
    onSuccess: async (res) => {
      Notification("success", "update", res?.message)
      refetch()
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data?.message);
    },
    retry: 0,
  });

  const changeInput = (e: string) => {

    setdocNumber(e)
    writeDocNumber(e)

    if(docBody){
      let newBody = docBody?.replace(`<code>${docNumber}</code>`, `<code>${e}</code>`)
      setdocBody(p => newBody)
    }
  }

  useEffect(() => {
    if(docNumber) {
      changeInput(docNumber)
    }
  }, [])

  return (
    <div className="">
      <div className="px-[24px] pb-[20px]">
        <div className="grid grid-cols-12 gap-4">
          <div className="lg:col-span-8 col-span-12">
            <div className="bg-[#F7F7F7] p-3 rounded-md se-a4-sized overflow-x-auto">
                <div className="flex justify-between items-center">
                  <h3>Chiquvchi xat</h3>
                  {currentOutGoing?.status === 1 ? <Tag color="success" className="text-[16px] ml-2">Yuborilgan!</Tag> : ""}
                </div>
                <Divider className="my-2" />
                <label htmlFor="text-area">{t("Imzolovchi")}</label>
                <Select
                  loading={useLoading}
                  placeholder="Imzolovchini tanlang"
                  optionFilterProp="children"
                  value={user_id}
                  disabled={currentOutGoing?.status === 1 && currentOutGoing?.is_ok !== 2}
                  className="lg:w-[50%] w-[100%] block mb-4"
                  onChange={(e) => setuser_id(e)}
                  options={usersData?.items?.map((item: any) => ({label: renderFullName(item?.profile), value: item?.id}))}
                />
                <label className="block" htmlFor="text-area">{t("Description")}</label>
                <Input.TextArea className="lg:w-[50%] w-[100%]" disabled={currentOutGoing?.status === 1 && currentOutGoing?.is_ok !== 2} onChange={(e) => setdesc(e.target.value)} value={desc} rows={3} id="text-area" placeholder={`${t("Description")}`} />

                <div className="w-min mx-auto my-4">
                  {data?.letterOutgoing?.body?.body ? <SunEditor
                    disable={currentOutGoing?.status === 1 && currentOutGoing?.is_ok !== 2}
                    setContents={data?.letterOutgoing?.body?.body}
                    setDefaultStyle='min-height:279mm'
                    autoFocus={false}
                    placeholder={t("Hujjat kontentini kiriting") ?? ""}
                    onChange={(e) => setdocBody(e)}
                    setOptions={{
                      fontSize: [12, 14, 16, 18, 20],
                      fontSizeUnit: "px",
                      buttonList: editor_buttonList,
                    }}
                  /> :
                  <SunEditor
                    disable={currentOutGoing?.status === 1 && currentOutGoing?.is_ok !== 2}
                    setContents={ILOVAFAYLIMG + `<p style="text-align: justify"><strong><br></strong></p><p style="text-align: justify"><strong>2023 yil&nbsp; &lt;&lt; ___ &gt;&gt;&nbsp; &nbsp;________________&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;No &nbsp; <code>{document_number}</code></strong><br></p><br />`}
                    setDefaultStyle='min-height:279mm'
                    autoFocus={false}
                    placeholder={t("Hujjat kontentini kiriting") ?? ""}
                    onChange={(e) => setdocBody(e)}
                    setOptions={{
                      fontSize: [12, 14, 16, 18, 20],
                      fontSizeUnit: "px",
                      buttonList: editor_buttonList,
                    }}
                  />}
                </div>
                <Divider />
                {currentOutGoing && currentOutGoing?.is_ok === 2 ? <Button onClick={() => saveData()} loading={clicked} className="float-right" type="primary">{t("Save")}</Button> : "" }
                {
                  currentOutGoing ? currentOutGoing?.status === 0 ?
                    <Button onClick={() => statusMutate({id: currentOutGoing ? currentOutGoing?.id : undefined, isTrue: true})} loading={clicked} className="float-right" type="primary">{t("Yuborish")}</Button>
                    : currentOutGoing?.status === 1 ? "" : "" : <Button onClick={() => saveData()} loading={clicked} className="float-right" type="primary">{t("Save")}</Button>
                }
            </div>
          </div>
          <div className="lg:col-span-4 col-span-12">
            <div className="bg-[#F7F7F7] p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <h3>Javob xati</h3>
                  {currentOutGoing?.is_ok === 1 ?
                    <Tag color="success" className="text-[16px] ml-2">Tasdiqlangan!</Tag>
                      : currentOutGoing?.is_ok === 2 ? <Tag color="error" className="text-[16px] ml-2">Bekor qilingan!</Tag>
                        : <Tag color="blue" className="text-[16px] ml-2">Kutilmoqda!</Tag>
                    }
                </div>
                <Divider className="my-2" />
                {replyMessage ? <p><strong>Tavsif: </strong>{currentOutGoing?.message}</p> : ""}
                {
                  currentOutGoing ?
                  <div className="rounded-lg p-3 flex justify-between items-center mt-4" style={{border: "1px solid #999"}}>
                      <img className="w-[50px]" src={doc} alt="doc" />
                      <Eye20Filled className="cursor-pointer" onClick={() => setOpen(true)}  />
                  </div> : <h4>Javob xati kutilmoqda!</h4>
                }
                {(currentOutGoing?.is_ok === 1 && checkPermission("letter-outgoing_update")) ? <div>
                  <label htmlFor="" className="mt-3 block">Hujjat raqami</label>
                  <div className="flex">
                    <Input placeholder="Hujjat raqami" value={docNumber} onChange={(e) => changeInput(e.target.value)}  />
                    <Button onClick={() => {docNumber ? docNumberMutate() : message.warning("Hujjat raqamini kiriting!")}} loading={docNumLoading} className="ml-2" type="primary">{t("Save")}</Button>
                  </div>
                </div> : ""}
            </div>
          </div>
        </div>
      </div>
      <A4FormatModal isModalOpen={open} setIsModalOpen={setOpen} data={data?.letterOutgoing} />
    </div>
  )
}

export default LetterForwardToRector;

// letter-outgoing_create
// letter-outgoing_delete
// letter-outgoing_view
// letter-outgoing_update
// letter-outgoing_index