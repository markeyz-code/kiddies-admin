import { ref } from 'vue';
import { productsApi } from '@/api_factory/modules/products';

export const useProducts = () => {
    const loading = ref(false);
    const creating = ref(false);
    const products = ref<any[]>([]);

    const fetchProducts = async (params = {}) => {
        loading.value = true;
        try {
            const { data } = await productsApi.getProducts(params);
            products.value = data.products || data;
            return data;
        } catch (error: any) {
            console.error('Failed to fetch products', error);
            return [];
        } finally {
            loading.value = false;
        }
    };

    const createProduct = async (payload: any) => {
        creating.value = true;
        try {
            const { data } = await productsApi.createProduct(payload);
            await fetchProducts(); // refresh list
            return data;
        } catch (error: any) {
            console.error('Failed to create product', error);
            throw error;
        } finally {
            creating.value = false;
        }
    };

    return {
        loading,
        creating,
        products,
        fetchProducts,
        createProduct
    };
};
