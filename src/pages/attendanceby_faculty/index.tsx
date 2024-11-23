import React, {useState} from 'react'
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import useGetAllData from 'hooks/useGetAllData';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import { useTranslation } from 'react-i18next';
import { ContactCardGroupFilled } from '@fluentui/react-icons';

const AttendanceByFaculty : React.FC = () : JSX.Element => {
  const {t} = useTranslation()
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [allData, setallData] = useState<any[]>();

  const { data, refetch, isFetching } = useGetAllData({
    queryKey: [ "faculties", urlValue.perPage, urlValue.currentPage,],
    url: `faculties?expand=groups`,
    urlParams: {
      "per-page": urlValue.perPage,
      page: urlValue.currentPage,
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
      },
    },
  });

  return(
    <div className='bg-[#f5f5f5]'>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Attendance", path: "" },
        ]}
        title={t("Attendance")}
        // btn={<Button type="primary">{t("Absence students")}</Button>}
      />
      <div className='p-4'>
        {
          data?.items?.map((item,i) => (
            <div className='p-3 mb-4 rounded-sm'>
              <h3 className='text-base font-medium mb-2 text-[#39393a]'>{item?.name}</h3>
              <div className='flex flex-wrap'>
                {
                  item?.groups?.map((element : any) => (
                    <Link to={`/attendance-faculty/group/${element?.id}`} className='no-underline'> 
                      <Card className='w-[150px] mr-2 mb-4 hover:cursor-pointer hover:shadow-lg rounded-[2px] shadow-xl shadow-black-300 text-center'>
                          <ContactCardGroupFilled fontSize={48} color='#0a3180'/>
                          <span className='text-[#0a3180] block mx-auto'>{element?.unical_name}</span>
                      </Card>
                    </Link>
                  ))
                }
            </div>
          </div>
          ))
        }
      </div>
    </div>
  )
}

export default AttendanceByFaculty