import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { SendFilled } from "@fluentui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { requesrData, sendNoticeData } from "./request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import SunEditor from "suneditor-react";
import { editor_buttonList } from "config/constants/suneditor";
import A4FormatModal from "components/A4FormatModal";
import useGetOneData from "hooks/useGetOneData";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import useUrlQueryParams from "hooks/useUrlQueryParams";

const DocDecreeUpdate: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const { data, refetch } = useGetOneData<any>({
    queryKey: ["document-decrees", id],
    url: `/document-decrees/${id}?expand=info.user.profile,user.profile,body`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          description: res?.data?.description,
          body: res?.data?.body?.body,
        })
      },
      enabled: !!id
    },
  });

  useEffect(() => {
    if(urlValue?.filter_like?.is_edit && id) {
      setIsEdit(true)
    }
  }, []);

  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: (data) => requesrData(id, data),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", id ? "update" : "create", res?.message);
        setIsEdit(true);
        navigate(`/doc-decree/update/${res?.data?.id}?is_edit=1`);
      } else {
        Notification("error", id ? "update" : "create", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", id ? "update" : "create", error?.response?.data ? error?.response?.data?.data?.message : "");
    },
    retry: 0,
  });

  const { mutate: sendNotice, isLoading: sendLoading } = useMutation({
    mutationFn: () => sendNoticeData(id),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        navigate(`/doc-decree/view/${res?.data?.id}`);
      } else {
        Notification("error", "update", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.data?.message : "");
    },
    retry: 0,
  });

  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Farmoyishlar", path: '/doc-decree' },
          { name: "Farmoyish " + (id ? "Tahrirlash" : "Qo'shish"), path: '/doc-decree/view/:id' }
        ]}
        title={t("Farmoyish " + (id ? "Tahrirlash" : "Qo'shish"))}
        isBack={true}
      />
      <Form
        form={form}
        layout='vertical'
        // onFinish={mutate}
      >
        <Row gutter={[12, 12]} className="p-4" >
          <Col xs={24} sm={24} md={24} lg={24} xl={16} xxl={16} >
            <div className="suneditor">
            <Form.Item
              name={`body`}
              label={t("Farmoyish hujjati")}
              rules={[{ required: true, message: `Please input document` }]}
            >
              {data?.data?.body?.body ? <SunEditor
                disable={isEdit}
                setContents={data?.data?.body?.body}
                setDefaultStyle='min-height:279mm'
                autoFocus={false}
                placeholder={t("Hujjat kontentini kiriting") ?? ""}
                // onChange={(e) => setdocBody(e)}
                setOptions={{
                  fontSize: [12, 14, 16, 18, 20],
                  fontSizeUnit: "px",
                  buttonList: editor_buttonList,
                }}
              /> :
                <SunEditor
                  disable={isEdit}
                  setContents={
                    // `<div><h1 style="text-align: center; font-size: 36px; mergin-top: 16px; margin-bottom: 8px">Bildirishnoma</h1></div>`
                    `<div><h3 style="text-align: center; mergin-top: 16px; margin-bottom: 8px">Sarbon Universiteti</h3></div>`
                    + `<div><h3 style="text-align: center; mergin-top: 16px; margin-bottom: 8px">______________ (bo'lim, kafedra, fakultet nomi) ______________</h3></div>`
                    + `<div><h3 style="text-align: center; mergin-top: 16px; margin-bottom: 8px">__ -sonli Farmoyish</h3></div>`
                    + `<br/><div style="margin-left: 24px;"><b>_______ (sana) ________</b> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>Toshkent sh.</b></div>`
                  }
                  setDefaultStyle='min-height:279mm'
                  autoFocus={false}
                  width="800px
                  "
                  placeholder={t("Hujjat kontentini kiriting") ?? ""}
                  // onChange={(e) => setdocBody(e)}
                  setOptions={{
                    fontSize: [12, 14, 16, 18, 20],
                    fontSizeUnit: "px",
                    buttonList: editor_buttonList,
                  }}
                />}
                </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8} >
            <Form.Item
              name={`description`}
              label={t("Description")}
              rules={[{ required: true, message: `Please input descrription` }]}
            >
              <Input.TextArea rows={6} className='w-full' disabled={isEdit} />
            </Form.Item>

            <div className="d-f justify-end gap-2">
              {isEdit ? <Button onClick={() => {setIsEdit(false); writeToUrl({name: "is_edit", value: ""})}}>Tahrirlash</Button>
              : <Button type="primary" onClick={() => mutate(form.getFieldsValue())} >Saqlash</Button>}
              <Button type="primary" disabled={!(!!id && !data?.data?.status && isEdit)} onClick={() => sendNotice()}  ><SendFilled fontSize={15} className='-rotate-45 me-2' />Yuborish</Button>
            </div>
          </Col>
          {/* <Col span={24}>
            <Button type="primary" className="text-right">Saqlash</Button>
          </Col> */}
        </Row>
      </Form>
      <A4FormatModal isModalOpen={open} setIsModalOpen={setOpen} data={data?.data?.letterOutgoing} />
    </div>
  )
}

export default DocDecreeUpdate;