import { ref } from 'vue';
import { customersApi } from '@/api_factory/modules/customers';

export const useCustomers = () => {
    const loading = ref(false);
    const customers = ref([]);

    const fetchCustomers = async (params = {}) => {
        loading.value = true;
        try {
            const { data } = await customersApi.getCustomers(params);
            customers.value = data;
        } catch (error: any) {
            console.error('Error fetching customers:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        customers,
        fetchCustomers
    };
};
