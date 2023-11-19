import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Upload from '@/components/ui/upload';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { type EditAdminProduct as EditAdminProduct, type GetAdminProductDetail, editAdminProductSchema } from '../models/product';
import { Button } from '@/components/ui/button';
import { useGetProductFields } from '../../productField/actions/getProductFields';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductFieldType } from '@/models/product';
import Translated from '@/components/Translated';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { productDetailSchema } from '@/modules/product/models/productDetail';

export interface ProductFormProps {
  productDetail?: GetAdminProductDetail;
  isCreatingProduct?: boolean;
  onSubmit: (data: EditAdminProduct) => Promise<void>;
  onDelete?: () => void;
}

const mapper = productDetailSchema.transform(product => ({
  ...product,
  gallery: product.image ? [product.image] : [],
  fields: product.fields.map(field => ({
    fieldId: field.id,
    required: field.required,
  })),
}));

const ProductForm: React.FC<ProductFormProps> = ({ productDetail, onDelete, onSubmit }) => {
  const { data: productFieldPage } = useGetProductFields({ pageIndex: 0, pageSize: 1000 });

  const form = useForm<EditAdminProduct>({
    resolver: zodResolver(editAdminProductSchema),
    defaultValues: productDetail ? mapper.parse(productDetail) : undefined,
  });

  const { isSubmitting, isSubmitSuccessful } = form.formState;
  useEffect(() => {
    if (isSubmitSuccessful) {
      form.reset(form.getValues());
    }
  }, [form, isSubmitSuccessful, isSubmitting]);
  useEffect(() => {
    if (productDetail) {
      form.reset(mapper.parse(productDetail));
    }
  }, [form, productDetail]);

  const fieldToProductFieldArray = useFieldArray({
    control: form.control,
    name: 'fields',
  });

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
            <Separator />
            <div className="mt-6  flex items-center">
              <h3 className="flex-1 font-semibold leading-none tracking-tight">
                  <FormattedMessage id="admin.productDetail.fields.label" defaultMessage="Fields" />
              </h3>
              <div>
                <Button type="button" onClick={() => fieldToProductFieldArray.append({ fieldId: '', required: false })}>
                  <FormattedMessage id="admin.productDetail.options.add" defaultMessage="Add" />
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {fieldToProductFieldArray.fields.map((field, index) => (
                <div key={field.id} className="flex gap-x-2">
                  <FormField
                    control={form.control}
                    name={`fields.${index}.fieldId`}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productFieldPage?.items?.map((productField) => (
                              <SelectItem key={productField.id} value={productField.id}>
                                <Translated t={productField.name} />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`fields.${index}.required`}
                    defaultValue={false}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <span className="text-sm !-mt-0.5">
                          Required?
                        </span>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-end">
                    <Button type="button" variant="ghost" onClick={() => fieldToProductFieldArray.remove(index)}>
                      <X />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex sm:max-w-2xl">
          <Button type="submit" disabled={!form.formState.isDirty} isLoading={isSubmitting}>
            <FormattedMessage id="admin.productDetail.save" defaultMessage="Save" />
          </Button>

          <div className="flex-1"></div>

          {onDelete && (
            <Button type="button" variant="destructive" onClick={onDelete}>
              <FormattedMessage id="admin.productDetail.delete" defaultMessage="Delete" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

export default ProductForm