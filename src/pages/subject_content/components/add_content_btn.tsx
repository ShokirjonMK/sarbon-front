import { AddCircleRegular, DocumentRegular, ImageRegular, ListRegular, MoviesAndTvRegular, MusicNote2Regular, TextCaseTitleFilled } from '@fluentui/react-icons';
import { Button, Divider } from 'antd';
import React, {  } from 'react';
import { UpdateContentType } from '..';
import { useTranslation } from 'react-i18next';
import { ISubjectContentTypes } from 'models/subject';
import checkPermission from 'utils/check_permission';

// export const types = ["text", "image", "audio", "video", "file"];

type AddContentBtnPropstype = {
  types: ISubjectContentTypes[] | undefined,
  addContent: (content: UpdateContentType) => void,
  order: number,
  visible?: boolean,
  notDivider?: boolean,
  orientation?: "left" | "center" | "right"
}

const AddContentBtn: React.FC<AddContentBtnPropstype> = ({ addContent, order, types, visible, notDivider, orientation = "center" }): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="add-content-btn-wrapper" style={{ margin: checkPermission("subject-content_create") ? 0 : "0.25rem 0" }} >
      {checkPermission("subject-content_create") ?
      notDivider ?
        <Button type='link' className="d-f add-content-btn">
          <AddCircleRegular fontSize={16} /> &nbsp; {t("Add content")} &nbsp;
          <div className="type-btn-wrapp">
            {
              types?.map((e, i) => (
                <Button
                  size='small'
                  key={i}
                  onClick={() => addContent({ id: 0, order, type: e })}
                  className="ms-2 capitalize type-btn"
                >
                  <div className="d-f">
                    {e?.type === "AUDIO" ? <MusicNote2Regular fontSize={15} />
                      : e?.type === "TEXT" ? <ListRegular fontSize={15} />
                        : e?.type === "VIDEO" ? <MoviesAndTvRegular fontSize={15} />
                          : e?.type === "IMAGE" ? <ImageRegular fontSize={15} />
                            : <DocumentRegular fontSize={15} />}
                    &nbsp; {t(e?.type)}
                  </div>
                </Button>
              ))
            }
          </div>
        </Button>
      : <Divider orientation={orientation} orientationMargin={0} style={{ margin: 0 }} className={`divider m-0 p-0 ${visible ? "opacity-100" : "opacity-0"}`} >
        <Button type='link' className="d-f add-content-btn">
          <AddCircleRegular fontSize={16} /> &nbsp; {t("Add content")} &nbsp;
          <div className="type-btn-wrapp">
            {
              types?.map((e, i) => (
                <Button
                  size='small'
                  key={i}
                  onClick={() => addContent({ id: 0, order, type: e })}
                  className="ms-2 capitalize type-btn"
                >
                  <div className="d-f">
                    {e?.type === "AUDIO" ? <MusicNote2Regular fontSize={15} />
                      : e?.type === "TEXT" ? <TextCaseTitleFilled fontSize={15} />
                        : e?.type === "VIDEO" ? <MoviesAndTvRegular fontSize={15} />
                          : e?.type === "IMAGE" ? <ImageRegular fontSize={15} />
                            : <DocumentRegular fontSize={15} />}
                    &nbsp; {t(e?.type)}
                  </div>
                </Button>
              ))
            }
          </div>
        </Button>
      </Divider> : null}
    </div>
  );
};

export default AddContentBtn;