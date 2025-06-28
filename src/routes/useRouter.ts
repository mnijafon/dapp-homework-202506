// AI生成代码
// import { useState, useCallback } from 'react';
// import { DEFAULT_ROUTE, getRouteById } from './index';
// import { PageType } from './types';
//
// export interface UseRouterReturn {
//     currentPage: PageType;
//     navigate: (page: PageType) => void;
//     getCurrentRoute: () => import('./types').RouteConfig | undefined;
//     isCurrentPage: (page: PageType) => boolean;
// }
//
// /**
//  * 路由管理Hook
//  * 提供路由状态管理和导航功能
//  */
// export const useRouter = (initialPage: PageType = DEFAULT_ROUTE): UseRouterReturn => {
//     const [currentPage, setCurrentPage] = useState<PageType>(initialPage);
//
//     // 导航到指定页面
//     const navigate = useCallback((page: PageType) => {
//         setCurrentPage(page);
//     }, []);
//
//     // 获取当前路由配置
//     const getCurrentRoute = useCallback(() => {
//         return getRouteById(currentPage);
//     }, [currentPage]);
//
//     // 检查是否为当前页面
//     const isCurrentPage = useCallback((page: PageType) => {
//         return currentPage === page;
//     }, [currentPage]);
//
//     return {
//         currentPage,
//         navigate,
//         getCurrentRoute,
//         isCurrentPage
//     };
// };