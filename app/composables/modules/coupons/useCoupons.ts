import { ref } from 'vue';
import { couponsApi } from '@/api_factory/modules/coupons';

export const useCoupons = () => {
    const toast = useToast();
    const loading = ref(false);
    const coupons = ref<any[]>([]);

    const fetchCoupons = async () => {
        loading.value = true;
        try {
            const { data } = await couponsApi.getCoupons();
            coupons.value = data;
        } catch (error: any) {
            toast.add({
                title: 'Error',
                description: error?.response?.data?.message || 'Failed to fetch coupons',
                color: 'red'
            });
        } finally {
            loading.value = false;
        }
    };

    const createCoupon = async (payload: any) => {
        loading.value = true;
        try {
            const { data } = await couponsApi.createCoupon(payload);
            coupons.value.unshift(data);
            toast.add({
                title: 'Success',
                description: 'Coupon created successfully',
                color: 'green'
            });
            return data;
        } catch (error: any) {
            toast.add({
                title: 'Error',
                description: error?.response?.data?.message || 'Failed to create coupon',
                color: 'red'
            });
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const deleteCoupon = async (id: string) => {
        loading.value = true;
        try {
            await couponsApi.deleteCoupon(id);
            coupons.value = coupons.value.filter(c => c._id !== id);
            toast.add({
                title: 'Success',
                description: 'Coupon deleted successfully',
                color: 'green'
            });
        } catch (error: any) {
            toast.add({
                title: 'Error',
                description: error?.response?.data?.message || 'Failed to delete coupon',
                color: 'red'
            });
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        coupons,
        fetchCoupons,
        createCoupon,
        deleteCoupon
    };
};
