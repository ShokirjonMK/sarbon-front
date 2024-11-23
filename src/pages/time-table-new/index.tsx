import { useTranslation } from "react-i18next";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { Link } from "react-router-dom";
import { ICourse, IEduForm } from 'models/education';
import { Button } from "antd";
import useGetData from "hooks/useGetData";

const TimeTablesNew = () => {

  const { t } = useTranslation();

  const { data: courses } = useGetData<ICourse>({
    queryKey: ["courses"],
    url: "courses",
    options: { refetchOnWindowFocus: false, retry: 0 },
  });

  const { data: eduForms } = useGetData<IEduForm>({
    queryKey: ["edu-forms"],
    url: "edu-forms",
    options: { refetchOnWindowFocus: false, retry: 0 },
  });


  return (
    <div className="">
        <HeaderExtraLayout 
            breadCrumbData={[
              {name: "Home", path: '/'},
              {name: "Time tables", path: '/time-tables'}
            ]}
            title={t("Time tables")}
        />
        <div className="p-3">
          {
            courses?.items?.map(item => (
              <div key={item?.id} className="p-3 bg rounded-md mb-2 no-underline text-black">
                <div className="flex items-center">
                  <span className="mr-5">{item?.name}</span>
                  {
                    eduForms?.items?.map(eduForm => (
                      <Link key={eduForm?.id} className="no-underline" to={`/time-tables-new/${item?.id}/${eduForm?.id}`} >
                        <Button className="mr-3">{eduForm?.name}</Button>
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

export default TimeTablesNew;


