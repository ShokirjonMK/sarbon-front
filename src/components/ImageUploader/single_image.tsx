import { Dispatch } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { CameraAddRegular, DismissCircle32Filled, EyeRegular } from '@fluentui/react-icons';

const SingleImageUploader = ({fileList, setFileList, istest}: {fileList: UploadFile[], setFileList: Dispatch<UploadFile[]>, istest?: boolean}) => {
    
    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
      if(newFileList.length){
          setFileList([{...newFileList[0], status: "success"}]);
      } else {
          setFileList(newFileList)
      }        
    };
  
    const onPreview = async (file: UploadFile) => {
      let src = file.url as string;
      file.status = "success"
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as RcFile);
          reader.onload = () => resolve(reader.result as string);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    };


    return (
      <div className='image-upload'>
        <ImgCrop rotationSlider >
            <Upload
                listType={istest ? "picture-card" : "picture-circle"}
                // listType="picture-circle"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                customRequest={(({onSuccess}: any)=> {onSuccess("ok")})}
                showUploadList={{
                    removeIcon: <DismissCircle32Filled className='absolute top-[100%] left-[90%] bg-[#fff] text-[#EB3737] rounded-full' style={{border: "2.4px solid #fff"}} />,
                    previewIcon: <EyeRegular className='text-[38px] text-white translate-x-3 translate-y-2' />
                }}
            >
                {fileList.length < 1 && <CameraAddRegular className='text-[48px] opacity-40' />}
            </Upload>
        </ImgCrop>
      </div>
    )
}
export default SingleImageUploader;