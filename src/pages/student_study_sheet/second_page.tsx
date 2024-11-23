import useGetAllData from 'hooks/useGetAllData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import React, { useState } from 'react';

const StudentStudySheetSecondPage: React.FC<{studentSemestrSubjects: any}> = ({studentSemestrSubjects}): JSX.Element => {
  const {urlValue} = useUrlQueryParams({});
  const [semestr, setSemestr] = useState<any[]>([])

  const { data: edu_semestrs } = useGetAllData({
    queryKey: ["edu-semestrs", urlValue?.filter],
    url: `/edu-semestrs?expand=eduYear,eduSemestrSubjects.subject&filter={"edu_plan_id":${urlValue?.filter?.edu_plan_id}}`,
    options: {
      onSuccess: (res) => {
        let arr: any[] = [];
        res.items?.forEach(e => {
          const i = arr?.find(a => a?.id === e?.course_id)
          if (!i) {
            arr.push({
              id: e?.course_id,
              edu_year: `${e?.eduYear?.start_year}-${e?.eduYear?.end_year}`,
              count: (e?.eduSemestrSubjects?.length ?? 0),
              semestr: [e]
            })
          } else {
            arr = arr.map(a => {
              if (a?.id === e?.course_id) return { ...a, count: (a?.count ?? 0) + (e?.eduSemestrSubjects?.length ?? 0), semestr: [...a?.semestr, e] }
              return a
            });
          }
        })
        setSemestr([...arr])
      },
      enabled: !!urlValue?.filter?.edu_plan_id
    }
  })

  const calcBall = (item: any, idx: number) => {
    const stdVedmosts = studentSemestrSubjects?.find((sub: any) => sub?.edu_semestr_subject_id === item?.eduSemestrSubjects[idx]?.id)?.studentVedomst;
    return stdVedmosts?.find((i: any) => (i?.vedomst === (stdVedmosts?.length)))?.ball
  }

  const calcReyting = (item: any, idx: number, yuklama: number) => {
    if(calcBall(item, idx)) return (calcBall(item, idx) * yuklama) / 100
    return ""
  }

  return (
    <div className="w-full border-solid border-slate-50 border shadow-md rounded-md p-4 mt-4" >
        <h2 style={{textAlign: "center", margin: "40px 0"}} >O'quv dasturining bajarilishi</h2>
        <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
          {
            semestr?.map((d, ix) => (
              <table style={{width: "100%", borderCollapse: "collapse"}} key={ix} >
                <tbody>
                  {
                    d?.semestr?.map((e: any, i: number) => (
                      <>
                        <tr key={i} style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7"}} >
                          {i === 0 ? <th rowSpan={19} style={{ border: "1px solid #eff2f7", padding: "2.5rem 0rem" }} ><p style={{width: "45px", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", textOverflow: "ellipsis", transform: 'rotate(-90deg)'}}>{d?.id} - kurs {d?.edu_year} o'quv yili</p></th> : null}
                          <th rowSpan={ i ? 10 : 9} style={{ border: "1px solid #eff2f7", padding: "2.5rem 0rem" }} ><p style={{width: "45px", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", textOverflow: "ellipsis", transform: 'rotate(-90deg)'}}>{e?.semestr_id} - semestr</p></th>
                          {
                            i === 0 ? <>
                              <th style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7", width: "50%"}}>Fan nomi</th>
                              <th style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7"}}>Soat / Kredit</th>
                              <th style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7"}}>Ball</th>
                              <th style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7"}}>Reyting</th>
                            </> : null
                          }
                        </tr>
                        {
                          [...Array(8)]?.map((a: any, idx: number) => (
                            <tr key={idx} style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7", height: "35px"}}>
                              <td style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7", textAlign: "center"}} >{e?.eduSemestrSubjects[idx]?.subject?.name}</td>
                              <td style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7", textAlign: "center"}} >{e?.eduSemestrSubjects[idx]?.all_ball_yuklama} {e?.eduSemestrSubjects[idx] ? '/' : ""} {e?.eduSemestrSubjects[idx]?.credit}</td>
                              <td style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7", textAlign: "center"}} >{calcBall(e, idx) ? calcBall(e, idx) : ""}</td>
                              <td style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7", textAlign: "center"}} >{calcReyting(e, idx, e?.eduSemestrSubjects[idx]?.all_ball_yuklama)}</td>
                            </tr>
                          ))
                        }
                        {i ? <tr><th style={{padding: "0.5rem 0.5rem", border: "1px solid #eff2f7"}} colSpan={5} >20__ yil "__" _____ № _____ buyruq bilan {d?.id}-kursga o'tgazildi</th></tr> : null}
                      </>
                    ))
                  }
                  {/* <tr><td>20__ yil "__" _____ № _____ buyruq bilan {d?.id}-kursga o'tgazildi</td></tr> */}
                </tbody>
              </table>
            ))
          }
        </div>
      </div>
  );
};

export default StudentStudySheetSecondPage;