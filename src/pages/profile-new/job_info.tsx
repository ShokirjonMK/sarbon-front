import { ReactNode} from "react";
import { useTranslation } from "react-i18next";
import ViewInput from "components/ViewInput";

interface DataType {
    name: string;
    value: ReactNode;
    value2?: ReactNode;
    value3?: ReactNode;
}

const JobInfo = ({data} : {data: any}) => {

    const { t } = useTranslation();

    const tableData: DataType[] = [
      {
        name: t("Diplom type"),
        value: data?.diplomaType?.name,
      },
      {
        name: t("Degree"),
        value: data?.degree?.name,
      },
      {
        name: t("Academic degree"),
        value: data?.academikDegree?.name,
        value2: t("Degree information"),
        value3: data?.degreeInfo?.name
      },
      {
        name: t("Degree information"),
        value: data?.degreeInfo?.name,
      },
      {
        name: t("Membership party"),
        value: data?.partiya?.name
      }
    ];

    return (
        <div className="px-[24px] pt-[15px] pb-[10px]">
            <div className="flex justify-between items-center mb-4">
                <p className="font-medium text-[16px]">{t("Professional information")}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {
                tableData?.map((item, index) => (
                  <ViewInput
                    key={index}
                    label={item?.name} 
                    value={item?.value} 
                    placeholder={item?.name}
                  />
                ))
              }
            </div>
        </div>
    )
}
export default JobInfo;