import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Upload from '@/components/ui/upload';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { EditAdminProduct as EditAdminProduct, editAdminProductSchema } from '../models/product';
import { Button } from '@/components/ui/button';

export interface ProductFormProps {
  productDetail?: EditAdminProduct;
  isCreatingProduct?: boolean;
  onSubmit: (data: EditAdminProduct) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({ productDetail, onSubmit }) => {
  const form = useForm<EditAdminProduct>({
    resolver: zodResolver(editAdminProductSchema),
    defaultValues: productDetail ?? undefined,
  });

  const { isSubmitting, isSubmitSuccessful } = form.formState;
  useEffect(() => {
    if (isSubmitSuccessful) {
      form.reset(form.getValues());
    }
  }, [isSubmitting]);
  useEffect(() => {
    if (productDetail) {
      form.reset(productDetail);
    }
  }, [productDetail]);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <div className="sm:max-w-2xl space-y-6">
            <FormField
              control={form.control}
              name="name.text.zh_Hant_HK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="admin.productDetail.name.label" defaultMessage="Name" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gallery.0"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="admin.productDetail.image.label" defaultMessage="Image" />
                  </FormLabel>
                  <FormControl>
                    <Upload {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={!form.formState.isDirty} isLoading={isSubmitting}>
          <FormattedMessage id="admin.productDetail.save" defaultMessage="Save" />
        </Button>
      </form>
    </Form>
  );
}

export default ProductForm