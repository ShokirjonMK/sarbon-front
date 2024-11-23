import { Button, Card } from 'antd';
import { ISubjectContent, ISubjectContentTypes } from 'models/subject';
import React, { useState, useEffect, useRef } from 'react';
import StatusTag from 'components/StatusTag';
import { useTranslation } from 'react-i18next';
import { ChevronDownFilled, ChevronUpFilled, DeleteRegular, PenRegular } from '@fluentui/react-icons';
import { UpdateContentType } from '..';
import DeleteData from 'components/deleteData';
import checkPermission from 'utils/check_permission';
import AllFileViewer from 'components/FileViewer/AllFileViewer';

type ContentPropsType = {
  content: ISubjectContent,
  click: number | undefined,
  setClick: React.Dispatch<number | undefined>,
  addContent: (content: UpdateContentType | undefined) => void,
  changeOrder: ({ id, order }: { id: number, order: number }) => void,
  refetch: () => void,
  isLoading: boolean,
  up: boolean,
  down: boolean,
}

const Content: React.FC<ContentPropsType> = ({ content, click, setClick, addContent, refetch, changeOrder, isLoading, up, down }): JSX.Element => {
  const { t } = useTranslation();
  const content_ref = useRef<any>();
  const [move, setMove] = useState<"up" | "down">();

  useEffect(() => {
    if( click === content?.id ){
      _click();
    }
  }, [content]);


  console.log("content", !content?.file?.split(".")?.reverse()[0]?.includes("pdf") ? content?.description ?? "" : "");
  
  const _click = () => {
    content_ref.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  };

  return (
    <Card
      ref={content_ref}
      className={`relative p-0 cursor-pointer border-transparent hover:border-[#ebebeb] ${click === content?.id ? "shadow-md" : "sadow-0"}`}
      bodyStyle={{ padding: 0 }}
      headStyle={{ padding: 0 }}
      type="inner"
      title={
        click === content?.id ? <>
          <div onClick={() => { addContent(undefined); setClick(content?.id); _click(); }} className="flex-between flex-wrap px-2">
            <StatusTag status={content?.status} />
            <div className="text-[13px] pt-2">
              {content?.createdBy ?
                <div><span className='font-samibold text-gray-400'>{t("Kiritilgan")}:</span>&nbsp;<span>{content?.createdBy?.last_name}&nbsp;{content?.createdBy?.first_name}</span></div>
                : ''}
              {content?.updatedBy ?
                <div><span className='font-samibold text-gray-400'>{t("Yangilangan")}:</span>&nbsp;<span>{content?.updatedBy?.last_name}&nbsp;{content?.updatedBy?.first_name}</span></div>
                : ''}
            </div>
          </div>
          {/* <Divider className='mt-2' /> */}
        </> : null
      }
    >
      {click === content?.id ? <div className='absolute z-50 -top-5 box-border right-2 bg rounded-md border-solid border border-gray-200' >
        <div className='flex-center py-1 px-2' >
          {checkPermission("subject-content_update") ? <>
            <Button className='rounded-md me-2 flex-center' size='small' disabled={up} loading={isLoading && move === "up"} icon={<ChevronUpFilled fontSize={20} />} onClick={() => { changeOrder({ id: content?.id, order: content?.order - 1 }); setMove("up") }} ></Button>
            <Button className='rounded-md me-2 flex-center' size='small' disabled={down} loading={isLoading && move === "down"} icon={<ChevronDownFilled fontSize={20} />} onClick={() => { changeOrder({ id: content?.id, order: content?.order + 1 }); setMove("down") }} ></Button>
            <Button type='primary' ghost className='rounded-md me-2 flex-center' size='small' onClick={() => { addContent({ id: content?.id, order: content?.order, type: content?.types ?? {} as ISubjectContentTypes, content: content }) }} icon={<PenRegular fontSize={18} />} ></Button>
          </> : null}
          <DeleteData permission='subject-content_delete' id={content?.id} url='subject-contents' refetch={refetch} ><Button className='rounded-md flex-center' size='small' danger icon={<DeleteRegular fontSize={18} />} ></Button></DeleteData>
        </div>
      </div> : null}
      <div className='p-3' onClick={() => { addContent(undefined); setClick(content?.id); _click(); }}>
        <div>
          {
            content?.type === 1 ?
              <div dangerouslySetInnerHTML={{ __html: content?.text ?? "" }} />
              : <div>
                <AllFileViewer file={content?.file ?? ""}  description={ !content?.file?.split(".")?.reverse()[0]?.includes("pdf") ? content?.description ?? "" : ""} />
                {content?.description && (content?.types?.type !== "FILE" || (content?.types?.type === "FILE" && content?.file?.split(".")?.reverse()[0]?.includes("pdf"))) ? <div className="    mt-3">
                  <span className='font-samibold text-gray-400'>{t("Description")}:</span>&nbsp;
                  <span>{content?.description}</span>
                </div> : null}
              </div>
          }
        </div>
      </div>
    </Card>
  );
};

export default Content;