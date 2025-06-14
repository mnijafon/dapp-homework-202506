// 通用类型定义

// 页面类型
export type PageType = 'chat';
// 后续扩展功能类型可以在这里添加：
// export type PageType = 'chat' | 'newFeature';

// 消息类型
export interface Message {
    id: string;
    sender: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

// 菜单项类型
export interface MenuItem {
    id: string;
    label: string;
    icon: any; // Lucide React 图标
}

// API响应类型
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// 通用组件Props类型
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

// 聊天组件相关类型
export interface ChatMessage extends Message {
    // 可以扩展更多聊天消息属性
}

export interface ChatComponentProps extends BaseComponentProps {
    // 聊天组件特定的props
}

// 后续扩展功能的类型定义示例：
//
// export interface NewFeatureProps extends BaseComponentProps {
//   // 新功能特定的props
// }
//
// export interface NewFeatureData {
//   // 新功能的数据结构
// }