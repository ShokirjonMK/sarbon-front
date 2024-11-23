import React, { useRef, useState } from 'react';
import { Button, Spin, Tag } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useParams } from 'react-router-dom';
import { PrintRegular } from '@fluentui/react-icons';
import useGetOneData from 'hooks/useGetOneData';
import { IFinalExam } from 'models/exam';
import { IGroup } from 'models/education';
import useGetAllData from 'hooks/useGetAllData';
import dayjs from 'dayjs';
import { checkRole } from 'utils/others_functions';

const sortStudent = (a: any, b: any) => {
  const nameA = a?.studentUser?.profile?.last_name?.toUpperCase(); // ignore upper and lowercase
  const nameB = b?.studentUser?.profile?.last_name?.toUpperCase(); // ignore upper and lowercase
  const groupA = a?.group_id;
  const groupB = b?.group_id;

  if (groupA < groupB) {
    return -1;
  }
  else if (groupA > groupB) {
    return 1;
  }
  else {
    if (nameA < nameB) {
      return -1;
    }
    else if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
};

const ExamSheet: React.FC = (): JSX.Element => {
  const { exam_id } = useParams();
  const iframe_ref = useRef<HTMLIFrameElement | null>(null);
  const print_ref = useRef<any>(null);
  const [group, setGroup] = useState<IGroup>();
  const [ball_count, setBall_count] = useState<{_2: number, _3: number, _4: number, _5: number, attend: number}>()

  const { data, isFetching } = useGetOneData<IFinalExam>({
    queryKey: ["final-exams", exam_id],
    url: `final-exams/${exam_id}?sort=-id&expand=finalExamConfirm.user,eduPlan,eduPlan.faculty,eduSemestr.semestr,eduSemestrSubject.subject,eduYear,user,groups.group.student.profile,groups.group.student.user`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!exam_id,
      onSuccess: (res) => {
        if (res?.data?.groups?.length) setGroup(res?.data?.groups[0]?.group)
      }
    }
  })

  const { data: students, isFetching: studentIsFetching } = useGetAllData({
    queryKey: ["student-vedomsts", { subject_id: data?.data?.subject_id, group_id: group?.id, vedomst: data?.data?.vedomst }],
    url: `student-vedomsts?expand=sheet,studentUser.profile`,
    urlParams: {
      "per-page": 0,
      filter: { subject_id: data?.data?.subject_id, group_id: group?.id, vedomst: data?.data?.vedomst }
    },
    options: {
      onSuccess: (res ) => {
        let _count: {_2: number, _3: number, _4: number, _5: number, attend: number} = {_2: 0, _3: 0, _4: 0, _5: 0, attend: 0};
        res.items?.forEach(e => {
          if(e?.sheet?.attend === 2) _count = {..._count, attend: _count?.attend + 1};
          if(e?.sheet?.rating === 2) _count = {..._count, _2: _count?._2 + 1};
          if(e?.sheet?.rating === 3) _count = {..._count, _3: _count?._3 + 1};
          if(e?.sheet?.rating === 4) _count = {..._count, _4: _count?._4 + 1};
          if(e?.sheet?.rating === 5) _count = {..._count, _5: _count?._5 + 1};
        })
        setBall_count(_count);
      },
      enabled: !!data?.data && !!group?.id,
    },
  });

  function printPage() {
    if (iframe_ref?.current) {
      const _iframe = iframe_ref.current;
      _iframe.contentDocument?.open()
      if (print_ref?.current) {
        _iframe.contentDocument?.write(print_ref.current?.innerHTML)
      }
      _iframe.contentDocument?.close();
      _iframe.focus();

      _iframe.contentWindow?.print()
    }
  }

  return (
    <div className="">
      <HeaderExtraLayout title={`Baholash qaydnomasi`} isBack
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Exams", path: '/exams' },
          { name: "Baholash qaydnomasi", path: 'Baholash qaydnomasi' }
        ]}
        btn={(checkRole("admin") || checkRole("edu_admin") || checkRole("dean") || checkRole("rector") || checkRole("prorector") || checkRole("mudir")) ? <Button onClick={printPage} className='d-f' ><PrintRegular fontSize={16} />&nbsp;&nbsp;Chop etish</Button> : null}
      />
      <Spin spinning={isFetching || studentIsFetching}>
        <div className='m-4 mb-0' >
          {
            data?.data?.groups?.map((e: any, i: number) =>
              <Tag color={group?.id === e?.group_id ? '#108ee9' : "blue"} className='border-0 cursor-pointer text-[14px] py-1 px-4' key={i} onClick={() => { setGroup(e?.group) }} >{e?.group?.unical_name}</Tag>)
          }
        </div>
        <iframe ref={iframe_ref} style={{ height: '0px', width: '0px', position: 'absolute' }}></iframe>
        <div className="my-6 px-5" ref={print_ref} >
          <div className="w-full">
            <div className="border-solid border-slate-50 border shadow-md rounded-md p-4" style={{ minHeight: "800px" }}>
              <div>
                <p style={{ fontSize: "11px", textAlign: "right", fontStyle: "italic" }} >1{data?.data?.vedomst === 2 ? "A" : data?.data?.vedomst === 3 ? "B" : ""}-shakl</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", textAlign: "center", margin: "0 0 4px 0" }}>O‘ZBEKISTON RESPUBLIKASI OLIY TA’LIM, FAN VA INNOVATSIYALAR VAZIRLIGI</p>
                <p style={{ fontSize: "12px", textAlign: "center", margin: "0" }}>TOSHKENT AMALIY FANLAR UNIVERSITETI</p>
              </div>
              <br />
              <h2 style={{ fontSize: "12px", textAlign: "center" }}>BAHOLASH QAYDNOMASI  № {data?.data?.eduYear?.start_year}-{data?.data?.eduYear?.end_year}/{data?.data?.semestr_id}-{data?.data?.id}</h2>
              <br />
              <div style={{ fontSize: "11px", lineHeight: "18px" }}>
                <span style={{ marginBottom: "11px" }}><span style={{ fontWeight: 600 }} >Fakultet:</span> {data?.data?.eduPlan?.faculty?.name}</span> &nbsp;
                <span style={{ marginBottom: "11px" }}><span style={{ fontWeight: 600 }} >Semestr:</span> {data?.data?.eduSemestr?.semestr?.name}</span> &nbsp;
                <span style={{ marginBottom: "11px" }}><span style={{ fontWeight: 600 }} >Guruh:</span> {group?.unical_name}</span> &nbsp;
                <div><p style={{ marginBottom: "11px", margin: 0, padding: 0 }}><span style={{ fontWeight: 600 }} >Fan:</span> {data?.data?.eduSemestrSubject?.subject?.name} {data?.data?.vedomst === 2 ? "(qayta topshirish)" : data?.data?.vedomst === 3 ? " (qayta topshirish)" : ""}</p></div>
                <div> <p style={{ marginBottom: "11px", margin: 0, padding: 0 }}><span style={{ fontWeight: 600 }} >Nazorat mas’uli:</span> {data?.data?.user?.last_name.toUpperCase()} {data?.data?.user?.first_name.toUpperCase()} {data?.data?.user?.middle_name.toUpperCase()}</p></div>
                {/* <div><p style={{ marginBottom: "11px", margin: 0, padding: 0 }}><span style={{ fontWeight: 600 }} >Nazorat mas’uli:</span> BAYMANOV HABIBULLO ABDULLAYEVICH</p></div> */}
                <div><p style={{ marginBottom: "11px", margin: 0, padding: 0 }}><span style={{ fontWeight: 600 }} >Semestrda fanga ajratilgan umumiy soatlar/kredit:</span> {data?.data?.eduSemestrSubject?.all_ball_yuklama} / {data?.data?.eduSemestrSubject?.credit}</p></div>
                <div><p style={{ marginBottom: "11px", margin: 0, padding: 0 }}><span style={{ fontWeight: 600 }} >Yakuniy nazorat/qayta topshirish o‘tkazilgan sana:</span> {data?.data?.date}</p></div>
              </div>
              <br />
              <table style={{ fontSize: "10px", width: "100%", borderCollapse: "collapse" }} >
                <thead>
                  <tr style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc", }}>
                    <th rowSpan={2} style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc" }} >№</th>
                    <th rowSpan={2} style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc" }} >Talabaning familiyasi, ismi, sharifi</th>
                    <th rowSpan={2} style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc", textAlign: "center" }} >Talabaning logini</th>
                    <th colSpan={2} style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc" }} >O‘zlashtirish ko‘rsatkich</th>
                  </tr>
                  <tr style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc", }}>
                    <th style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc", textAlign: "center" }} >Ball</th>
                    <th style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc", textAlign: "center" }} >Baho</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.items?.sort(sortStudent)?.map((e, i) => (
                    <tr key={i} style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc", }}>
                      <td style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc" }} >{i + 1}</td>
                      <td style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc" }} >{e?.studentUser?.profile?.last_name.toUpperCase()} {e?.studentUser?.profile?.first_name.toUpperCase()} {e?.studentUser?.profile?.middle_name?.toUpperCase()}</td>
                      <td style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc", textAlign: "center" }} >{e?.studentUser?.username}</td>
                      <td style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc", textAlign: "center" }} >{e?.sheet?.ball}</td>
                      <td style={{ padding: "0.5rem 0.5rem", border: "1px solid #cccccc", textAlign: "center" }} >{e?.sheet?.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <div>
                <p style={{ fontSize: "11px" }} >Jami talabalar: {students?.items?.length} shundan, “5”: {ball_count?._5}, “4”: {ball_count?._4},  “3”: {ball_count?._3}  “2”: {ball_count?._2}, “kelmadi” {ball_count?.attend}</p>
              </div>
              <br />
              <div style={{ minHeight: 200 }} >
                <table style={{ fontSize: "10px", width: "100%", borderCollapse: "collapse" }} >
                  <tbody>
                    <tr style={{ padding: "0.5rem 0.5rem", border: "none" }}>
                      <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >Fakultet dekani</td>
                      <td style={{ padding: "0.5rem 0.5rem", border: "none" }} ><img src={data?.data?.finalExamConfirm?.find((e: any) => e?.type === 3)?.qr_code} width={120} alt="" /></td>
                      <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >{data?.data?.finalExamConfirm?.find((e: any) => e?.type === 3)?.user?.last_name.toUpperCase()} {data?.data?.finalExamConfirm?.find((e: any) => e?.type === 3)?.user?.first_name.toUpperCase()} {data?.data?.finalExamConfirm?.find((e: any) => e?.type === 3)?.user?.middle_name.toUpperCase()}</td>
                      {/* <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >URAIMOV IQBOLJON ANVARJON O'G'LI</td> */}
                    </tr>
                    <tr style={{ padding: "0.5rem 0.5rem", border: "none" }}>
                      <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >Kafedra mudiri</td>
                      <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >
                        <span style={{ display: "inline-block", border: "0px solid #19B293", backgroundColor: "#E8F7F4", borderRadius: 4, padding: 2, color: "#19B293" }} ><div style={{ border: "0px solid #19B293", borderRadius: 4, padding: ".45rem 1rem .25rem 1rem", fontWeight: 600, fontSize: 13 }} >TASDIQLANGAN</div><div style={{ textAlign: "right", padding: "0 3px 2px 0" }} >{data?.data?.finalExamConfirm?.find((e: any) => e?.type === 2) ? dayjs.unix(data.data.finalExamConfirm.find((e: any) => e.type === 2).date).format("YYYY-MM-DD HH:mm") : ""}</div></span>
                      </td>
                      {/* <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >ABDURAIMOV FARHOD NASIMJON O'G'LI</td> */}
                      <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >{data?.data?.finalExamConfirm?.find((e: any) => e?.type === 2)?.user?.last_name.toUpperCase()} {data?.data?.finalExamConfirm?.find((e: any) => e?.type === 2)?.user?.first_name.toUpperCase()} {data?.data?.finalExamConfirm?.find((e: any) => e?.type === 2)?.user?.middle_name.toUpperCase()}</td>
                    </tr>
                    <tr style={{ padding: "0.5rem 0.5rem", border: "none" }}>
                      <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >Nazorat mas’uli</td>
                      <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >
                        <span style={{ display: "inline-block", border: "0px solid #1A73E8", backgroundColor: "#E8F0FE", borderRadius: 4, padding: 2, color: "#1A73E8" }} ><div style={{ border: "0px solid #19B293", borderRadius: 4, padding: ".45rem 1rem .25rem 1rem", fontWeight: 600, fontSize: 13 }} >BAHOLANGAN</div><div style={{ textAlign: "right", padding: "0 3px 2px 0" }} >{data?.data?.finalExamConfirm?.find((e: any) => e?.type === 2) ? dayjs.unix(data.data.finalExamConfirm.find((e: any) => e.type === 1).date).format("YYYY-MM-DD HH:mm") : ""}</div></span>
                      </td>
                      <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >{data?.data?.user?.last_name.toUpperCase()} {data?.data?.user?.first_name.toUpperCase()} {data?.data?.user?.middle_name.toUpperCase()}</td>
                      {/* <td style={{ padding: "0.5rem 0.5rem", border: "none" }} >BAYMANOV HABIBULLO ABDULLAYEVICH</td> */}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </Spin>
    </div>
  );
};

export default ExamSheet;

/**
  * student-study-sheet_index
  * student-study-sheet_delete
  * student-study-sheet_update
  * student-study-sheet_view
*/