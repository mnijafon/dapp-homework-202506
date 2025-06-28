import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// const root = ReactDOM.createRoot(
//     document.getElementById('app') as HTMLElement
// );
//
// root.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// );

const container = document.getElementById('app');
if (!container) {
    throw new Error('Failed to find the root element');
}
const root = createRoot(container);

root.render(
    /**
     * <React.StrictMode>
     * 只在开发环境生效（不会出现在打包后的生产代码中）
     * 只在开发环境生效（不会出现在打包后的生产代码中）
     * 会帮助你：
     * 检查潜在问题，比如副作用的重复调用
     * 警告不推荐使用的 API
     * 提前发现组件的意外行为
     * 推荐在开发时包住整个应用或关键组件树
     **/
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);