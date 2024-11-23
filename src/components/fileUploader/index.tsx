import { Dispatch } from 'react';
import type { UploadFile, UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { AttachFilled } from '@fluentui/react-icons';
import { t } from 'i18next';

const props: UploadProps = {
  name: 'file',
  customRequest: ({onSuccess}: any)=> {onSuccess("ok")},

  onChange(info) {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      info.file.status = 'done';
      message.error(`${info.file.name} file upload failed.`);
    }
  },

};

const FileUploader = ({passportFile, setPassportFile, title = "Click to Upload", accept='application/pdf, image/jpeg, image/png, image/svg', maxCount=1, onRemove}: {passportFile: UploadFile[], setPassportFile: Dispatch<UploadFile[]>, title: string, accept?:string, maxCount?:number, onRemove?: any}) => (

  <Upload 
    {...props} 
    maxCount={maxCount}
    fileList={passportFile} 
    onChange={(e) => setPassportFile(e.fileList?.map(i => ({...i, status: "done"})))} 
    accept={accept} 
    onRemove={onRemove ? onRemove : (e) => console.log(e)}
  >
    <Button icon={<AttachFilled className='text-[18px] mr-2' />} className='items-center flex'>{t(title)}</Button>
  </Upload>

);

export default FileUploader;