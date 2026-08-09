import { ref } from 'vue';
import { ordersApi } from '@/api_factory/modules/orders';

export const useOrders = () => {
    const loading = ref(false);
    const orders = ref([]);
    const analytics = ref<any>(null);

    const fetchOrders = async (params = {}) => {
        loading.value = true;
        try {
            const { data } = await ordersApi.getOrders(params);
            orders.value = data;
        } catch (error: any) {
            console.error('Error fetching orders:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchAnalytics = async () => {
        loading.value = true;
        try {
            const { data } = await ordersApi.getOrderAnalytics();
            analytics.value = data;
        } catch (error: any) {
            console.error('Error fetching analytics:', error);
        } finally {
            loading.value = false;
        }
    };

    const updateOrderStatus = async (id: string, status: string) => {
        try {
            const { data } = await ordersApi.updateOrderStatus(id, status);
            return data;
        } catch (error: any) {
            console.error('Error updating order status:', error);
            throw error;
        }
    };

    return {
        loading,
        orders,
        analytics,
        fetchOrders,
        fetchAnalytics,
        updateOrderStatus
    };
};
