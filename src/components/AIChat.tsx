import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Trash2, RotateCcw } from 'lucide-react';
import { AIApiService } from '../services/api';

// 消息类型定义
type Message = {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
};

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: '你好！我是AI助手，有什么可以帮助你的吗？',
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // 生成唯一ID
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  // 处理用户提交消息
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || isThinking) return;

    const userMessage: Message = {
      id: generateId(),
      sender: 'user',
      content: userInput.trim(),
      timestamp: new Date(),
    };

    // 添加用户消息
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsThinking(true);

    try {
      // 调用AI API
      const response = await AIApiService.sendMessage(userMessage.content);

      const aiMessage: Message = {
        id: generateId(),
        sender: 'ai',
        content: response.success && response.data
            ? response.data
            : response.error || '抱歉，我现在无法回应。请稍后重试。',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI 请求失败：', error);

      const errorMessage: Message = {
        id: generateId(),
        sender: 'ai',
        content: '抱歉，服务器连接失败。请检查网络连接后重试。',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  // 复制消息内容
  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // 这里可以添加成功提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 清空聊天记录
  const clearChat = () => {
    setMessages([
      {
        id: generateId(),
        sender: 'ai',
        content: '聊天记录已清空。有什么新的问题吗？',
        timestamp: new Date(),
      },
    ]);
  };

  // 重新生成回答
  const regenerateResponse = async (messageIndex: number) => {
    if (messageIndex <= 0 || isThinking) return;

    const userMessage = messages[messageIndex - 1];
    if (userMessage.sender !== 'user') return;

    // 移除之前的AI回答
    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);
    setIsThinking(true);

    try {
      const response = await AIApiService.sendMessage(userMessage.content);

      const aiMessage: Message = {
        id: generateId(),
        sender: 'ai',
        content: response.success && response.data
            ? response.data
            : response.error || '抱歉，我现在无法回应。请稍后重试。',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('重新生成失败：', error);

      const errorMessage: Message = {
        id: generateId(),
        sender: 'ai',
        content: '重新生成失败，请稍后重试。',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
      <div className="max-w-6xl mx-auto">
        {/* 聊天容器 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 聊天头部 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI智能助手</h2>
                  <p className="text-blue-100 text-sm">在线 · 随时为您服务</p>
                </div>
              </div>

              <button
                  onClick={clearChat}
                  className="p-3 hover:bg-white/20 rounded-lg transition-all duration-200 group"
                  title="清空聊天"
              >
                <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* 聊天内容区域 */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
            {messages.map((msg, index) => (
                <div
                    key={msg.id}
                    className={`flex items-start space-x-4 ${
                        msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                >
                  {/* 头像 */}
                  <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md
                ${msg.sender === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-blue-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600'
                  }
              `}>
                    {msg.sender === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                    ) : (
                        <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* 消息内容 */}
                  <div className={`
                group max-w-[70%] relative
                ${msg.sender === 'user' ? 'text-right' : 'text-left'}
              `}>
                    <div className={`
                  p-4 rounded-2xl shadow-md backdrop-blur-sm
                  ${msg.sender === 'user'
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-br-md'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'
                    }
                `}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                      {/* 时间戳 */}
                      <div className={`
                    text-xs mt-2 opacity-70
                    ${msg.sender === 'user' ? 'text-white' : 'text-slate-500'}
                  `}>
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    {/* 消息操作按钮 */}
                    <div className={`
                  absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1
                  ${msg.sender === 'user' ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'}
                `}>
                      <button
                          onClick={() => copyMessage(msg.content)}
                          className="p-2 bg-white shadow-md rounded-lg hover:bg-slate-50 transition-colors"
                          title="复制"
                      >
                        <Copy className="w-4 h-4 text-slate-600" />
                      </button>

                      {msg.sender === 'ai' && (
                          <button
                              onClick={() => regenerateResponse(index)}
                              className="p-2 bg-white shadow-md rounded-lg hover:bg-slate-50 transition-colors"
                              title="重新生成"
                              disabled={isThinking}
                          >
                            <RotateCcw className="w-4 h-4 text-slate-600" />
                          </button>
                      )}
                    </div>
                  </div>
                </div>
            ))}

            {/* 正在思考状态 */}
            {isThinking && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-md shadow-md max-w-[70%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <p className="text-slate-500 text-sm mt-2">正在思考中...</p>
                  </div>
                </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="p-6 border-t border-slate-200 bg-white">
            <form onSubmit={handleSubmit} className="flex items-end space-x-4">
              <div className="flex-1">
                <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="输入您的问题..."
                    disabled={isThinking}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                  type="submit"
                  disabled={!userInput.trim() || isThinking}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white px-6 py-3 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* 输入提示 */}
            <div className="flex items-center justify-between mt-3 text-sm text-slate-500">
              <span>按 Enter 发送消息</span>
              <span>{userInput.length}/1000</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AIChat;