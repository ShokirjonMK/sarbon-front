import React from "react";
import { Pagination } from "antd";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { useTranslation } from "react-i18next";

type TypeCustomPaginationProps = {
  totalCount?: number | undefined;
  currentPage?: number | undefined;
  perPage?: number | undefined;
  isAll?: boolean;
  showQuickJumper?: boolean;
  showSizeChanger?: boolean
};

const pageSizeOptions = ["10", "15", "20", "30", "50", "100"];

const CustomPagination: React.FC<TypeCustomPaginationProps> = React.memo(
  ({
    totalCount = 0,
    currentPage = 1,
    perPage = 15,
    isAll = false,
    showSizeChanger = true,
    showQuickJumper = true

  }): JSX.Element => {
    const { urlValue: value, writeToUrl } = useUrlQueryParams({});
    const {t} = useTranslation()

    return (
      <div className="table_footer bg p-3">
        {/* <Tag color="#F2F2F2" style={{ color: "#494d52" }} className="px-3 h-[30px] flex-center text-[15px]"> */}
          {t("Total")}: &nbsp; {totalCount}
        {/* </Tag> */}
        <Pagination
          total={totalCount}
          current={currentPage ?? value.currentPage}
          defaultPageSize={perPage ?? value.perPage}
          onChange={(e) => {
            writeToUrl({ name: "currentPage", value: e });
          }}
          onShowSizeChange={(e, pageSize) => {
            writeToUrl({ name: "perPage", value: pageSize });
          }}
          showSizeChanger={showSizeChanger}
          showQuickJumper={showQuickJumper}
          pageSizeOptions={
            isAll ? [...pageSizeOptions, "all"] : pageSizeOptions
          }
        />
      </div>
    );
  }
);

export default CustomPagination;
