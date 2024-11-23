import React, {  } from 'react';
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "antd";
import HeaderUserView from 'pages/users/components/vewHeader';
import checkPermission from 'utils/check_permission';
import DeleteData from 'components/deleteData';
import { useNavigate, useParams } from 'react-router-dom';
import useGetOneData from 'hooks/useGetOneData';
import ViewDocument from '../crud/view';
import { IDocument } from 'models/document';
import DocumentExecutions from 'pages/document-executions';

const DocumentInfo: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, refetch } = useGetOneData<IDocument>({
    queryKey: ["documents", id],
    url: `documents/${id}?expand=description,documentType,documentWeight,updatedBy,createdBy`,
    options: {},
  });

  return (
    <div className="">
      <HeaderUserView
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Documents", path: "/documents" },
          { name: data?.data?.title ?? "View document", path: "" },
        ]}
        title={data?.data?.title ?? "View document"}
        isBack={true}
        btn={
          <div>
            {checkPermission("document_delete") ? (
              <Tooltip placement="left" title={t("Delete")}>
                <DeleteData
                  permission={"document_delete"}
                  refetch={refetch}
                  url={"documents"}
                  id={Number(id)}
                  className="mr-4"
                  navigateUrl="/documents"
                >
                  <Button danger>
                    {t("Delete")}
                  </Button>
                </DeleteData>
              </Tooltip>
            ) : null}
            {
              checkPermission("document_update") ?
              <Button
                type="primary"
                htmlType="submit"
                className="px-5 ml-2"
                onClick={() => navigate(`/documents/update/${id}`)}
              >
                {" "}
                {t("Update")}{" "}
              </Button> : ""
            }
          </div>
        }
        tabs={[
          { key: "main-info", label: t("Basic information"), children: <ViewDocument data={data?.data} /> },
          { key: 'document-executions', label: t("Document executions"), children: <DocumentExecutions />},
        ]}
      />
    </div>
  );
};

export default DocumentInfo;


/**
  * _index
  * _delete
  * _update
  * _view
*/