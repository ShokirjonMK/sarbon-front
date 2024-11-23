import ViewInput from 'components/ViewInput';
import {ReactNode}  from 'react'
import { useTranslation } from 'react-i18next';

interface DataType {
  name: string;
  value: ReactNode;
}

const AddressInfo = ({data}:{data:any}) : JSX.Element => {

  const { t } = useTranslation();

const tableData: DataType[] = [
  {
    name: t("Country"),
    value: data?.country?.name,
  },
  {
    name: t("Region"),
    value: data?.region?.name,
  },
  {
    name: t("Area"),
    value: data?.area?.name,
  },
  {
    name: t("Address"),
    value: data?.profile?.address
  },
  {
    name: t("Additional Information"),
    value: data?.profile?.description
  },
];

  return(
    <div className="px-[24px] pt-[15px] pb-[10px]">
      <p className="font-medium text-[16px] mb-4">{t("Residential address information")}</p>
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

export default AddressInfo