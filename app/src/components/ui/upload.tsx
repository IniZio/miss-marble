import React, { useCallback, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Input, type InputProps } from '@/components/ui/input';
import { getSupabase } from '@/clients/supabase';
import { api } from '@/lib/api';
import { PUBLIC_STORAGE_BUCKET_NAME } from '@/constants';
import { type AssetUpload } from '@/models/asset';
import { type UseControllerProps, useController, type FieldValues, type FieldPath, type ControllerRenderProps } from 'react-hook-form';
import { useLoadingCallback } from '@/hooks/useLoadingCallback';
import Spinner from './spinner';

export type UploadProps = Omit<InputProps, 'value' | 'onChange'> & {
  value?: AssetUpload | null;
  onChange: (value?: AssetUpload | null) => void;
}

const Upload = React.forwardRef<HTMLInputElement, UploadProps>((props, ref) => {
  const presignUpload = api.asset.presignUpload.useMutation();
  const [handleChange, { isLoading }] = useLoadingCallback(async (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files![0]!;
    const { presignedUpload, asset } = await presignUpload.mutateAsync({ mimeType: file.type })
    await getSupabase().storage.from(PUBLIC_STORAGE_BUCKET_NAME).uploadToSignedUrl(
      presignedUpload.path,
      presignedUpload.token,
      file
    );

    props.onChange(asset);
  }, [presignUpload, props]);

  return (
    <div className="flex items-center gap-x-4">
      {isLoading ? <Spinner /> : (
        props.value?.url && <Image alt="product" src={props.value?.url} height={64} width={64} />
      )}
      <Input type="file" ref={ref} onChange={handleChange} />
    </div>
  );
});

Upload.displayName = 'Upload';

export default Upload