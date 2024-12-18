import { ColumnsType } from "antd/es/table";
import { Col, Popover, Row, Table } from "antd"
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import CustomPagination from "components/Pagination";
import useGetAllData from "hooks/useGetAllData";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IExamType, ISubject, ISubjectCategory } from "models/subject";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import Actions from "components/Actions";
import { useTranslation } from "react-i18next";
import StatusTag from "components/StatusTag";
import checkPermission from "utils/check_permission";
import { number_order } from "utils/number_orders";
import { CreateBtn, ExcelBtn } from "components/Buttons";
import SearchInput from "components/SearchInput";
import { globalConstants } from "config/constants";
import instance from "config/_axios";
import { excelExport } from "utils/excelExport";
import useWindowSize from "hooks/useWindowSize";
import useBreadCrumb from "hooks/useBreadCrumb";
import UpdateSubjectNew from "./crud/update_new";

const selectData: TypeFilterSelect[] = [
  {
    name: "kafedra_id",
    label: "Kafedra",
    url: "kafedras",
    permission: "kafedra_index",
  },
  {
    name: "semestr_id",
    label: "Semestr",
    url: "semestrs",
    permission: "semestr_index",
  },
];

const Subjects: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [id, setId] = useState<number | undefined>();
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [allData, setAllData] = useState<ISubject[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { width } = useWindowSize();

  useBreadCrumb({pageTitle: "Subjects", breadcrumb: [
    {name: "Home", path: '/'},
    {name: "Subjects", path: '/subjects'},
  ]})

  const { data, isLoading, refetch } = useGetAllData<ISubject>({
    queryKey: ["subjects", urlValue.currentPage, urlValue.perPage, searchVal, urlValue.filter],
    url: `subjects?sort=-id&expand=description,topicsCount,semestr,subjectType,language,parent,parent.eduForm,parent.semestr,kafedra,eduForm,eduSemestrExamsTypes,eduSemestrSubjectCategoryTimes${urlValue.q ? "&query=" + searchVal : ""}${urlValue.filter ? "&filter=" + JSON.stringify(urlValue.filter) : ""}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage },
    options: {
      onSuccess: (res) => {
        setAllData(res.items)
      }
    }
  });

  const { data: subjectCategories } = useGetAllData<ISubjectCategory>({
    queryKey: ["subject-categories"],
    url: `subject-categories`,
    urlParams: { "per-page": 0 },
  });

  const { data: examTypes } = useGetAllData<IExamType>({
    queryKey: ["exams-types"],
    url: `exams-types`,
    urlParams: { "per-page": 0 },
  });

  const subjectCategoryTime = React.useMemo(() => {
    const arr: ColumnsType<any> = [];

    subjectCategories?.items?.forEach(e => {
      if (e?.status) {
        arr.push({
          title: e?.name,
          width: 90,
          key: `subject_category_${e?.id}`,
          align: "center",
          render: (index, item: ISubject) => item?.edu_semestr_subject_category_times ? <>{JSON.parse(item?.edu_semestr_subject_category_times)[e?.id]}</> : null,
        })
      }
    })
    examTypes?.items?.forEach(e => {
      if (e?.status) {
        arr.push({
          title: e?.name,
          width: 90,
          key: `exam_type_${e?.id}`,
          align: "center",
          render: (index, item: ISubject) => item?.edu_semestr_exams_types ? <>{JSON.parse(item?.edu_semestr_exams_types)[e?.id]}</> : null,
        })
      }
    })
    return arr
  }, [subjectCategories?.items, examTypes?.items]);

  const subjectCategoryTimeForExcel = (time: string) => {
    let obj = {};

    subjectCategories?.items?.forEach(e => {
      if (e?.status) {
        obj = {
          ...obj,
          [`${e?.name}`]: time[e?.id]
        }
      }
    })
    return obj
  }

  const exportExcel = async () => {
    const arr: any = [];

    setLoading(true);

    const res = await instance({
      method: "get",
      url: `subjects?expand=kafedra,parent,semestr,eduForm,eduSemestrSubjectCategoryTimes,eduSemestrExamsTypes`,
      params: { "per-page": 0, filter: { "kafedra_id": urlValue?.filter?.kafedra_id, semestr_id: urlValue?.filter?.semestr_id } }
    });

    res.data.data.items?.forEach((element: any) => {
      const time = JSON.parse(element?.edu_semestr_subject_category_times ?? '{}');

      arr.push({
        ["Nomi"]: element?.name,
        ["Ta'lim shakli"]: element?.eduForm?.name,
        ["Semestr"]: element?.semestr?.name,
        ["Kafedra"]: element?.kafedra?.name,
        ['Parent']: element?.parent?.name,
        ['Credit']: element?.credit,
        ...subjectCategoryTimeForExcel(time),
        ["Holati"]: element?.status ? "Faol" : "Faol emas",
      })
    })

    excelExport(arr, `Fanlar ro'yxati`);
    setLoading(false);
  }

  const columns: ColumnsType<ISubject> = React.useMemo(
    () => [
      {
        title: "№",
        dataIndex: "order",
        render: (_, __, i: number) =>
          number_order(
            urlValue.currentPage,
            urlValue.perPage,
            i,
            isLoading
          ),
        width: 45,
        fixed: "left",
      },
      {
        title: t("Name"),
        render: (e: any) =>
          checkPermission("subject_view") ? (
            <Link
              to={`/subjects/view/${e?.id}`}
              className="text-black hover:text-[#0a3180] underline cursor-pointer max-md:text-xs"
            >{e?.name} <span className="text-blue-900 font-bold"> - {e?.eduForm?.name}</span></Link>
          ) : (<span className="max-md:text-xs">{e?.name} <span className="text-blue-900 font-bold"> - {e?.eduForm?.name}</span></span>),
        fixed: "left",
        width: width > 756 ? 240 : 130,
      },
      {
        title: t("Semestr"),
        render: (e: any) => <span>{e?.semestr?.name}</span>,
        width: 100,
      },
      {
        title: t("Kafedra"),
        render: (e: any) => <span>{e?.kafedra?.name}</span>,
        width: 180,
      },
      {
        title: t("Credit"),
        render: (e: any) => <span>{e?.credit}</span>,
        width: 90,
      },
      {
        title: t("Parent"),
        render: (e: any) => <Popover content={<div>
          <p><span className="text-black opacity-50">{t("Semestr")}:</span>&nbsp;&nbsp;{e?.parent?.semestr?.name}</p>
          <p><span className="text-black opacity-50">{t("Edu form")}:</span>&nbsp;&nbsp;{e?.parent?.eduForm?.name}</p>
        </div>} title={e?.parent?.name}>
          <span>{e?.parent?.name}</span>
        </Popover>,
        width: 180,
      },
      {
        title: t("Subject type"),
        render: (e: any) => <span>{e?.subjectType?.name}</span>,
        width: 100,
      },
      ...subjectCategoryTime,
      width > 756 ?
      {
        title: t("Mavzular soni"),
        render: (e: any) => <p>{e?.topicsCount}</p>,
        align: "center",
        width: 90,
        fixed: "right",
      }
      :{
        title: t("Mavzular soni"),
        render: (e: any) => <p>{e?.topicsCount}</p>,
        align: "center",
        width: 90,
      },
      width > 756 ?
      {
        title: t("Status"),
        render: (e: any) => <StatusTag status={e?.status} />,
        align: "center",
        width: 90,
        fixed: "right",
      }
      :{
        title: t("Status"),
        render: (e: any) => <StatusTag status={e?.status} />,
        align: "center",
        width: 90,
      },
      width > 756 ?
      {
        title: t("Actions"),
        dataIndex: "actions",
        width: 170,
        align: "center",
        render: (i, e: any) => (
          <Actions
            id={e?.id}
            url={"subjects"}
            onClickEdit={() => navigate(`/subjects/update/${e?.id}`)}
            onClickView={() => navigate(`/subjects/view/${e?.id}`)}
            refetch={refetch}
            viewPermission={"subject_view"}
            editPermission={"subject_update"}
            deletePermission={"subject_delete"}
          />
        ),
        fixed: "right",
      }
      :{
        title: t("Actions"),
        dataIndex: "actions",
        width: 170,
        align: "center",
        render: (i, e: any) => (
          <Actions
            id={e?.id}
            url={"subjects"}
            onClickEdit={() => navigate(`/subjects/update/${e?.id}`)}
            onClickView={() => navigate(`/subjects/view/${e?.id}`)}
            refetch={refetch}
            viewPermission={"subject_view"}
            editPermission={"subject_update"}
            deletePermission={"subject_delete"}
          />
        ),
      },
    ],
    [data?.items, subjectCategories?.items, examTypes?.items]
  );

  return (
    <>
      <div className="content-card" >
        <div className="d-f gap-3 justify-end mb-2" >
          <ExcelBtn onClick={exportExcel} loading={loading} />
          <Link to={"/subjects/create"} style={{textDecoration:"none"}}><CreateBtn onClick={() => navigate("/subjects/create")} permission={"subject_create"}/></Link>
        </div>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            <SearchInput setSearchVal={setSearchVal} duration={globalConstants.debounsDuration} width={"full"} />
          </Col>
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
              span={{ xs: 24, sm: 12, md: 8, lg: 6, xl: 4 }}
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


        <UpdateSubjectNew
          id={1}
          isOpenForm={isOpenForm}
          setisOpenForm={setisOpenForm}
          setId={setId}
          refetch={refetch}
        />

        {(data?._meta?.totalCount ?? 0) > 10 ? (
          <CustomPagination
            totalCount={data?._meta.totalCount}
            currentPage={urlValue.currentPage}
            perPage={urlValue.perPage}
          />
        ) : undefined}
      </div>
    </>
  );
};

export default Subjects;
