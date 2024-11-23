import { Modal, Tag } from "antd";
import { FILE_URL } from "config/utils";
import React, { FC } from "react";
import { BiX } from "react-icons/bi";
import { ArrowDownloadRegular, DocumentFilled, DocumentTableFilled, FolderZipFilled } from "@fluentui/react-icons";
import './style.scss';
import { useTranslation } from "react-i18next";

type TypeOpenFileByModal = {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  file: string,
  width?: number | string
  top?: number | string
}

const OpenFileByModal: FC<TypeOpenFileByModal> = ({ visible, setVisible, file, width = 1000, top = 10 }): JSX.Element => {
  const { t } = useTranslation();

  const fileName = file ? file.split('/')[file.split('/').length - 1] : "File"

  const checkFileFormat = (file: string | null): "pdf" | "doc" | "ppt" | "excel" | "img" | "audio" | "video" | "other" | "zip" => {
    if (file && file.endsWith(".pdf")) return "pdf";
    else if (file && (file.endsWith(".doc") || file.endsWith(".docx"))) return "doc";
    else if (file && (file.endsWith(".ppt") || file.endsWith(".pptx"))) return "ppt";
    else if (file && (file.endsWith(".png") || file.endsWith("jpg"))) return "img";
    else if (file && (file.endsWith(".mp3") || file.endsWith(".ogg") || file.endsWith(".dsd") || file.endsWith(".aac") || file.endsWith(".alac") || file.endsWith(".wma") || file.endsWith(".flac"))) return "audio";
    else if (file && (file.endsWith(".mp4") || file.endsWith(".mov") || file.endsWith(".wmv") || file.endsWith(".flv") || file.endsWith(".avi") || file.endsWith(".mkv"))) return "video";
    else if (file && (file.endsWith(".xls"))) return "excel";
    else if (file && (file.endsWith(".zip") || file.endsWith(".rar"))) return "zip";
    else return "other"
  }

  return (
    <Modal
      title={fileName}
      open={visible}
      onCancel={() => setVisible(p => !p)}
      closeIcon={<BiX size={20} />}
      width={width}
      style={{top}}
      footer={null}
    >
      <div className="text-center">
        {
          file ? file.endsWith('.pdf') ? <iframe className="max-w-full min-w-[50%] rounded-lg" src={FILE_URL + file} width="100%" height={700} ></iframe>
            : checkFileFormat(file) === "video" ? (<video className="max-w-full min-w-[50%] rounded-lg" src={FILE_URL + file} controls></video>)
              : checkFileFormat(file) === "audio" ? (<audio src={FILE_URL + file} controls className="w-full rounded-xl" ></audio>)
                : checkFileFormat(file) === "img" ? <img className="max-w-full min-w-[50%] rounded-lg" src={FILE_URL + file} />
                  : (checkFileFormat(file) === "ppt" || checkFileFormat(file) === "doc" || checkFileFormat(file) === "excel") ?
                    <div>
                      <div className="flex-between flex-wrap gap-2 mb-2">
                        <div className="d-f">
                          {
                            // checkFileFormat(file) === "excel" ? <DocumentTableFilled fontSize={20} color="#0a3180" />
                            //   : checkFileFormat(file) === "zip" ? <FolderZipFilled fontSize={20} color="#0a3180" />
                            //     : <DocumentFilled fontSize={20} color="#0a3180" />
                          }

                          {/* <div className="text-black text-opacity-90 text-sm font-medium ml-2">{fileName}</div> */}
                        </div>
                        {/* <div> */}
                        <a href={FILE_URL + file} download className=" order-1 px-[15px] py-1 bg-white rounded-lg shadow border border-solid border-zinc-300 justify-center items-center gap-2.5 flex">
                          <ArrowDownloadRegular fontSize={15} />
                          <div className="text-center text-black text-opacity-90 text-sm font-normal leading-snug">{t("Download")}</div>
                        </a>
                      </div>
                      <iframe frameBorder='0' className="max-w-full min-w-[50%] rounded-lg" src={`https://view.officeapps.live.com/op/embed.aspx?src=${FILE_URL + file}`} width="100%" height={700} ></iframe>
                    </div>
                    : <div className="p-3 bg-gray-100 rounded-lg border border-solid border-black border-opacity-5 text-start">
                      <div className="flex-between flex-wrap gap-2 ">
                        <div className="d-f">
                          {
                            checkFileFormat(file) === "excel" ? <DocumentTableFilled fontSize={20} color="#0a3180" />
                              : checkFileFormat(file) === "zip" ? <FolderZipFilled fontSize={20} color="#0a3180" />
                                : <DocumentFilled fontSize={20} color="#0a3180" />
                          }
                          <div className="text-black text-opacity-90 text-sm font-medium ml-2">{fileName}</div>
                        </div>
                        {/* <div> */}
                        <a href={FILE_URL + file} download className=" order-1 px-[15px] py-1 bg-white rounded-lg shadow border border-solid border-zinc-300 justify-center items-center gap-2.5 flex">
                          <ArrowDownloadRegular fontSize={15} />
                          <div className="text-center text-black text-opacity-90 text-sm font-normal leading-snug">{t("Download")}</div>
                        </a>
                        {/* </div> */}
                      </div>
                    </div>
            : <Tag color="red" className="border-0"> Hujjat mavjud emas </Tag>
        }
      </div>
    </Modal>
  )
}

export default OpenFileByModal