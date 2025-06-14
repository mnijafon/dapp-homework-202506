// API响应类型定义
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// API配置
export const API_CONFIG = {
    // 主要API端点
    AI_CHAT_ENDPOINT: 'https://cloudflare-work.liujifeng8106.workers.dev',

    // 其他可能的端点
    USER_ENDPOINT: '/api/user',
    SETTINGS_ENDPOINT: '/api/settings',

    // 请求超时时间
    TIMEOUT: 30000,

    // 请求重试次数
    RETRY_COUNT: 3,
};

// HTTP方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 请求选项接口
interface RequestOptions {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
    retries?: number;
}

// 通用API请求类
class ApiService {
    private baseURL: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseURL: string = '') {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    // 设置认证token（为将来的身份验证准备）
    setAuthToken(token: string) {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // 移除认证token
    removeAuthToken() {
        delete this.defaultHeaders['Authorization'];
    }

    // 通用请求方法
    private async request<T>(
        url: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        const {
            method = 'GET',
            headers = {},
            body,
            timeout = API_CONFIG.TIMEOUT,
            retries = API_CONFIG.RETRY_COUNT
        } = options;

        const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

        const requestOptions: RequestInit = {
            method,
            headers: {
                ...this.defaultHeaders,
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        // 实现重试逻辑
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                const response = await fetch(fullUrl, {
                    ...requestOptions,
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                }

                // 尝试解析JSON响应
                let data: T;
                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    // 如果不是JSON，尝试作为文本处理
                    data = await response.text() as unknown as T;
                }

                return {
                    success: true,
                    data,
                };

            } catch (error) {
                console.error(`API请求失败 (尝试 ${attempt + 1}/${retries + 1}):`, error);

                if (attempt === retries) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : '未知错误',
                    };
                }

                // 等待一段时间后重试
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            }
        }

        return {
            success: false,
            error: '请求失败',
        };
    }

    // GET请求
    async get<T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(url, { method: 'GET', headers });
    }

    // POST请求
    async post<T>(
        url: string,
        data?: any,
        headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(url, { method: 'POST', body: data, headers });
    }

    // PUT请求
    async put<T>(
        url: string,
        data?: any,
        headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(url, { method: 'PUT', body: data, headers });
    }

    // DELETE请求
    async delete<T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(url, { method: 'DELETE', headers });
    }

    // PATCH请求
    async patch<T>(
        url: string,
        data?: any,
        headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(url, { method: 'PATCH', body: data, headers });
    }
}

// 创建默认的API服务实例
const apiService = new ApiService();

// AI聊天专用API
export class AIApiService {
    // 发送聊天消息
    static async sendMessage(prompt: string): Promise<ApiResponse<string>> {
        try {
            const response = await apiService.post<string>(
                API_CONFIG.AI_CHAT_ENDPOINT,
                { prompt }
            );

            return response;
        } catch (error) {
            console.error('AI聊天请求失败:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : '聊天请求失败',
            };
        }
    }

    // 获取聊天历史（为将来功能预留）
    static async getChatHistory(): Promise<ApiResponse<any[]>> {
        // 这里可以添加获取聊天历史的逻辑
        return {
            success: true,
            data: [],
        };
    }
}

// 用户API服务（为将来功能预留）
export class UserApiService {
    // 获取用户信息
    static async getUserProfile(): Promise<ApiResponse<any>> {
        return apiService.get(API_CONFIG.USER_ENDPOINT);
    }

    // 更新用户信息
    static async updateUserProfile(data: any): Promise<ApiResponse<any>> {
        return apiService.put(API_CONFIG.USER_ENDPOINT, data);
    }
}

// 设置API服务（为将来功能预留）
export class SettingsApiService {
    // 获取设置
    static async getSettings(): Promise<ApiResponse<any>> {
        return apiService.get(API_CONFIG.SETTINGS_ENDPOINT);
    }

    // 更新设置
    static async updateSettings(data: any): Promise<ApiResponse<any>> {
        return apiService.put(API_CONFIG.SETTINGS_ENDPOINT, data);
    }
}

// 导出所有服务
export {
    ApiService,
    apiService,
};