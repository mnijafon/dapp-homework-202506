import { Link, useLocation } from 'react-router-dom';
import { Wallet, Home, MessageCircle } from 'lucide-react';
import { useConnect } from '@/hooks/useConnect';

const Header = () => {
  const { isWalletConnected, account, connectWallet, disconnectWallet } = useConnect();
  const location = useLocation();

  const handleConnectWallet = () => {
    if (isWalletConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  // 判断当前路由是否活跃
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* 左侧 Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 hover:text-gray-900">
              www.yidengfe.com
            </Link>
          </div>

          {/* 中间导航 */}
          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className={`
                flex items-center transition-colors
                ${
                  isActiveRoute('/')
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Home className="w-5 h-5 mr-1" />
              <span>首页</span>
            </Link>
            <Link
              to="/0614"
              className={`
                flex items-center transition-colors
                ${
                  isActiveRoute('/0614')
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Wallet className="w-5 h-5 mr-1" />
              <span>0614</span>
            </Link>
            <Link
                to="/chat"
                className={`
                flex items-center transition-colors
                ${
                    isActiveRoute('/chat')
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <MessageCircle className="w-5 h-5 mr-1" />
              <span>chat</span>
            </Link>
          </nav>

          {/* 右侧钱包连接按钮 */}
          <div className="flex items-center">
            <button
              onClick={handleConnectWallet}
              className={`
                flex items-center px-4 py-2 rounded-lg
                transition-colors duration-200
                ${
                  isWalletConnected
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              <Wallet className="w-5 h-5 mr-2" />
              <span>{isWalletConnected ? '已连接钱包' : '连接钱包'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
