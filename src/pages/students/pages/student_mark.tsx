import { BookDefaultFilled } from "@fluentui/react-icons";
import useGetAllData from "hooks/useGetAllData";
import { useTranslation } from "react-i18next";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useParams } from "react-router-dom";
import { Divider, Segmented, Spin, Tag } from "antd";
import useGetData from "hooks/useGetData";
import useUrlQueryParams from "hooks/useUrlQueryParams";

const StudentMark = (): JSX.Element => {
  
  const { student_id, edu_plan_id } = useParams();
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  // const { data, isFetching } = useGetAllData({
  //   queryKey: ["student-marks", student_id],
  //   url: `student-marks?expand=examType,subject,student,student.profile`,
  //   urlParams: { "per-page": 0, filter: { student_id } },
  //   options: {
  //     enabled: !!student_id,
  //   },
  // });

  const { data, isFetching } = useGetAllData({
    queryKey: ["student-semestr-subjects",urlValue.perPage,urlValue.currentPage, urlValue.filter?.semestr_id],
    url: `student-semestr-subjects`,
    urlParams: {
      "per-page": urlValue.perPage,
      filter: JSON.stringify({semestr_id: urlValue.filter?.semestr_id, student_id}),
      page: urlValue.currentPage,
      expand: "student.profile,studentVedomst,studentVedomst.studentMark,studentVedomst.studentMark.examType,eduSemestrSubject,eduSemestrSubject.subject,eduSemestrSubject.eduSemestrExamsTypes"
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  });

  const { data: semestrs } = useGetData({
    queryKey: ["edu-semestrs", edu_plan_id],
    url: `edu-semestrs?expand=semestr`,
    urlParams: { 
      "per-page": 0,
      filter: JSON.stringify({edu_plan_id})
    },
    options: {
      onSuccess: (res) => {
        writeToUrl({ name: "semestr_id", value: res?.items?.find(e => e?.status)?.semestr?.id ?? res.items[0]?.semestr?.id })
      }
    }
  });

  const move = (array: any[], from: number, to: number, on = 1) => {
    return array = array.slice(), array.splice(to, 0, ...array.splice(from, on)), array
  }

  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Students", path: '/students' },
          { name: `${data?.items.length ? `${data?.items[0]?.student?.profile?.last_name} ${data?.items[0]?.student?.profile?.first_name} ${data?.items[0]?.student?.profile?.middle_name}` : t("Student view")}`, path: `/students/view/${student_id}` },
          { name: `Student mark`, path: `/students/${student_id}/mark` },
        ]}
        title={t(`Student mark`)}
        isBack={true}
      />
      <Spin spinning={isFetching}>
        <div className="p-3">
        <div className="flex justify-end items-center">
            <span className="text-black text-opacity-40 text-sm font-normal leading-snug max-sm:hidden">Semestr:</span>&nbsp;&nbsp;
            <Segmented
              value={urlValue.filter?.semestr_id}
              options={(semestrs?.items ?? [])?.map(e => ({ label: e?.semestr?.id, value: e?.semestr?.id }))}
              onChange={(e) => { writeToUrl({ name: "semestr_id", value: e }) }}
            />
          </div>

          <ul className="list-none p-0 m-0 flex flex-col lg:mt-[20px] max-lg:mt-[15px] max-md:mt-[10px]">
        {
          data?.items?.map((item:any, i:number) => (
            <li key={i} className="w-full flex lg:p-4 max-lg:p-3 max-md:p-2 rounded-lg border border-solid border-black border-opacity-5 mb-4 bg-[#F5F5F5]">
              <BookDefaultFilled fontSize={24} color="#0a3180"/>
              <div className="ml-3 w-full">
                <h5 className="text-black text-opacity-90 text-base font-medium">{item?.eduSemestrSubject?.subject?.name}</h5>
                
                <hr className="my-2 bg-black opacity-40"/>
                {
                  item?.studentVedomst?.map((vodeomst: any) => (
                    <div key={vodeomst?.id} className="bg-[#fdfdfd] p-2 rounded-md mb-2">
                      <Divider className="my-0" orientation="left">{vodeomst?.vedomst === 1 ? "1 - shakl" : vodeomst?.vedomst === 2 ? "1 - A shakl" : vodeomst?.vedomst === 3 ? "1 - B shakl" : ""}</Divider>
                      <div className="xl:flex items-center justify-between max-sm:flex-col max-sm:items-start">
                        {
                          move(vodeomst?.studentMark.sort((a: any, b: any) => a?.exam_type_id - b?.exam_type_id), 2, item?.eduSemestrSubject?.eduSemestrExamsTypes?.length - 1)
                          ?.map((mark: any) => (
                            <div key={mark?.id} className="flex justify-between w-full max-xl:my-1">
                              <p className="text-[#939393] text-sm">
                                {
                                  mark?.exam_type_id !== 3 ? 
                                    <span>{mark?.examType?.name}: {mark?.ball} ball</span> 
                                    : <Tag color={mark?.passed === 2 ? "red" : vodeomst?.passed === 1 ? "green" : "blue"}>
                                        {mark?.status == 2 ? `${mark?.examType?.name} : ${mark?.ball} ball ${mark?.passed == 2 ? "/o'ta olmadi" : "/o'tdi"}` : `${mark?.examType?.name} : Baholanmagan`}
                                      </Tag>
                                }
                              </p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </li>
          ))
        }
      </ul>
        {/* <Empty /> */}
          {/* <ul className="list-none p-0 m-0 flex flex-col">
            {
              markArray ? Object.values(markArray)?.map((item: any, i: number) => (
                <li key={i} className="w-full flex lg:p-4 max-lg:p-3 max-md:p-2 rounded-lg border border-solid border-black border-opacity-5 mb-4">
                  <BookDefaultFilled fontSize={24} color="#0a3180" />
                  <div className="ml-3 w-full">
                    <h5 className="text-black text-opacity-90 text-base font-medium">{item[0]?.subject?.name}</h5>
                    <Divider className="my-2 mb-3" />
                    <div className="flex items-center justify-between">
                      {
                        item?.map((e: any, i: number) => (
                          <div key={1000 + i}>
                            <p className="text-blue-600 text-sm font-medium">{e?.examType?.name} : {e?.ball} ball</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </li>
              )) : <Empty />
            }
          </ul> */}
        </div>
      </Spin>
    </div>
  )
}

export default StudentMark