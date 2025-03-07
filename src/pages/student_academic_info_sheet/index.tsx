import { PrintRegular } from "@fluentui/react-icons";
import { Button, Spin } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import useGetAllData from "hooks/useGetAllData";
import useGetOneData from "hooks/useGetOneData";
import { IStudent } from "models/student";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { renderFullName } from "utils/others_functions";
import Logo from '../../assets/images/logo-academic-sheet.png'
import licence from '../../assets/images/licence.png'
import MainLoader from "pages/login/loader";

const StudentAcademicInfo = () => {

    const { student_id } = useParams();
    const iframe_ref = useRef<HTMLIFrameElement | null>(null);
    const print_ref = useRef<any>(null);
    const [sortedstudentSemestrSubjects, setSortedstudentSemestrSubjects] = useState<any>()
    const [sortedstudentSemestrSubjectsObj, setSortedstudentSemestrSubjectsObj] = useState<any>()
    const [loading, setloading] = useState<boolean>(true)
    const [bottomBlockMarginTop, setbottomBlockMarginTop] = useState<number>(30)

    const { data } = useGetOneData<IStudent>({
        queryKey: ["students", student_id],
        url: `students/${student_id}?expand=profile,user,region,area,direction,eduForm,eduPlan.eduYear,eduPlan.faculty.leader,qrAcademikReference`,
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!student_id,
        }
    })

    const { data: studentSemestrSubjects } = useGetAllData({
        queryKey: ["student-semestr-subjects"],
        url: `student-semestr-subjects`,
        urlParams: {
            "per-page": 0,
            filter: JSON.stringify({ student_id }),
            expand: "eduSemestrSubject.subject,eduSemestrSubject.categoryAllHour,eduSemestr"
        },
        options: {
            refetchOnWindowFocus: false,
            retry: 1,
            enabled: !!student_id
        },
    });

    useEffect(() => {
        setloading(true)
        let arr = studentSemestrSubjects?.items.sort((a, b) => a?.semestr_id - b?.semestr_id) || []
        let obj = arr.reduce((acc, curr) => {
            const curr_semestr_id = curr?.semestr_id;
            if (curr_semestr_id) {
                if (!acc[curr_semestr_id]) {
                    acc[curr_semestr_id] = [];
                }
                acc[curr_semestr_id].push(curr);
            }
            return acc;
        }, {});

        setSortedstudentSemestrSubjectsObj(obj)
        setSortedstudentSemestrSubjects(arr)

        setTimeout(() => {
            setloading(false)
        }, 1000);
    }, [studentSemestrSubjects])


    async function printPage() {
        if (studentSemestrSubjects?.items) {
            if (studentSemestrSubjects?.items?.length >= 8 && studentSemestrSubjects?.items?.length <= 15) {
                await setbottomBlockMarginTop(200)
            } else {
                await setbottomBlockMarginTop(30)
            }
        }

        if (iframe_ref?.current) {
            const _iframe = iframe_ref.current;
            _iframe.contentDocument?.open()
            if (print_ref?.current) {
                _iframe.contentDocument?.write(print_ref.current?.innerHTML)
            }
            _iframe.contentDocument?.write(`
            <style>
                @media print {
                    @page { size: portrait; }

                    body{
                        margin: 0;
                        padding: 0;

                    }
                    *{
                        font-size: 12px !important;
                        padding: 0;
                    }
                    img{
                        height: auto;
                    }
                }
            </style>
            `);
            _iframe.contentDocument?.close();
            _iframe.focus();
            _iframe.onload = function () {
                _iframe.contentWindow?.print();
            }
        }
    }

    const calcGPA = ({ data }: { data: any }) => {
        const allBall = data?.reduce((acc: any, cur: any) => acc += (cur?.eduSemestrSubject?.credit * cur?.rating), 0);
        const allCredit = data?.reduce((acc: any, cur: any) => acc += cur?.eduSemestrSubject?.credit, 0)
        const factor = Math.pow(10, 1);
        return Math.round(allBall / allCredit * factor) / factor;
    }

    const calcCourse = (semestr: number) => {
        if (semestr == 1 || semestr == 2) return 1

        if (semestr == 3 || semestr == 4) return 2

        if (semestr == 5 || semestr == 6) return 3

        if (semestr == 7 || semestr == 8) return 4

        if (semestr == 9 || semestr == 10) return 5
    }

    if (loading) {
        return <MainLoader />
    }
    let i = 0
    return (
        <Spin spinning={false}>
            <HeaderExtraLayout title={`Student academic transcript`} isBack
                breadCrumbData={[
                    { name: "Home", path: '/' },
                    { name: "Students", path: '/students' },
                    { name: renderFullName(data?.data?.profile), path: `/students/view/${data?.data?.id}` },
                    { name: "Student academic transcript", path: 'Student academic transcript' }
                ]}
                btn={<Button onClick={printPage} className='d-f' ><PrintRegular fontSize={16} />&nbsp;&nbsp;Chop etish</Button>}
            />
            <div className="p-3">

                <div ref={print_ref} style={{ fontSize: "14px" }} className="w-[900px] bg-gray-50 p-4 rounded-sm mx-auto border border-slate-950 border-spacing-1 border-solid">
                    <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                        <div style={{ width: "35%" }}>
                            <strong>O‘ZBEKISTON RESPUBLIKASI </strong><br /><br />
                            <strong>“SARBON UNIVERSITETI” MCHJ</strong> <br /><br />

                            Toshkent shahar, Olmazor tumani, Paxta MFY, Sagbon ko`chasi 2a-uy. <br />
                            Tel.: +99878 888-22-88, E-mail: info@sarbon.university <br />
                            «Ipak yoʻli bank» Sagʻbon filiali <br />
                            X/r: 20208000405502778001, MFO 01036 <br />
                            STIR: 309341614, OKED: 85420 <br />

                        </div>
                        <div style={{ width: "28%" }}>
                            <img style={{ width: 130, height: "auto" }} src={Logo} alt="Logo" />
                        </div>
                        <div style={{ width: "35%" }}>

                            <strong>REPUBLIC OF UZBEKISTAN</strong><br /><br />

                            <strong>“SARBON UNIVERSITY” LLC</strong><br /><br />

                            Tashkent city, Olmazor district, Paxta MCG, Sagbon street, 2a house.<br />
                            Tel.: +99878 888-22-88, E-mail: info@sarbon.university<br />
                            "Ipak Yoʻli Bank" Sagbon branch<br />
                            Account No.: 20208000405502778001, MFO: 01036<br />
                            TIN: 309341614, OKED: 85420<br />

                        </div>
                    </div>

                    <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', height: 6, marginTop: 20, marginBottom: 20 }}></div>

                    <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                        <strong>Berilgan sana: ___________</strong>
                        <strong>Qayd raqami:  _________</strong>
                    </div>
                    <div style={{ fontSize: '24px' }}>
                        <h1 style={{ textAlign: "center", marginTop: 30, marginBottom: 30, fontSize: '24px' }}>AKADEMIK MA'LUMOTNOMA</h1>
                    </div>

                    <div style={{ display: "flex" }}>
                        <div style={{ width: "45%" }}>
                            <strong style={{ lineHeight: 1.6 }}>Talabaning F.I.SH.: </strong><br />
                            <strong style={{ lineHeight: 1.6 }}>Ta’lim yo ‘nalishining shifri va nomi:</strong> <br />
                            <strong style={{ lineHeight: 1.6 }}>Talabalikka qabul qilingan yil:</strong> <br />
                            <strong style={{ lineHeight: 1.6 }}>Ta’lim shakli:</strong> <br />
                        </div>
                        <div style={{ width: "35%" }}>
                            <strong style={{ lineHeight: 1.6 }}>{renderFullName(data?.data?.profile)}</strong><br />
                            <strong style={{ lineHeight: 1.6 }}>{data?.data?.direction?.name}</strong> <br />
                            <strong style={{ lineHeight: 1.6 }}>{data?.data?.eduPlan?.eduYear?.name?.split(" ")[0]}</strong> <br />
                            <strong style={{ lineHeight: 1.6 }}>{data?.data?.eduForm?.name}</strong> <br />
                        </div>
                    </div> <br />

                    <table style={{ width: "100%", borderCollapse: "collapse" }} className="semestrovka-table" >
                        <tbody style={{ textAlign: "center" }}>
                            <tr>
                                <td rowSpan={2} className="text-size-10 w-[35px] py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>№</td>
                                <td rowSpan={2} className="text-size-10 w-[300px] py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>Fan nomi (fan o'quv reja asosida to'liq yoziladi)</td>
                                <td rowSpan={2} className="text-size-10 py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>Semestr</td>
                                <td rowSpan={2} className="text-size-10 w-[130px] py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>O‘quv rejasi bo‘yicha soatlar miqdori</td>
                                <td rowSpan={2} className="text-size-10 w-[130px] py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>O‘quv rejasi bo‘yicha kredit miqdori</td>
                                <td rowSpan={1} colSpan={3} className="text-size-10 py-1 w-[180px]" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>O‘zlashtirish ko‘rsatkichi</td>
                            </tr>
                            <tr>
                                <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>Ball</td>
                                <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>Baho</td>
                                <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>Kredit</td>
                            </tr>

                            {
                                Object.keys(sortedstudentSemestrSubjectsObj)?.map((key: any, index: number) => {
                                    if (index % 2 === 0) {
                                        i = 0
                                    }

                                    return <React.Fragment key={index}>
                                        {/* <tr style={{height: 40, border: "0.2px solid #000"}}>
                                        <td colSpan={8} style={{fontWeight: "bold"}}>{key} - semestr</td>
                                    </tr> */}
                                        {
                                            (sortedstudentSemestrSubjectsObj[key] || [])?.map((item: any, idx: number) => {

                                                i++
                                                return <tr key={idx}>
                                                    <td className="text-size-10 w-[35px] py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>{i}</td>
                                                    <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", textAlign: "left" }}>{item?.eduSemestrSubject?.subject?.name}</td>
                                                    <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>{item?.eduSemestr?.semestr_id}</td>
                                                    <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>{item?.eduSemestrSubject?.categoryAllHour}</td>
                                                    <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>{item?.eduSemestrSubject?.credit}</td>
                                                    <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>{item?.all_ball}</td>
                                                    <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>{item?.rating}</td>
                                                    <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000" }}>{item?.rating ? item?.eduSemestrSubject?.credit : 0}</td>
                                                </tr>
                                            })
                                        }

                                        {/* <tr>
                                        <td rowSpan={2} colSpan={3} className="text-size-10 w-[35px] py-1" style={{padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold"}}>Jami:</td>
                                        <td rowSpan={2} className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold"}}>{sortedstudentSemestrSubjectsObj[key]?.reduce((acc: any, cur: any) => acc += cur?.eduSemestrSubject?.categoryAllHour, 0)}</td>
                                        <td rowSpan={2} className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold"}}>{sortedstudentSemestrSubjectsObj[key]?.reduce((acc: any, cur: any) => acc += cur?.eduSemestrSubject?.credit, 0)}</td>
                                        <td colSpan={2} className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold"}}> GPA</td>
                                        <td className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold"}}>{calcGPA({data: sortedstudentSemestrSubjectsObj[key]})}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="text-size-10 py-1" style={{padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold"}}>Kredit</td>
                                        <td className="text-size-10 py-1" style={{padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold"}}>{sortedstudentSemestrSubjectsObj[key]?.reduce((acc: any, cur: any) => acc += (cur?.rating ? cur?.eduSemestrSubject?.credit : 0), 0)}</td>
                                    </tr> */}
                                        {
                                            index > 0 && index % 2 === 1 ?
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <td rowSpan={2} colSpan={3} className="text-size-10 w-[35px] py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>{calcCourse(key)} - kurs bo'yicha jami:</td>
                                                        <td rowSpan={2} className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>{[...sortedstudentSemestrSubjectsObj[key], ...sortedstudentSemestrSubjectsObj[key - 1]]?.reduce((acc, cur) => acc += cur?.eduSemestrSubject?.categoryAllHour, 0)}</td>
                                                        <td rowSpan={2} className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>{[...sortedstudentSemestrSubjectsObj[key], ...sortedstudentSemestrSubjectsObj[key - 1]]?.reduce((acc, cur) => acc += cur?.eduSemestrSubject?.credit, 0)}</td>
                                                        <td colSpan={2} className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}> GPA</td>
                                                        <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>{calcGPA({ data: [...sortedstudentSemestrSubjectsObj[key], ...sortedstudentSemestrSubjectsObj[key - 1]] })}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} className="text-size-10 py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>Kredit</td>
                                                        <td className="text-size-10 py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>{[...sortedstudentSemestrSubjectsObj[key], ...sortedstudentSemestrSubjectsObj[key - 1]]?.reduce((acc, cur) => acc += (cur?.rating ? cur?.eduSemestrSubject?.credit : 0), 0)}</td>
                                                    </tr>
                                                </React.Fragment> : ""
                                        }
                                    </React.Fragment>
                                })
                            }



                            {/* {
                                sortedstudentSemestrSubjects?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td className="text-size-10 w-[35px] py-1" style={{padding: "3px 8px", border: "0.2px solid #000"}}>{index + 1}</td>
                                        <td className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000", textAlign: "left"}}>{item?.eduSemestrSubject?.subject?.name}</td>
                                        <td className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000"}}>{item?.eduSemestr?.semestr_id}</td>
                                        <td className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000"}}>{item?.eduSemestrSubject?.categoryAllHour}</td>
                                        <td className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000"}}>{item?.eduSemestrSubject?.credit}</td>
                                        <td className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000"}}>{item?.all_ball}</td>
                                        <td className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000"}}>{item?.rating}</td>
                                        <td className="text-size-10  py-1" style={{padding: "3px 8px", border: "0.2px solid #000"}}>{item?.rating ? item?.eduSemestrSubject?.credit : 0}</td>
                                    </tr>
                                ))
                            } */}
                            <tr>
                                <td rowSpan={2} colSpan={3} className="text-size-10 w-[35px] py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>Jami:</td>
                                <td rowSpan={2} className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>{studentSemestrSubjects?.items?.reduce((acc, cur) => acc += cur?.eduSemestrSubject?.categoryAllHour, 0)}</td>
                                <td rowSpan={2} className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>{studentSemestrSubjects?.items?.reduce((acc, cur) => acc += cur?.eduSemestrSubject?.credit, 0)}</td>
                                <td colSpan={2} className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}> GPA</td>
                                <td className="text-size-10  py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>{calcGPA({ data: studentSemestrSubjects?.items })}</td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="text-size-10 py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>Kredit</td>
                                <td className="text-size-10 py-1" style={{ padding: "3px 8px", border: "0.2px solid #000", fontWeight: "bold" }}>{studentSemestrSubjects?.items?.reduce((acc, cur) => acc += (cur?.rating ? cur?.eduSemestrSubject?.credit : 0), 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 30, marginTop: 30 }}>
                        <p><strong>Izoh:</strong> Sarbon Universiteti Vazirlar Mahkamasining tegishli qarori bilan tashkil etilgan hamda Oliy ta’lim, fan va innovatsiyalar vazirligi tomonidan 2024-yil 14-sentabrda berilgan №397374-sonli litsenziyaga asosan faoliyat olib boradi.</p>
                        <img style={{ width: 60, height: 60 }} src={licence} alt="licence" />
                    </div>
                    <div style={{ marginTop: bottomBlockMarginTop, marginBottom: 30, display: "flex", alignItems: "end" }}>
                        <div style={{ width: '40%' }}>
                            <strong>O‘quv ishlari bo‘yicha prorektor </strong><br /><br />
                            <strong>{data?.data?.eduPlan?.faculty?.name} {data?.data?.eduPlan?.faculty?.id === 6 || data?.data?.eduPlan?.faculty?.id === 5 ? "bo'lim boshlig'i" : "fakultet dekani"} </strong>
                        </div>
                        <div style={{ textAlign: "left" }}>
                            <strong>___________  M.D.Vapayev </strong><br /><br />
                            <strong>___________ {data?.data?.eduPlan?.faculty?.leader?.first_name[0]}.{data?.data?.eduPlan?.faculty?.leader?.middle_name[0]}.{data?.data?.eduPlan?.faculty?.leader?.last_name}</strong>
                        </div>
                        <div style={{ textAlign: "right", marginLeft: "auto" }}>
                            <div>
                                <p style={{ marginBottom: 10, fontWeight: "bolder" }}>Ma'lumotnoma haqiqiyligini tekshirish</p>
                                <img style={{ width: 80, height: 80 }} src={data?.data?.qrAcademikReference ?? ""} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <iframe ref={iframe_ref} style={{ height: '0px', width: '0px', position: 'absolute' }}></iframe>
            </div>
        </Spin>
    )
}
export default StudentAcademicInfo;