import { renderFullName } from "utils/others_functions";

type TypeAuthInfoView = {
    data: any,
    user_id: number | string,
}

const StudentStudySheetFirstPage: React.FC<TypeAuthInfoView> = ({ data }) => {

    return (
        <div className="w-full">
            <div className="border-solid border-slate-50 border shadow-md rounded-md p-4" style={{height: "1500px"}}>
                <br />
                <br />
                <p style={{fontSize: "30px", textAlign: "center"}}>Sarbon Universiteti</p>
                <br />
                <h2 style={{fontSize: "35px", textAlign: "center"}}>Talaba o'quv varaqasi</h2>
                <br />
                <div style={{display: "grid", gridTemplateColumns: "48% 48%", gap: "0 4%"}}>
                    <div></div>
                    <div>
                        <p style={{fontSize: "16px", margin: "30px 0 60px 0"}}>Reyting daftarchasi № ____________________</p>
                    </div>
                    <div style={{fontSize: "16px", lineHeight: "30px"}}>
                        <p style={{marginBottom:"10px"}}>1. {renderFullName(data?.profile)}</p>
                        <p style={{marginBottom:"10px"}}>2. Manzili: {data?.region?.name}, {data?.area?.name}</p>
                        <p style={{marginBottom:"10px"}}>3. O'qishga kirgan sanasi: buyruq № ____________________ <br /> &#10092;&#10092; ___ &#10093;&#10093; _________ 20__ yil</p>
                        <p style={{marginBottom:"10px"}}>4. O'qish shakli: {data?.eduForm?.name}</p>
                        <p style={{marginBottom:"10px"}}>5. Yo'nalishi (Mutaxasislik): {data?.direction?.name}</p>
                        <p style={{marginBottom:"10px"}}>6. O'qishdan chetlatildi: _________________________________________________________________ <br /><p style={{textAlign: "center"}}>(sababi, buyruq №, sanasi)</p></p>
                        <p style={{marginBottom:"10px"}}>7. O'qishga tiklandi: _________________________________________________________________ <br /><p style={{textAlign: "center"}}>(sababi, buyruq №, sanasi)</p></p>
                        <p style={{marginBottom:"10px"}}>8. Akademik ta'til berilganligi haqida ma'lumot <br /> &#10092;&#10092; ___ &#10093;&#10093; _______________ 20___ yildagi № ______ buyruq bilan _________________________________________________ ko'ra akademik ta'til berildi va ______________ guruhda hisobga olindi. <br /> &#10092;&#10092; ___ &#10093;&#10093; _______________ 20___ yildagi № ______ buyruq bilan _________________________________________________ sababli 20___ o'quv yiliga akademik ta'til berildi va __ kurs ______________ guruhida hisobga olindi</p>
                    </div>
                    <div style={{fontSize: "16px", lineHeight: "30px"}}>
                        <p style={{marginBottom:"10px"}}>9. O'qish davomida ___ fan topshirildi: <br />&#10092;&#10092; A'lo &#10093;&#10093; __________________ <br />&#10092;&#10092; Yaxshi &#10093;&#10093; __________________<br />&#10092;&#10092; Qoniqarli &#10093;&#10093; __________________</p>
                        <p style={{marginBottom:"10px"}}>10. 20____ yil № ______ buyruq bilan BMI (magistrlik dissertatsiyasi)ni bajarishga, yakuniy davlat attestatsiyasini topshirishga ruxsat berildi</p>
                        <p style={{marginBottom:"10px"}}>
                            11. Yakuniy davlat attestatsiyalari natijalari: <br />
                            <table  style={{width: "100%", borderCollapse: "collapse"}} >
                                <tbody>
                                    <tr>
                                        <td style={{padding: "0.7rem 1rem", border: "1px solid #eff2f7", width: "50px"}}>№</td>
                                        <td style={{padding: "0.7rem 1rem", border: "1px solid #eff2f7", width: "50%"}}>Fan</td>
                                        <td style={{padding: "0.7rem 1rem", border: "1px solid #eff2f7", width: "20%"}}>Sana</td>
                                        <td style={{padding: "0.7rem 1rem", border: "1px solid #eff2f7", width: "20%"}}>Baho</td>
                                    </tr>
                                    {
                                        [1, 1, 1, 1].map((i, index) => (
                                            <tr style={{height: "40px"}} key={index}>
                                                <td style={{padding: "0.7rem 1rem", border: "1px solid #eff2f7"}}></td>
                                                <td style={{padding: "0.7rem 1rem", border: "1px solid #eff2f7"}}></td>
                                                <td style={{padding: "0.7rem 1rem", border: "1px solid #eff2f7"}}></td>
                                                <td style={{padding: "0.7rem 1rem", border: "1px solid #eff2f7"}}></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </p>
                        <p style={{marginBottom:"10px"}}>12. Bitiruv-malakaviy ishi (magistrlik dissertatsiyasini) <span className="break-words">____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________</span> mavzusida 20____ yilning &#10092;&#10092; ___ &#10093;&#10093; _______________ da &#10092;&#10092; ________ &#10093;&#10093; bahoga himoya qildi.</p>
                        <p style={{marginBottom:"10px"}}>13. 20___ yil Davlat attestatsiya komissiyasi Qaroriga muvofiq <span className="break-words">____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________</span> bakalavr (magistr) berilgan va OTM tugatganlik va diplom berilganlikni hisobga olish kitobida № ______ bilan qayd etildi.</p>
                    </div>
                    <div></div>
                    <div>
                        <p style={{fontSize: "16px"}}>Fakultet dekani: ______________________</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default StudentStudySheetFirstPage;