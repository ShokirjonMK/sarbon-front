import { useEffect, useState } from 'react'
import { Form, Spin, Transfer } from "antd";
import { useMutation } from "@tanstack/react-query";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import type { TransferDirection } from 'antd/es/transfer';
import checkPermission from 'utils/check_permission';
import { timetableStudentTransfer } from './request';
import { renderFullName } from 'utils/others_functions';
import { data_sort_by_letter } from 'utils/data_sort_by_letter';

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
  return 0;
};

const TimeTableStudentsTransfer = ({data, isLoading, refetch}: {data: any, isLoading: boolean, refetch: any}) => {

    const mockData: RecordType[] = data_sort_by_letter([...data?.data?.std, ...data?.data?.secondGroup?.std], "last_name", "profile")?.sort(sortStudent)?.map((item: any) => ({
        key: item?.student_id,
        type: item?.type,
        title: renderFullName(item?.profile)
    }))
    const initialTargetKeys = data_sort_by_letter(data?.data?.secondGroup?.std, "last_name", "profile")?.map((item: any) => (item?.student_id))

    const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [form] = Form.useForm();
    
    const { mutate, isLoading: submitLoading } = useMutation({
        mutationFn: (newVals: {student_ids: string[]}) => timetableStudentTransfer(data?.data?.ids, newVals?.student_ids),
        onSuccess: async (res) => {
          Notification("success", "update", res?.message);
          refetch();
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
      mutate({student_ids: moveKeys})
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
              disabled={!checkPermission('timetable_student-type')}
            />
          </div>
        </div>
      </Spin>
    )
}
export default TimeTableStudentsTransfer;