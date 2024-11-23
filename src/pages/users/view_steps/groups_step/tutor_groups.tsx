import { Button, Checkbox, Col, Drawer, FormInstance, Row, Table } from "antd";
import { useTranslation } from "react-i18next";
import { DeleteFilled } from "@fluentui/react-icons";
import dayjs from "dayjs";
import { number_order } from "utils/number_orders";
import { ColumnsType } from "antd/es/table";
import DeleteData from "components/deleteData";
import { Link, useParams } from "react-router-dom";
import { FILE_URL } from "config/utils";
import { globalConstants } from "config/constants";
import { useEffect, useState } from "react";
import useGetAllData from "hooks/useGetAllData";
import { IGroup } from "models/education";
import CustomPagination from "components/Pagination";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import SearchInput from "components/SearchInput";
import FilterSelect from "components/FilterSelect";
import { useMutation } from "@tanstack/react-query";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { submitGroups } from "./request";
import checkPermission from "utils/check_permission";

const TutorGroupsView = ({data, refetch} : {data: any, refetch: any}) => {

    const { t } = useTranslation();
    const { user_id } = useParams();
    const [isOpen, setisOpen] = useState<boolean>(false);
    const [searchVal, setSearchVal] = useState<string>("");
    const [selectedGroups, setselectedGroups] = useState<{[key: string]: boolean}>();

    const { urlValue } = useUrlQueryParams({
      currentPage: 1,
      perPage: 10,
    });
  
    const columns : ColumnsType<any> = [
      {
        title: t("№"),
        dataIndex: "name",
        width: 45,
        render: (_, __, i) => number_order(1, 100, Number(i), false),
      },
      {
        title: t("Group"),
        dataIndex: "unical_name",
        render: (_, __) => <p className="text-neutral-950 underline">{_}</p>,
      },
      {
        title: t("Faculty"),
        dataIndex: "faculty",
        render: (_) => _?.name,
      },
      {
        title: t("Edu plan"),
        dataIndex: "eduPlan",
        render: (_) => _?.name,
      },
    ];

    useEffect(() => {
      if(data?.tutorGroups?.length){
        for (const item of data?.tutorGroups) {
          setselectedGroups(p => ({...p, [item?.id]: true}))
        }
      }
    }, [data?.tutorGroups?.length])

    const { data: groupData, isLoading } = useGetAllData<IGroup>({
      queryKey: ["groups",urlValue.perPage,urlValue.currentPage, searchVal, urlValue?.filter?.faculty_id,urlValue?.filter?.direction_id,urlValue?.filter?.edu_plan_id,],
      url: `groups?sort=-id&expand=faculty,lang`,
      urlParams: {"per-page": urlValue.perPage,page: urlValue.currentPage, query: searchVal, filter: JSON.stringify(urlValue.filter)},
      options: {
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: isOpen
      },
    });
    
    const saveMutation = useMutation({
      mutationFn: () => submitGroups(user_id, selectedGroups),
      onSuccess: async (res) => {
        if (res?.status === 1) {
          Notification("success", "update", res?.message);
          refetch()
          setisOpen(false)
        } else {
          Notification("error", "update", res?.message);
        }
      },
      onError: (error: AxiosError<any>) => {
        Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      },
      retry: 0,
  });


    return (
        <div className="px-[24px] pt-[15px] pb-[10px]">
          <div className="flex justify-between items-center mb-[12px]">
            <p className="font-medium text-[16px]">{t("Groups")}</p>
            {checkPermission("student_tutor") ? <Button onClick={() => setisOpen(true)} type="primary">Guruh biriktirish</Button> : ""}
          </div>
          <Table
              columns={columns}
              dataSource={data?.tutorGroups}
              showHeader={true}
              pagination={false}
          />


          <Drawer
            title={"Guruhlar"}
            placement="right"
            closable={false}
            open={isOpen}
            onClose={() => setisOpen(false)}
            width={globalConstants.antdDrawerWidth}
            headerStyle={{ backgroundColor: "#F7F7F7" }}
          >
            <Row>
              <Col span={24}>
                  <FilterSelect
                    url={"faculties"}
                    name={"faculty_id"}
                    label={"Faculty"}
                    permission={'faculty_index'}
                    span={24}
                  />
              </Col>
            </Row>

            <SearchInput className="my-4" duration={globalConstants.debounsDuration} setSearchVal={setSearchVal} />


            <div className="">
              {
                groupData?.items?.map((i, index) => (
                  <Checkbox key={i?.id} checked={selectedGroups ? selectedGroups[i.id] : false} onChange={(e) => setselectedGroups(prev => ({...prev, [i.id]: e.target.checked}))} className="flex bg-slate-50 rounded-md p-2 mb-3" style={{border: "1px solid #d9d9d9", marginInlineStart: "0"}}>
                    <p>{i?.unical_name}</p>
                  </Checkbox>
                ))
              }
            </div>

            <CustomPagination
              showSizeChanger={false}
              showQuickJumper={false}
              isAll={false}
              totalCount={groupData?._meta.totalCount}
              currentPage={urlValue.currentPage}
              perPage={urlValue.perPage}
            />
            <div className="flex justify-end mt-5">
              <Button className='mx-3' onClick={() => setisOpen(false)}>{t('Cancel')}</Button>
              <Button type="primary" loading={isLoading} onClick={() => saveMutation.mutate()}>{t("Submit")}</Button>
            </div>
          </Drawer>
        </div>
    )
}
export default TutorGroupsView;