import { useLoadingCallback } from '@/hooks/useLoadingCallback';
import { api } from '@/lib/api';

export type CreateProduct = Parameters<ReturnType<typeof api.admin.product.create.useMutation>['mutateAsync']>[0];
export type UpdateProduct = Parameters<ReturnType<typeof api.admin.product.update.useMutation>['mutateAsync']>[0];

export function useSaveProduct() {
  const apiContext = api.useContext();

  const create = api.admin.product.create.useMutation();
  const update = api.admin.product.update.useMutation();

  return useLoadingCallback(async (input: CreateProduct | UpdateProduct) => {
    const isEditing = 'id' in input;

    console.log('input', input)

    if (isEditing) {
      await update.mutateAsync(input);
      await apiContext.admin.product.detail.invalidate(input.id);
    } else {
      await create.mutateAsync(input);
    }

    await apiContext.admin.product.paginate.invalidate();
  }, [apiContext.admin.product.detail, apiContext.admin.product.paginate, create, update])
}