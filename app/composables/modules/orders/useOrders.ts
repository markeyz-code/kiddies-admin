import { ref } from 'vue';
import { ordersApi } from '@/api_factory/modules/orders';

export const useOrders = () => {
    const loading = ref(false);
    const orders = ref([]);
    const analytics = ref<any>(null);

    const total = ref(0);
    const fetchOrders = async (params = {}) => {
        loading.value = true;
        try {
            const { data } = await ordersApi.getOrders(params);
            if (Array.isArray(data)) {
                orders.value = data;
                total.value = data.length;
            } else {
                orders.value = data.orders || [];
                total.value = data.total || 0;
            }
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            orders.value = [];
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
            const index = orders.value.findIndex((o: any) => o._id === id);
            if (index !== -1) orders.value[index] = data;
            return data;
        } catch (error: any) {
            console.error('Error updating order status:', error);
            throw error;
        }
    };

    const updatePaymentStatus = async (id: string, paymentStatus: string) => {
        try {
            const { data } = await ordersApi.updatePaymentStatus(id, paymentStatus);
            const index = orders.value.findIndex((o: any) => o._id === id);
            if (index !== -1) orders.value[index] = data;
            return data;
        } catch (error: any) {
            console.error('Error updating payment status:', error);
            throw error;
        }
    };

    return {
        loading,
        orders,
        analytics,
        total,
        fetchOrders,
        fetchAnalytics,
        updateOrderStatus,
        updatePaymentStatus
    };
};
