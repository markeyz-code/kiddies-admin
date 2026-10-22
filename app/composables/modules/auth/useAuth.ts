import { ref } from 'vue';
import { authApi } from '@/api_factory/modules/auth';

export const useAuth = () => {
    const loading = ref(false);
    const user = ref<any>(null);

    const setCookie = (name: string, value: string, maxAgeDays: number) => {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=${value}; path=/; max-age=${maxAgeDays * 86400}; SameSite=Lax`;
        try { localStorage.setItem(name, value); } catch {}
    };

    const login = async (payload: any) => {
        loading.value = true;
        try {
            const { data } = await authApi.login(payload);
            if (!data?.accessToken || data?.user?.role !== 'admin') {
                throw new Error('This account does not have administrator access');
            }
            user.value = data.user;

            setCookie('adminAccessToken', data.accessToken, 7);
            if (data.refreshToken) {
                setCookie('adminRefreshToken', data.refreshToken, 30);
            }

            await navigateTo('/dashboard');
            return data;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Invalid credentials';
            const toast = useToast();
            toast.add({ title: 'Login Failed', description: message, color: 'error' });
            return null;
        } finally {
            loading.value = false;
        }
    };

    const fetchProfile = async () => {
        loading.value = true;
        try {
            const { data } = await authApi.getProfile();
            user.value = data;
            return data;
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const forgotPassword = async (payload: any) => {
        loading.value = true;
        try {
            const { data } = await authApi.forgotPassword(payload);
            const toast = useToast();
            toast.add({ title: 'Email Sent', description: data.message, color: 'success' });
            
            // For Demo only
            if (data.resetToken) {
                setTimeout(() => {
                    toast.add({ title: 'DEMO TOKEN', description: `Your token is: ${data.resetToken}`, color: 'info' });
                }, 1000);
            }
            return data;
        } catch (error: any) {
            const toast = useToast();
            toast.add({ title: 'Error', description: error?.response?.data?.message || 'Failed to request reset', color: 'error' });
        } finally {
            loading.value = false;
        }
    };

    const resetPassword = async (payload: any) => {
        loading.value = true;
        try {
            const { data } = await authApi.resetPassword(payload);
            const toast = useToast();
            toast.add({ title: 'Success', description: data.message, color: 'success' });
            window.location.href = '/login';
            return data;
        } catch (error: any) {
            const toast = useToast();
            toast.add({ title: 'Error', description: error?.response?.data?.message || 'Failed to reset password', color: 'error' });
        } finally {
            loading.value = false;
        }
    };

    const logout = async () => {
        try { await authApi.logout(); } catch {}
        if (typeof document !== 'undefined') {
            document.cookie = 'adminAccessToken=; Max-Age=0; path=/';
            document.cookie = 'adminRefreshToken=; Max-Age=0; path=/';
            try {
                localStorage.removeItem('adminAccessToken');
                localStorage.removeItem('adminRefreshToken');
            } catch {}
            await navigateTo('/login');
        }
    };

    return {
        loading,
        user,
        login,
        fetchProfile,
        forgotPassword,
        resetPassword,
        logout
    };
};
