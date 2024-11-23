import { FC } from "react";
import { ArrowDownloadRegular, DocumentFilled, DocumentTableFilled, FolderZipFilled } from "@fluentui/react-icons";
import { t } from "i18next";
import { FILE_URL } from "config/utils";

type TypeFileViewer = {
  file: string,
  description?: string
}

const AllFileViewer: FC<TypeFileViewer> = ({ file, description }): JSX.Element => {

  const fileName = file ? file.split('/')[file.split('/').length - 1] : "File"

  const checkFileFormat = (file: string | null): "pdf" | "doc" | "ppt" | "excel" | "img" | "audio" | "video" | "other" | "zip" => {
    if (file && file.endsWith(".pdf")) return "pdf";
    else if (file && (file.endsWith(".doc") || file.endsWith(".docx"))) return "doc";
    else if (file && (file.endsWith(".ppt") || file.endsWith(".pptx"))) return "ppt";
    else if (file && (file.endsWith(".png") || file.endsWith("jpg"))) return "img";
    else if (file && (file.endsWith(".mp3") || file.endsWith(".ogg") || file.endsWith(".dsd") || file.endsWith(".aac") || file.endsWith(".alac") || file.endsWith(".wma") || file.endsWith(".flac"))) return "audio";
    else if (file && (file.endsWith(".mp4") || file.endsWith(".mov") || file.endsWith(".wmv") || file.endsWith(".flv") || file.endsWith(".avi") || file.endsWith(".mkv"))) return "video";
    else if (file && (file.endsWith(".xls") || file.endsWith(".xlsx"))) return "excel";
    else if (file && (file.endsWith(".zip") || file.endsWith(".rar"))) return "zip";
    else return "other"
  }

  console.log("checkFileFormat(sss)", `https://view.officeapps.live.com/op/embed.aspx?src=${FILE_URL + file}`);
  
  return (
    <div className="text-center">
      {
        file && file.endsWith('.pdf') ? <iframe className="max-w-full min-w-[50%] rounded-lg" src={FILE_URL + file} width="100%" height={700} ></iframe>
          : checkFileFormat(file) === "video" ? (<video className="max-w-full min-w-[50%] rounded-lg" src={FILE_URL + file} controls></video>)
            : checkFileFormat(file) === "audio" ? (<audio src={FILE_URL + file} controls className="w-full rounded-xl" ></audio>)
              : checkFileFormat(file) === "img" ? <img className="max-w-full min-w-[50%] rounded-lg" src={FILE_URL + file} />
                : checkFileFormat(file) === "ppt" || checkFileFormat(file) === "doc" || checkFileFormat(file) === "excel" ?
                  <div>
                    <div className="flex-between flex-wrap gap-2 mb-2">
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
                    </div>
                    <iframe frameBorder='0' className="max-w-full min-w-[50%] rounded-lg" src={`https://view.officeapps.live.com/op/embed.aspx?src=${FILE_URL + file}`} width="100%" height={700} ></iframe>
                  </div>
                  : file ? <div className="p-3 bg-gray-100 rounded-lg border border-solid border-black border-opacity-5 text-start">
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
                    <div className="text-black text-opacity-40 text-sm font-normal mt-2">{description}</div>
                  </div> : null
      }
    </div>
  )
}

export default AllFileViewer