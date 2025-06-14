import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Grid3X3, User } from 'lucide-react';
import AIChat from './components/AIChat';

// 页面类型定义
export type PageType = 'chat';

// 菜单项配置
const menuItems = [
    { id: 'chat', label: 'AI对话', icon: MessageCircle },
    // 后续扩展功能可以在这里添加，格式如下：
    // { id: 'newFeature', label: '新功能', icon: NewIcon },
];

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<PageType>('chat');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 检测屏幕尺寸
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // 渲染当前页面
    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'chat':
                return <AIChat />;
            // 后续扩展功能可以在这里添加，格式如下：
            // case 'newFeature':
            //   return <NewFeatureComponent />;
            default:
                return <AIChat />;
        }
    };

    // 切换页面
    const handlePageChange = (page: PageType) => {
        setCurrentPage(page);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* 侧边栏遮罩层 - 仅移动端 */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 侧边栏 */}
            <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* 侧边栏头部 */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Grid3X3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">DApp Hub</h1>
                                <p className="text-sm text-slate-500">去中心化应用</p>
                            </div>
                        </div>
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        )}
                    </div>
                </div>

                {/* 导航菜单 */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handlePageChange(item.id as PageType)}
                                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                                }
                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* 侧边栏底部 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
                    <div className="text-center text-sm text-slate-500">
                        <p>© 2024 DApp Hub</p>
                        <p className="mt-1">v1.0.0</p>
                    </div>
                </div>
            </div>

            {/* 主内容区域 */}
            <div className={`transition-all duration-300 ${!isMobile ? 'ml-64' : ''}`}>
                {/* 顶部导航栏 */}
                <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                {isMobile && (
                                    <button
                                        onClick={() => setSidebarOpen(true)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <Menu className="w-6 h-6 text-slate-600" />
                                    </button>
                                )}
                                <h2 className="text-xl font-semibold text-slate-800 capitalize">
                                    {menuItems.find(item => item.id === currentPage)?.label}
                                </h2>
                            </div>

                            {/* 右侧工具栏 */}
                            <div className="flex items-center space-x-4">
                                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-slate-600">在线</span>
                                </div>

                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 页面内容 */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {renderCurrentPage()}
                </main>
            </div>
        </div>
    );
};

export default App;