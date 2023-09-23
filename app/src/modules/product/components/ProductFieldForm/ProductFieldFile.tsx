import React, { useCallback, type ChangeEvent } from 'react';
import { type ProductDetailField } from '../../models/productDetail';
import { Input } from '@/components/ui/input';
import { getSupabase } from '@/clients/supabase';
import { api } from '@/lib/api';
import { PUBLIC_STORAGE_BUCKET_NAME } from '@/constants';
import { type AssetUpload } from '@/models/asset';

export interface ProductFieldFileProps {
  field: ProductDetailField;
  value?: AssetUpload;
  onChange: (value: AssetUpload) => void;
}

const ProductFieldFile: React.FC<ProductFieldFileProps> = ({ field, onChange }) => {
  const presignUpload = api.asset.presignUpload.useMutation();

  const handleChange = useCallback(async (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files![0]!;
    const { presignedUpload, asset } = await presignUpload.mutateAsync({ mimeType: file.type })
    await getSupabase().storage.from(PUBLIC_STORAGE_BUCKET_NAME).uploadToSignedUrl(
      presignedUpload.path,
      presignedUpload.token,
      file
    );

    onChange(asset);
  }, [onChange, presignUpload]);

  return (
    <Input type="file" name={field.id} onChange={handleChange} />
  );
}

export default ProductFieldFile