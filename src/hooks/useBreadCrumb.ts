import { useEffect } from 'react'
import { useAppDispatch } from 'store';
import { changePage } from 'store/ui';

function useBreadCrumb({pageTitle, breadcrumb}:{pageTitle: string, breadcrumb: Array<{name: string, path: string}>}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changePage({pageTitle, breadcrumb}))
  }, [])
}

export default useBreadCrumb