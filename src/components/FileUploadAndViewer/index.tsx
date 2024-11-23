import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react';
import type { UploadFile, UploadProps } from 'antd';
import { Modal, Upload } from 'antd';
import { ArrowDownloadFilled, DeleteRegular, DocumentCheckmarkRegular, VideoClipRegular } from '@fluentui/react-icons';
import pdf from 'assets/images/_pdf.png'
import doc from 'assets/images/word.png'
import ppt from 'assets/images/ppt.png'
import excel from 'assets/images/excel.png'
import FileSaver from 'file-saver';
import LocalFileViewer from 'components/FileViewer/LocalFileViewer';
import AllFileViewer from 'components/FileViewer/AllFileViewer';

type TypeFileUploadAndViewer = {
  children: ReactNode
  files: UploadFile[]
  setFiles: Dispatch<SetStateAction<UploadFile[]>>
  maxCount?: number
  accept?: string
  onRemove?: (e: UploadFile<any>) => void
  showRemove?: boolean,
  showDownload?: boolean,
  className?: string
}

const FileUploaderAndViewer: FC<TypeFileUploadAndViewer> = ({ children, files, setFiles, accept = '.pdf,.doc,.docx', maxCount = 1, onRemove, className, showDownload = true, showRemove = true }) => {
  const [open, setOpen] = useState<UploadFile>();

  const props: UploadProps = {
    name: 'file',
    customRequest: ({ onSuccess }: any) => { onSuccess("ok") },
    onChange(e) {
      if (e.file.status !== 'removed') {
        setFiles(e.fileList?.map(i => ({ ...i, status: "done" })));
        console.log(e);
      }
    },
    // itemRender: (_, file, fileList, { download, preview, remove }) => {

    //   return <div>salom</div>
    // },
    onRemove: (e) => {
      Modal.confirm({
        title: <div className="d-f flex-wrap">{e?.name}</div>,
        content: "Ushbu faylni o'chirishni hohlaysizmi?",
        // icon: null,
        onOk: () => { onRemove ? onRemove(e) : setFiles(p => p.filter(i => i.uid !== e.uid)); },
      });
    },
    onDownload: (file) => {
      if (file.originFileObj) {
        FileSaver.saveAs(window.URL.createObjectURL(file.originFileObj), file.name);
      }
    },
    onPreview: (file) => {
      console.log(file);

      setOpen(file)
    },
    fileList: files,
    maxCount,
    accept,
    className,
    listType: "picture",
    iconRender: (file) => {
      const type = file.name?.split(".")?.reverse()[0];
      if (type === "pdf")
        return <img src={pdf} alt="pdf" />
      if (type.includes("doc"))
        return <img src={doc} alt="doc" />
      if (type.includes("xls"))
        return <img src={excel} alt="xls" />
      if (type.includes("ppt"))
        return <img src={ppt} alt="ppt" />
      if (file.type?.split("/")[0] === "image" && file.originFileObj)
        return <img src={window.URL.createObjectURL(file.originFileObj)} alt="img" />
      if (file.type?.split("/")[0] === "video")
        return <VideoClipRegular fontSize={32} />
      return <DocumentCheckmarkRegular fontSize={32} />
    },
    showUploadList: {
      showDownloadIcon: showDownload,
      showPreviewIcon: true,
      showRemoveIcon: showRemove,
      downloadIcon: <ArrowDownloadFilled fontSize={16} />,
      removeIcon: <DeleteRegular fontSize={16} />
    },
  };

  return (
    <>
      <Upload  {...props}> {children} </Upload>
      <Modal title={open?.name ?? "File"} open={!!open} onCancel={() => setOpen(undefined)} style={{ top: "10px" }} width={"100%"} >
        {
          !open?.url ? <LocalFileViewer document={open?.originFileObj ? window.URL.createObjectURL(open.originFileObj) : ""} />
          : <AllFileViewer file={open?.url ?? ""} />
        }

      </Modal>
    </>
  )
};

export default FileUploaderAndViewer;