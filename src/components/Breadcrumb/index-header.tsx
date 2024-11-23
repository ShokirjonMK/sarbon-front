import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home16Regular } from '@fluentui/react-icons';

export type BreadcrumbArgumentsType = {
    arr: {
        name: string,
        path: string
    }[] | undefined,
}

const CustomBreadcrumbHeader: FC<BreadcrumbArgumentsType> = ({ arr }): JSX.Element => {

    const { t } = useTranslation();

    const path: any = (element: { name: string, path: string }) => element.path.startsWith('/') ? element.path : `/${element.path}`

    return (
        <div className="flex items-center text-[rgba(61,67,74,0.9)] font-medium text-sm">
            <Link to={'/'} className='text-[rgba(61,67,74,0.9)] font-medium text-sm hover:text-blue-700' >
                <Home16Regular />
            </Link>
            <span className="mx-1">/</span>
            {
                arr?.length && arr.map((element: { name: string, path: string }, index: number) => {
                    if (arr.length - 1 !== index) {
                        return (

                            <Link to={path(element)} className='text-[rgba(61,67,74,0.9)] font-medium text-sm no-underline hover:text-blue-700' >
                                {t(element.name)}
                                <span className="mx-1">/</span>
                            </Link>
                        )
                    } else {
                        return <span key={index} className='text-[rgba(61,67,74,0.9)] font-medium text-sm'>{t(element.name)}</span>
                    }
                })
            }
        </div>
    )
}
export default CustomBreadcrumbHeader;