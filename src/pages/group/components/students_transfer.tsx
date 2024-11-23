import { useEffect, useState } from 'react'
import { Form, Spin, Transfer } from "antd";
import { useMutation } from "@tanstack/react-query";
import { studentTransfer } from "../crud/request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { useParams } from "react-router-dom";
import type { TransferDirection } from 'antd/es/transfer';
import checkPermission from 'utils/check_permission';

interface RecordType {
    key: string;
    title: string;
    type: number;
}

const sortStudent = (a: any, b: any) => {
  const nameA = a?.user?.last_name?.toUpperCase(); // ignore upper and lowercase
  const nameB = b?.user?.last_name?.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

const GroupStudentsTransfer = ({data, isLoading, refetch}: {data: any, isLoading: boolean, refetch: any}) => {

    const mockData: RecordType[] = data?.data?.student?.sort(sortStudent)?.map((item: any) => ({
        key: item?.id,
        type: item?.type,
        title: `${item?.user?.last_name} ${item?.user?.first_name} ${item?.user?.middle_name}`
    }))
    const initialTargetKeys = mockData?.filter((item) => item?.type == 2).map((item) => item?.key);

    const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const {id: group_id} = useParams()
    const [form] = Form.useForm();

    const { mutate, isLoading: submitLoading } = useMutation({
        mutationFn: (newVals: {type: number, student_ids: string[]}) => studentTransfer(group_id, newVals?.type, newVals?.student_ids),
        onSuccess: async (res) => {
          Notification("success", "create", res?.message)
        },
        onError: (error: AxiosError) => {
          validationErrors(form, error?.response?.data)
        },
        retry: 0,
    });


    useEffect(() => {
      setTargetKeys(initialTargetKeys)
    }, [isLoading])

    const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
      setTargetKeys(nextTargetKeys);
      mutate({type: direction == 'left' ? 1 : 2, student_ids: moveKeys})
    };

    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
      setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    return(
        <Spin spinning={isLoading || submitLoading} size="small">
            <div>
                <div className="px-[24px]">
                    <Transfer
                        listStyle={{width: '50%', height: "60vh"}}
                        dataSource={mockData}
                        titles={['1 - guruh', '2 - guruh']}
                        targetKeys={targetKeys}
                        selectedKeys={selectedKeys}
                        onChange={onChange}
                        onSelectChange={onSelectChange}
                        render={(item) => item?.title}
                        disabled={!checkPermission('student_type')}
                    />

                </div>
            </div>
        </Spin>
    )
}
export default GroupStudentsTransfer;