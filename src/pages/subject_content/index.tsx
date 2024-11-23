import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import AddContentBtn from './components/add_content_btn';
import useGetAllData from 'hooks/useGetAllData';
import { useParams } from 'react-router-dom';
import { ISubjectContent, ISubjectContentTypes, ISubjectTopic } from 'models/subject';
import useGetOneData from 'hooks/useGetOneData';
import "./style.scss";
import Content from './components/content';
import ContentForm from './components/content_form';
import { Spin } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { requesrData } from './request';
import { DocumentRegular, ImageRegular, MoviesAndTvRegular, MusicNote2Regular, TextCaseTitleFilled } from '@fluentui/react-icons';

export type ContentType = "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "FILE";

export type UpdateContentType = {
  id: number,
  order: number,
  type: ISubjectContentTypes,
  content?: ISubjectContent
}

const SubjectContent: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { subject_id, topic_id, teacher_id } = useParams();
  const [updateContent, setUpdateContent] = useState<UpdateContentType>()
  const [clickContent, setClickContent] = useState<number>();
  const [types, setTypes] = useState<any>([]);
  const [active_type, setActiveType] = useState<number>(0);

  const ref = useRef<any>(null);
  const head_ref = useRef<any>(null);
  const contents_ref = useRef<any>(null);

  const { data: topic } = useGetOneData<ISubjectTopic>({
    queryKey: ["subject-topics", topic_id],
    url: `/subject-topics/${topic_id}`,
  })

  const { } = useGetOneData<ISubjectContentTypes>({
    queryKey: ["content-types"],
    url: "/subject-contents/types",
    urlParams: { "per-page": 0 },
    options: {
      onSuccess: (res) => {
        setTypes(res);
      }
    }

  })

  const { data: _contents, isFetching, refetch } = useGetAllData<ISubjectContent>({
    queryKey: ["subject-contents", topic_id, teacher_id],
    url: "/subject-contents?sort=order&expand=types,updatedBy,createdBy",
    urlParams: {
      "per-page": 0,
      filter: { "subject_topic_id": Number(topic_id), "teacher_access_id": Number(teacher_id)}
    }
  });

  useEffect(() => {
    if (contents_ref.current) {
      // contents_ref.current.style.height = `${window.innerHeight - head_ref?.current?.offsetHeight - 60}px`;
    }

  }, [_contents?.items]);

  useEffect(() => {
    if (clickContent) {
      setTimeout(() => {
        // contents_ref.current.scroll({ top: Number(contents_ref.current.scrollLeft) - 200, left: 0, behavior: 'smooth' });
      }, 1000);
    }
  }, [clickContent]);

  const findOrder = (index: number, last?: boolean): number => {
    if (last) {
      return (contents?.find((e, i) => i === (contents?.length - 1))?.order ?? 0) + 1;
    }
    return contents?.find((e, i) => i === index)?.order ?? 1;
  }

  const addContent = (content: UpdateContentType | undefined) => {
    setUpdateContent(content);
    setClickContent(undefined);
  }

  const changeOrder = (data: { id: number, order: number, edit?: boolean }) => {
    if (updateContent) {
      if (data.edit && (data.id === updateContent?.id)) {
        if (data?.id) {
          _changeOrder(data);
        }
        setUpdateContent({ ...updateContent, order: data.order });
      } else {
        setUpdateContent(undefined);
        _changeOrder(data);
      }
    } else {
      _changeOrder(data);
    }
  }

  const { mutate: _changeOrder, isLoading } = useMutation({
    mutationFn: ({ id, order }: { id: number, order: number }) => requesrData(id, {}, order),
    onSuccess: () => {
      refetch();
    }
  });

  const contents = useMemo(() => {
    if (active_type === 0) return _contents?.items
    return _contents?.items?.filter(e => e.type === active_type);
  }, [_contents?.items, active_type])

  const types_tab = useMemo(() => {
    const arr: any = [{ label: "All", value: 0, }];
    types?.forEach((e: ISubjectContentTypes) => {
      arr.push({
        label: e?.type,
        value: e?.id,
        icon: e?.type === "AUDIO" ? <MusicNote2Regular />
          : e?.type === "TEXT" ? <TextCaseTitleFilled />
            : e?.type === "VIDEO" ? <MoviesAndTvRegular />
              : e?.type === "IMAGE" ? <ImageRegular />
                : <DocumentRegular />
      })
    })
    return arr
  }, [types])

  return (
    <div className="relative" ref={ref} >
        <HeaderExtraLayout title={topic?.data?.name ?? t("Subject contents")} isBack
          breadCrumbData={[
            { name: "Home", path: '/' },
            { name: "Subjects", path: 'subjects' },
            { name: "Subject topic", path: `subjects/view/${subject_id}?user-block=topic-info` },
            { name: "Subject contents", path: 'subject_content' }
          ]}
          className='sticky- top-0 w-full z-20'
        />
      <div className="head-content bg sticky top-[-1px] z-50" ref={head_ref} >
          <AddContentBtn types={types} addContent={addContent} order={1} visible={true} notDivider={true} />
      </div>
      {/* <Segmented options={types_tab} value={active_type} onChange={(e) => setActiveType(Number(e))} /> */}
      <Spin spinning={isFetching}>
        <div className="p-3  overflow-y-auto-" ref={contents_ref} >
          <div className='max-w-[980px] mx-auto' >
          {
            contents?.map((content, i) => {
              if (updateContent) {
                if (updateContent.id === content?.id) {
                  return <div key={i}>
                    {/* update */}
                    <ContentForm
                      id={updateContent.id}
                      order={findOrder(i)}
                      type={updateContent.type}
                      content={content}
                      addContent={addContent}
                      changeOrder={changeOrder}
                      refetch={refetch}
                      isLoading={isLoading}
                      up={i === 0}
                      down={i === contents?.length - 1}
                    />
                    <AddContentBtn types={types} addContent={addContent} order={i === contents?.length - 1 ? findOrder(0, true) : findOrder(i + 1)} />
                  </div>
                }
                if (!updateContent.id && updateContent.order === findOrder(i)) {
                  return <div key={i}>
                    {/* create */}
                    <ContentForm
                      id={0}
                      order={findOrder(i)}
                      type={updateContent.type}
                      content={undefined}
                      addContent={addContent}
                      changeOrder={changeOrder}
                      refetch={refetch}
                      isLoading={isLoading}
                      up={i === 0}
                      down={i === contents?.length}
                    />
                    <AddContentBtn types={types} addContent={addContent} order={findOrder(i)} />

                    <Content
                      content={content}
                      click={clickContent}
                      setClick={setClickContent}
                      addContent={addContent}
                      refetch={refetch}
                      changeOrder={changeOrder}
                      isLoading={isLoading}
                      up={i === 0}
                      down={i === contents?.length - 1}
                    />
                    <AddContentBtn types={types} addContent={addContent} order={i === contents?.length - 1 ? findOrder(0, true) : findOrder(i + 1)} />
                  </div>
                }
              }

              return <div key={i}>
                {/* view */}
                <Content
                  content={content}
                  click={clickContent}
                  addContent={addContent}
                  setClick={setClickContent}
                  refetch={refetch}
                  changeOrder={changeOrder}
                  isLoading={isLoading}
                  up={i === 0}
                  down={i === contents?.length - 1}
                />

                <AddContentBtn types={types} addContent={addContent} order={i === contents?.length - 1 ? findOrder(0, true) : findOrder(i + 1)} />
              </div>
            })
          }

          {
            updateContent && !updateContent?.id && updateContent?.order === (findOrder(0, true)) ? <div>
              {/* alone */}
              <ContentForm
                id={0}
                order={updateContent?.order}
                type={updateContent.type}
                content={undefined}
                addContent={addContent}
                changeOrder={changeOrder}
                refetch={refetch}
                isLoading={isLoading}
                up={!contents?.length}
                down={true}
              />

              <AddContentBtn types={types} addContent={addContent} order={updateContent?.order} />
            </div> : null
          }

          </div>

        </div>
      </Spin>

    </div>
  );
};

export default SubjectContent;


/**
  * subject-content_index
  * subject-content_delete
  * subject-content_update
  * subject-content_view
*/

// subjects/5/topics/49/contents