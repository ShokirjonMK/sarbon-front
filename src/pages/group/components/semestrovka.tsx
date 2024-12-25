import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { renderFullName } from "utils/others_functions";
import { Button, Segmented, Spin } from "antd";
import { PrintRegular } from "@fluentui/react-icons";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import useGetData from "hooks/useGetData";
import { IEduSemestr } from "models/education";
// import ExcelJS from 'exceljs';
import { ExcelBtn } from "components/Buttons";

interface GroupStudentTypeProps {
  data: any,
  isLoading: boolean,
}

const sortStudent = (a: any, b: any) => {
  const nameA = a?.profile?.last_name?.toUpperCase(); // ignore upper and lowercase
  const nameB = b?.profile?.last_name?.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

const SemesrtRegistration = ({data, isLoading}: GroupStudentTypeProps) => {
  
  // const workbook = new ExcelJS.Workbook();
  // const sheet = workbook.addWorksheet("My Sheet");
  // sheet.properties.defaultRowHeight = 80;

  const {t} = useTranslation()
  const iframe_ref = useRef<HTMLIFrameElement | null>(null);
  const print_ref = useRef<any>(null);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 0 });
  const [currentSubjects, setcurrentSubjects] = useState<any>();


  const { data: semestrs, isFetching: semestrsFetching } = useGetData<IEduSemestr>({
    queryKey: ["edu-semestrs", data?.data?.edu_plan_id],
    url: `edu-semestrs?expand=semestr,eduSemestrSubjects.subject,eduSemestrSubjects.categoryAllHour`,
    urlParams: { 
      "per-page": 0,
      filter: JSON.stringify({edu_plan_id: data?.data?.edu_plan_id})
    },
    options: {
        enabled: !!data?.data?.edu_plan_id,
        onSuccess: (res) => {
            writeToUrl({ name: "edu_semestr_id", value: res?.items?.find(e => e?.status)?.id ?? res.items[0]?.id })
        }
    }
  });

  useEffect(() => {
    if(urlValue.filter?.edu_semestr_id && semestrs){
        const curData = semestrs?.items.find((item) => item?.id === urlValue.filter?.edu_semestr_id)?.eduSemestrSubjects;
        setcurrentSubjects(curData)
    }
  }, [urlValue.filter?.edu_semestr_id, semestrs])

  const { data: stdGroups, isFetching: stdGroupFetching } = useGetAllData({
    queryKey: ["student-groups", urlValue?.filter?.edu_semestr_id, data?.data?.id],
    url: `student-groups?sort=-id`,
    urlParams: {
        expand: "profile,studentSemestrSubjects",
      "per-page": urlValue.perPage,
      page: urlValue.currentPage, 
      filter: JSON.stringify({group_id: data?.data?.id, edu_semestr_id: urlValue?.filter?.edu_semestr_id}),
    },
    options: {
        enabled: !!urlValue?.filter?.edu_semestr_id && !!data?.data?.id,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  });

  function printPage() {
    if (iframe_ref?.current) {
        const _iframe = iframe_ref.current;
        _iframe.contentDocument?.open()
        if (print_ref?.current) {
            _iframe.contentDocument?.write(print_ref.current?.innerHTML)
        }
        _iframe.contentDocument?.write(`
          <style>
            @media print { 
              @page { size: landscape; }

              body{
                margin: 0;
                padding: 0;
            
              }
              *{
                font-size: 12px !important;
                padding: 0;
              }
              .semestrovka-table td{
                padding: 0;
                font-size: 8px !important;
                line-height: 0.8 !important;
              }
              .semestrovka-table tr, td{
                padding: 0;
              }
              .semestrovka-table tr, td, tbody{
                border: 0.2px solid #000;
              }
              .semestrovka-table .order-td{
                width: 10px;
              }
              .semestrovka-table .fullname-td{
                width: 220px;
              }
              .semestrovka-table .subject-td{
                width: 250px;
              }
              .semestrovka-table .text-size-10{
                font-size: 11px !important;
                line-height: 1 !important;
              }
              .top-title{
                height: 15px;
                margin: 0px;
                padding: 0px;
              }
            }
          </style>
        `); // Formatni landscape qilib ochish
        _iframe.contentDocument?.close();
        _iframe.focus();
        _iframe.contentWindow?.print()

    }
  }

  return(
    <Spin spinning={stdGroupFetching || isLoading || semestrsFetching}>
        <div className="p-3 pt-0">
            <div className="flex justify-between items-center mb-4">
              <div>
                <Button onClick={printPage} className='d-f' ><PrintRegular fontSize={16} />&nbsp;&nbsp;Chop etish</Button>
                {/* <ExcelBtn onClick={() => {}} loading={false} /> */}
              </div>
                <div className="flex justify-end items-center flex-row">
                    <span className="text-black text-opacity-40 text-sm font-normal leading-snug max-sm:hidden">Semestr:</span>&nbsp;&nbsp;
                    <Segmented
                    value={urlValue.filter?.edu_semestr_id}
                    options={(semestrs?.items ?? [])?.map(e => ({ label: e?.semestr?.id, value: e?.id, disabled: e?.semestr?.id > semestrs?.items?.find((i: any) => i?.status === 1)?.semestr?.id }))}
                    onChange={(e) => { writeToUrl({ name: "edu_semestr_id", value: e }) }}
                    />
                </div>
            </div>
        
            <div ref={print_ref} style={{fontSize: "14px"}}>
                <p className="top-title pb-2" style={{marginBottom: "0px"}}>Universitet: <span style={{display: "inline-block", marginLeft: "10px"}}>Sarbon Universiteti</span></p>
                <p className="top-title pb-2" style={{marginBottom: "0px"}}>{t("Faculty")}: <span style={{display: "inline-block", marginLeft: "10px"}}>{data?.data?.faculty?.name}</span></p>
                <p className="top-title pb-2" style={{marginBottom: "0px"}}>{t("Edu plan")}: <span style={{display: "inline-block", marginLeft: "10px"}}>{data?.data?.eduPlan?.name}</span></p>
                <p className="top-title pb-2" style={{marginBottom: "0px"}}>{t("Semestr")}: <span style={{display: "inline-block", marginLeft: "10px"}}>{semestrs?.items?.find((i: any) => i?.id === urlValue?.filter?.edu_semestr_id)?.semestr?.name}</span></p>
                <p className="top-title pb-2" style={{marginBottom: "0px"}}>{t("Group")}: <span style={{display: "inline-block", marginLeft: "10px"}}>{data?.data?.unical_name} - guruhining fanlar kesimida o'zlashtirish ko'rsatkichlari bo'yicha <strong>SEMESTR QAYDNOMASI</strong></span></p>

                <table style={{width: "100%", borderCollapse: "collapse"}} className="semestrovka-table" >
                    <tbody>
                        <tr >
                            <td className="order-td text-size-10 w-[35px] py-1" rowSpan={3} style={{padding: "3px 8px", border: "0.2px solid #000"}}>№</td>
                            <td className="fullname-td text-size-10 w-[300px] py-1" rowSpan={3} style={{padding: "3px 8px", border: "0.2px solid #000"}}>Talabaning F.I.Sh.</td>
                            {
                                currentSubjects?.map((item: any) => (
                                  <td colSpan={2} key={item?.id} className="subject-td text-size-10 py-1" style={{padding: "3px 8px", border: "0.2px solid #000", textAlign: "center"}}>{item?.subject?.name}</td>
                                ))
                            }
                        </tr>
                        <tr >
                            {
                                currentSubjects?.map((item: any) => (
                                    <td className="text-size-10" colSpan={2} key={item?.id} style={{padding: "3px 8px", border: "0.2px solid #000", textAlign: "center"}}>{item?.categoryAllHour}/{item?.credit}</td>
                                ))
                            }
                        </tr>
                        <tr >
                            {
                                currentSubjects?.map((item: any) => (
                                    <React.Fragment key={item?.id}>
                                        <td className="py-1 text-size-10" key={item?.id + "Ball"} style={{padding: "3px 8px", border: "0.2px solid #000", textAlign: "center"}}>Ball</td>
                                        <td className="py-1 text-size-10" key={item?.id} style={{padding: "3px 8px", border: "0.2px solid #000", textAlign: "center"}}>Baho</td>
                                    </React.Fragment>
                                ))
                            }
                        </tr>
                        {
                            (stdGroups?.items?.sort(sortStudent))?.map((i, index) => (
                                <tr key={index}>
                                    <td className="py-1 text-size-10" style={{padding: "3px 8px", border: "0.2px solid #000"}}>{index + 1}</td>
                                    <td className="py-1" style={{padding: "3px 8px", border: "0.2px solid #000"}}>{renderFullName(i?.profile)}</td>
                                    {
                                        currentSubjects?.map((item: any) => (
                                            <React.Fragment key={item?.id}>
                                                <td key={item?.id + "ddd"} className="text-size-10" style={{padding: "3px 8px", border: "0.2px solid #000", textAlign: "center"}}>
                                                    {i?.studentSemestrSubjects?.find((sub: any) =>sub?.edu_semestr_subject_id === item?.id)?.all_ball}
                                                </td>
                                                <td key={item?.id} className="text-size-10" style={{padding: "3px 8px", border: "0.2px solid #000", textAlign: "center"}}>
                                                    {i?.studentSemestrSubjects?.find((sub: any) =>sub?.edu_semestr_subject_id === item?.id)?.rating}
                                                </td>
                                            </React.Fragment>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <div style={{paddingTop: 20, display: "flex", alignItems: "start"}}>
                    <div style={{display: "flex"}}>
                        <strong>{t("Fakultet dekani")}</strong>
                        <img style={{margin: "0 20px"}} width={80} src={data?.data?.deanQrKod?.qrCode} alt="" />
                        <strong>{renderFullName(data?.data?.deanQrKod?.dean)}</strong>
                    </div>
                    {/* <div style={{display: "flex",  width: '50%', alignItems: "center", fontStyle: "italic"}}>
                        <strong>Izoh:</strong>
                        <div style={{marginLeft: 30}}>
                            <strong style={{display: "block"}}>1. Tuzatishlar dekan imzosi bilan izohlanadi.</strong>
                            <strong style={{display: "block"}}>2. Semestr yakunida dekan tomonidan tasdiqlanib, fakultet bo'yicha tikib muqovalanadi.</strong>
                        </div>
                    </div>  */}
                </div>
            </div>
            <iframe ref={iframe_ref} style={{ height: '0px', width: '0px', position: 'absolute' }}></iframe>
        </div>
    </Spin>
  )
}

export default SemesrtRegistration;