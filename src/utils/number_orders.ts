
export const number_order = (page:number, pageSize:number, index: number, loading: boolean) => {
    return !loading ? (pageSize * page + index - pageSize + 1) : "-"
}