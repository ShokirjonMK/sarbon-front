import { Collapse } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;

const UpdatedBy = ({ data }: { data: any }) => {
  const { t } = useTranslation();

  return (
    <Collapse defaultActiveKey={["1"]} className="mt-6">
      <Panel header={t("Created By")} key="1">
        {data?.createdBy ? (
          <>
            <div className="flex">
              <p className="opacity-60">
                {t("First Name")} / {t("Last Name")} / {t("Role")} :
              </p>
              <p className="ml-1">
                {data?.createdBy?.first_name} {data?.createdBy?.last_name} (
                {data?.createdBy?.role})
              </p>
            </div>
            {/* <div className="flex my-1">
              <p className="opacity-60">{t("Login")}:</p>
              <p className="ml-1">{data?.createdBy?.username}</p>
            </div> */}
            <div className="flex">
              <p className="opacity-60">{t("Created at")}:</p>
              <p className="ml-1">
                {dayjs.unix(data?.created_at).format("MM-DD-YYYY")}
              </p>
            </div>
          </>
        ) : null}
      </Panel>
      {data?.updatedBy ? (
        <Panel header={t("Updated By")} key="2">
          <div className="flex">
            <p className="opacity-60">
              {t("First Name")} / {t("Last Name")} / {t("Role")} :
            </p>
            <p className="ml-1">
              {data?.updatedBy?.first_name} {data?.updatedBy?.last_name} (
              {data?.updatedBy?.role})
            </p>
          </div>
          {/* <div className="flex my-3">
            <p className="opacity-60">{t("Login")}:</p>
            <p className="ml-1">{data?.updatedBy?.username}</p>
          </div> */}
          <div className="flex">
            <p className="opacity-60">{t("Updated at")}:</p>
            <p className="ml-1">
              {dayjs.unix(data?.updated_at).format("MM-DD-YYYY")}
            </p>
          </div>
        </Panel>
      ) : null}
    </Collapse>
  );
};
export default UpdatedBy;
