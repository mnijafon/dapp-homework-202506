import Header from '@components/common/Header';
import { memo } from 'react';
// Outlet 是 React Router 中的组件，用于渲染当前路由匹配的子组件。
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="mx-auto px-4">
        <Outlet />
      </main>
    </>
  );
};
// MainLayout.whyDidYouRender = true：这行代码被注释掉了，它原本用于调试组件重渲染的原因，启用后会在控制台打印重渲染的相关信息。
// MainLayout.whyDidYouRender = true;
// memo 是 React 提供的高阶组件，用于性能优化，防止不必要的重新渲染。
export default memo(MainLayout);
