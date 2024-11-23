import React, {useState} from "react";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import { useTranslation } from "react-i18next";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { useNavigate } from "react-router-dom";
import useGetAllData from "hooks/useGetAllData";
import SearchInputWithoutIcon from "components/SearchInput/searchInputWithoutIcon";
import { globalConstants } from "config/constants";
import checkPermission from "utils/check_permission";
import { IStudent } from "models/student";
import { number_order } from "utils/number_orders";
import Table, { ColumnsType } from "antd/es/table";
import { Row, message } from "antd";
import CustomPagination from "components/Pagination";
import { ExcelBtn } from "components/Buttons";
import instance from "config/_axios";
import { excelExport } from "utils/excelExport";

const selectData: TypeFilterSelect[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names: ["edu_plan_id"],
    span: { xl: 8 }
  },
  {
    name: "edu_plan_id",
    label: "Edu plan",
    url: "edu-plans",
    permission: "edu-plan_index",
    parent_name: "faculty_id",
    span: { xl: 8 }
  },
  {
    name: "group_id",
    label: "Group",
    url: "groups",
    permission: "group_index",
    render: (e) => e?.unical_name,
    parent_name: "edu_plan_id",
    span: { xl: 8 },
  },
]


const StudentStatistics : React.FC = () : JSX.Element => {
  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const [first_name, setfirst_name] = useState<string>("");
  const [last_name, setlast_name] = useState<string>("");
  const [middle_name, setmiddle_name] = useState<string>("");

  const { data, isLoading } = useGetAllData({
    queryKey: [urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, ...(Object.values(urlValue?.filter) ?? []), first_name, last_name, middle_name],
    url: `students?sort=-id&expand=user,direction,course,group,studentAttendsCount,studentAttendReasonCount&filter=${JSON.stringify(urlValue.filter)}&filter-like=${JSON.stringify({ first_name, last_name, middle_name })}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id"},
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  });

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      width: 45,
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-id" ? "id" : "-id" }); return 0 },
      children: [
        {
          render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
        }
      ]
    },
    {
      title: t('Last name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-last_name" ? "last_name" : "-last_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setlast_name} duration={globalConstants.debounsDuration} filterKey="last_name" placeholder={`${t("Search by last name")}...`} />,
          render: (e) =>
            checkPermission("student_view") ? (
              <span
                onClick={() => navigate(`/students/view/${e?.id}`)}
                className="hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.last_name} </span>
            ) : (<span>{e?.user?.last_name}</span>),
        }
      ]
    },
    {
      title: t('First name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-first_name" ? "first_name" : "-first_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setfirst_name} duration={globalConstants.debounsDuration} filterKey="first_name" placeholder={`${t("Search by name")}...`} />,
          render: (e: IStudent) =>
            checkPermission("student_view") ? (
              <span
                onClick={() => navigate(`/students/view/${e?.id}`)}
                className="hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.first_name} </span>
            ) : (<span>{e?.user?.first_name}</span>),
        }
      ]
    },
    {
      title: t('Middle name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-middle_name" ? "middle_name" : "-middle_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setmiddle_name} duration={globalConstants.debounsDuration} filterKey="middle_name" placeholder={`${t("Search by middle name")}...`} />,
          render: (e) =>
            checkPermission("student_view") ? (
              <span
                onClick={() => navigate(`/students/view/${e?.id}`)}
                className="hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.middle_name} </span>
            ) : (<span>{e?.user?.middle_name}</span>),

        }
      ]
    },
    {
      title: t("Direction"),
      key: "direction",
      render: (e) => <span>{e?.direction?.name}</span>
    },
    {
      title: t("Course"),
      key: "course",
      render: (e) => <span>{e?.course?.name}</span>
    },
    {
      title: t("Group"),
      key: "group",
      render: (e) => <span>{e?.group?.unical_name}</span>
    },
    {
      title: t("Reasonably(hour)"),
      key: "attend",
      render: (e) => <span>{Number(e?.studentAttendReasonCount)*2}</span>
    },
    {
      title: t("Without reason(hour)"),
      key: "attend",
      render: (e) => <span>{(Number(e?.studentAttendsCount)-Number(e?.studentAttendReasonCount))*2}</span>
    },
    {
      title: t("Total(hour)"),
      key: "attend",
      render: (e) => <span>{Number(e?.studentAttendsCount)*2}</span>
    },
  ], [data?.items]);

  const exportExcel = async () => {
    const arr: any = [];

    if (urlValue?.filter?.faculty_id) {

      setLoading(true);
  
      const res = await instance({
        method: "get",
        url: `students?expand=user,direction,course,group,studentAttendReasonCount,studentAttendsCount`,
        params: { "per-page": 0, filter: urlValue?.filter }
      });
  
      res.data.data.items?.forEach((element: any) => {
        arr.push({
          ["Ism"]: element?.user?.first_name,
          ["Familiya"]: element?.user?.last_name,
          ["Otasining ismi"]: element?.user?.middle_name,
          ["Yo'nalish"]: element?.direction?.name,
          ['Kurs']: element?.course?.name,
          ['Guruh']: element?.group?.unical_name,
          ['Sababli(soat)']: element?.studentAttendReasonCount*2,
          ['Sababsiz(soat)']: (element?.studentAttendsCount-element?.studentAttendReasonCount)*2,
          ['Jami(soat)']: element?.studentAttendsCount*2,
        })
      })
  
      setLoading(false);
      excelExport(arr, `Talabalar davomat ro'yxati`);
    } else {
      message.warning("Fakultetni tanlang!!!")
    }

  }


  return(
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Students attend statistic", path: "" },
        ]}
        title={'Students attend statistic'}
        btn={
          <div>
            <ExcelBtn onClick={exportExcel} loading={loading} />
          </div>
        }
      />
      <div className="p-3">
        <Row gutter={[12, 12]}>
          {selectData?.map((e, i) => (
            <FilterSelect
              key={i}
              url={e.url}
              name={e.name}
              label={e.label}
              permission={e.permission}
              parent_name={e?.parent_name}
              child_names={e?.child_names}
              value_name={e?.value_name}
              render={e?.render}
            />
          ))}
        </Row>
            
        <Table
          columns={columns}
          dataSource={data?.items.length ? data?.items : allData}
          pagination={false}
          loading={isLoading}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={{ x: 576 }}
        />
        {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>
    </>
  )
}

export default StudentStatistics