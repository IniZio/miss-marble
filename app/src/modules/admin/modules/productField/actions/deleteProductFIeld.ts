import { useLoadingCallback } from '@/hooks/useLoadingCallback';
import { api } from '@/lib/api';

export function useDeleteProductField() {
  const apiContext = api.useContext();
  const remove = api.admin.productField.delete.useMutation();

  return useLoadingCallback(async (input: string) => {
    await remove.mutateAsync(input);

    await apiContext.admin.productField.paginate.invalidate();
  }, [apiContext.admin.productField.paginate, remove])
}