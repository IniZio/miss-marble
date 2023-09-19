import { useLoadingCallback } from '@/hooks/useLoadingCallback';
import { api } from '@/lib/api';
import { type EditAdminProductField } from '../models/productFIeld';

export function useSaveProductField() {
  const apiContext = api.useContext();

  const create = api.admin.productField.create.useMutation();
  const update = api.admin.productField.update.useMutation();

  return useLoadingCallback(async (input: EditAdminProductField) => {
    const isEditing = 'id' in input;

    if (isEditing) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      await update.mutateAsync(input as unknown as any);
      await apiContext.admin.productField.detail.invalidate(input.id);
    } else {
      await create.mutateAsync(input);
    }

    await apiContext.admin.productField.paginate.invalidate();
    await apiContext.admin.product.paginate.invalidate();
  }, [apiContext.admin.product.paginate, apiContext.admin.productField.detail, apiContext.admin.productField.paginate, create, update])
}