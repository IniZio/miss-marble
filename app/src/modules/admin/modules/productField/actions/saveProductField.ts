import { useLoadingCallback } from '@/hooks/useLoadingCallback';
import { api } from '@/lib/api';
import { EditAdminProductField } from '../models/productFIeld';

export function useSaveProductField() {
  const apiContext = api.useContext();

  const create = api.admin.productField.create.useMutation();
  const update = api.admin.productField.update.useMutation();

  return useLoadingCallback(async (input: EditAdminProductField) => {
    const isEditing = 'id' in input;

    if (isEditing) {
      await update.mutateAsync(input);
      apiContext.admin.productField.detail.invalidate(input.id);
    } else {
      await create.mutateAsync(input);
    }

    apiContext.admin.productField.paginate.invalidate();
    apiContext.admin.product.paginate.invalidate();
  }, [])
}