import { useLoadingCallback } from '@/hooks/useLoadingCallback';
import { api } from '@/lib/api';

export function useDeleteProduct() {
  const apiContext = api.useContext();
  const remove = api.admin.product.delete.useMutation();

  return useLoadingCallback(async (input: string) => {
    await remove.mutateAsync(input);

    await apiContext.admin.product.paginate.invalidate();
  }, [apiContext.admin.product.paginate, remove])
}