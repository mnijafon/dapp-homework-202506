// AI生成代码
// import React from 'react';
//
// // 页面类型定义
// export type PageType = 'chat' | '0614' | '0615';
//
// // 路由配置接口
// export interface RouteConfig {
//     id: PageType;
//     label: string;
//     icon: React.ComponentType<any>;
//     component: React.ComponentType<any>;
//     path?: string;
//     meta?: {
//         title?: string;
//         description?: string;
//         requireAuth?: boolean;
//         [key: string]: any;
//     };
// }
//
// // 菜单项接口
// export interface MenuItem {
//     id: PageType;
//     label: string;
//     icon: React.ComponentType<any>;
// }
//
// // 路由导航参数
// export interface NavigationOptions {
//     replace?: boolean;
//     state?: any;
// }
//
// // 路由匹配结果
// export interface RouteMatch {
//     route: RouteConfig;
//     params: Record<string, string>;
// }