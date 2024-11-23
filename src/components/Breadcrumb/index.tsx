import { FC } from 'react';
import { Breadcrumb } from 'antd';
import {ArrowLeft16Filled} from '@fluentui/react-icons'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export type BreadcrumbArgumentsType = {
    arr: {
        name: string,
        path: string
    }[] | undefined,
    isGoBack?: boolean,
}

const CustomBreadcrumb: FC<BreadcrumbArgumentsType> = ({ arr, isGoBack= false }): JSX.Element => {
    const { t } = useTranslation();
    const path: any = (element: { name: string, path: string }) => element.path.startsWith('/') ? element.path : `/${element.path}`

    return (
        <>
            <div className="d-f">
                {isGoBack ? <Link to={".."}><ArrowLeft16Filled className="cursor-pointer me-2 transi ease-out duration-300 hover:text-blue-500" onClick={() => {}} /></Link> : null}
                <Breadcrumb>
                    {
                        arr?.length && arr.map((element: { name: string, path: string }, index: number) => {
                            if (arr.length - 1 !== index) {
                                return (
                                    <Breadcrumb.Item key={index} className="cursor-pointer "><Link to={path(element)} >{t(element.name)}</Link></Breadcrumb.Item>
                                )
                            } else {
                                return <Breadcrumb.Item key={index} className=''>{t(element.name)}</Breadcrumb.Item>
                            }
                        })
                    }
                </Breadcrumb>
            </div>
        </>
    )
}


export default CustomBreadcrumb;