import React from 'react';
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "antd";
import HeaderUserView from 'pages/users/components/vewHeader';
import checkPermission from 'utils/check_permission';
import DeleteData from 'components/deleteData';
import { useNavigate, useParams } from 'react-router-dom';
import useGetOneData from 'hooks/useGetOneData';
import { IDocument } from 'models/document';
import ViewLetter from '../crud/view';
import LetterForwards from 'pages/letter-forwards';
import LetterForwardToRector from 'pages/letter-forward-to-rector';

const LetterInfo: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, refetch } = useGetOneData<IDocument>({
    queryKey: ["letters", id],
    url: `letters/${id}?expand=description,importantLevel,documentWeight,importantLevel,updatedBy,createdBy,files,letterOutgoing,letterOutgoing.body,letterOutgoing.qrCode,letterOutgoing.qrCode.createdBy`,
    options: {},
  });

  return (
    <div className="">
      <HeaderUserView
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Letters", path: "/letters" },
          { name: data?.data?.title ?? "Xatni ko'rish", path: "" },
        ]}
        title={data?.data?.title ?? "Xatni ko'rish"}
        isBack={true}
        btn={
          data?.data?.status === 0 ? <div>
            {checkPermission("letter_delete") ? (
              <Tooltip placement="left" title={t("Delete")}>
                <DeleteData
                  permission={"letter_delete"}
                  refetch={refetch}
                  url={"letters"}
                  id={Number(id)}
                  className="mr-4"
                  navigateUrl="/letters"
                >
                  <Button danger>
                    {t("Delete")}
                  </Button>
                </DeleteData>
              </Tooltip>
            ) : null}
            {
              checkPermission("letter_update") ?
              <Button
                type="primary"
                htmlType="submit"
                className="px-5 ml-2"
                onClick={() => navigate(`/letters/update/${id}`)}
              >
                {" "}
                {t("Update")}{" "}
              </Button> : ""
            }
          </div> : ""
        }
        tabs={[
          { key: "main-info", label: t("Basic information"), children: <ViewLetter data={data?.data} refetch={refetch} /> },
          { key: 'checked-letters', label: t("Xatga fishka tushirish"), children: <LetterForwards />, disabled: (data?.data?.is_ok !== 1 && checkPermission("letter-outgoing_index"))},
          { key: 'forward-letters', label: t("Rektorga xat chiqarish"), children: <LetterForwardToRector data={data?.data} refetch={refetch} />, disabled: (data?.data?.is_ok !== 1 && checkPermission("letter-outgoing_index"))},

        ]}
      />
    </div>
  );
};

export default LetterInfo;


/**
  * _index
  * _delete
  * _update
  * _view
*/