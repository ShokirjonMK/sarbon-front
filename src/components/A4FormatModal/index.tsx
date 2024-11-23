import { Print24Regular } from "@fluentui/react-icons";
import { Modal } from "antd"
import { ILetterOutgoing } from "models/document";
import { Dispatch, useEffect, useRef } from "react"

const A4FormatModal = ({isModalOpen, setIsModalOpen, data}: {isModalOpen: boolean, setIsModalOpen: Dispatch<boolean>, data: ILetterOutgoing | undefined}) => {

    const divRef = useRef<any>();
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    function printPage() {

        if (iframeRef?.current) {

            const iframe = iframeRef.current;
            iframe.contentDocument?.open()
            if (divRef?.current) {
                iframe.contentDocument?.write(divRef.current?.innerHTML)
            }

            const iframeDocument = iframeRef.current.contentDocument;
            if (iframeDocument) {
                const styleElement = iframeDocument.createElement('style');
                styleElement.textContent = `
                    @media print {
                        table{
                            border-collapse: collapse;
                        }
                        thead,
                        tbody,
                        tfoot,
                        tr,
                        td,
                        th {
                            border: 1px solid #eff2f7;
                        }

                        td,
                        th {
                            padding: 0.7rem 1rem;
                        }
                        @page {
                            margin: 30px;
                        }
                    }
                    
                `;
                iframeDocument.head.appendChild(styleElement);
            }

            iframe.contentDocument?.close();
            iframe.focus();
            iframe.contentWindow?.print()

        }
    }
    

    return (
        <Modal style={{top: 20}} title={<Print24Regular onClick={() => printPage()} className="cursor-pointer" />} className="min-w-[800px] file-opener-modal" width={800} open={isModalOpen} footer={false} onCancel={() => setIsModalOpen(false)}>
            <iframe  ref={iframeRef} className="printable-content" style={{ height: '0px', width: '0px', position: 'absolute' }}></iframe>
            <div className="relative">
                <div ref={divRef} className="min-h-[1000px] printable-content responsiveTable">
                    <p dangerouslySetInnerHTML={{__html: data ? data?.body?.body : ""}} />
                    {
                    data?.qrCode?.map(i => (
                        <div style={{display: "flex", justifyContent: "space-between", margin: "50px 50px 0 50px"}} key={i?.id}>
                            <p style={{fontSize: "20px", fontWeight: 600}}>Rector</p>
                            <div className="">
                                <img src={i?.qr_code} alt="" />
                            </div>
                            <p style={{fontSize: "20px", fontWeight: 600}}>{i?.createdBy?.first_name?.slice(0, 1)}. {i?.createdBy?.last_name}</p>
                        </div>
                    ))
                    }
                </div>
            </div>
        </Modal>
    )
}
export default A4FormatModal;