import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Upload from '@/components/ui/upload';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { type EditAdminProductField, type GetAdminProductFieldDetail, editAdminProductFieldSchema } from '../models/productFIeld';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductFieldType } from '@/models/admin/productField';
import { X } from 'lucide-react';

export interface ProductFieldFormProps {
  productFieldDetail?: GetAdminProductFieldDetail;
  isCreatingProduct?: boolean;
  onSubmit: (data: EditAdminProductField) => Promise<void>;
}

const ProductFieldForm: React.FC<ProductFieldFormProps> = ({ productFieldDetail, onSubmit }) => {
  const form = useForm<EditAdminProductField>({
    resolver: zodResolver(editAdminProductFieldSchema),
    defaultValues: productFieldDetail ?? undefined,
  });

  const fieldType = form.watch('type');
  const fieldOptionsFieldArray = useFieldArray({
    control: form.control,
    name: 'fieldOptions',
  });

  const { isSubmitting, isSubmitSuccessful } = form.formState;
  useEffect(() => {
    if (isSubmitSuccessful) {
      form.reset(form.getValues());
    }
  }, [form, isSubmitSuccessful, isSubmitting]);
  useEffect(() => {
    if (productFieldDetail) {
      form.reset(productFieldDetail);
    }
  }, [form, productFieldDetail]);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <div className="sm:max-w-2xl space-y-6">
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="name.text.zh_Hant_HK"
                rules={{ required: true }}
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
                name="alias"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="admin.productDetail.alias.label" defaultMessage="Alias" />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="type"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="admin.productDetail.type.label" defaultMessage="Type" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ProductFieldType.Asset}>Upload</SelectItem>
                    <SelectItem value={ProductFieldType.Checkboxes}>Checkboxes</SelectItem>
                    <SelectItem value={ProductFieldType.Select}>Select</SelectItem>
                    <SelectItem value={ProductFieldType.Text}>Text</SelectItem>
                  </SelectContent>
                </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {[ProductFieldType.Select, ProductFieldType.Checkboxes].includes(fieldType) && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <FormLabel>
                      <FormattedMessage id="admin.productDetail.options.label" defaultMessage="Options" />
                    </FormLabel>
                  </div>
                  <div>
                    <Button type="button" onClick={() => fieldOptionsFieldArray.append({ name: { text: { zh_Hant_HK: '' } } })}>
                      <FormattedMessage id="admin.productDetail.options.add" defaultMessage="Add" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {fieldOptionsFieldArray.fields.map((field, index) => (
                    <div className="flex gap-x-2" key={field.id}>
                      <FormField
                        control={form.control}
                        name={`fieldOptions.${index}.name.text.zh_Hant_HK`}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-end">
                        <Button type="button" variant="ghost" onClick={() => fieldOptionsFieldArray.remove(index)}>
                          <X />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Button type="submit" disabled={!form.formState.isDirty} isLoading={isSubmitting}>
          <FormattedMessage id="admin.productDetail.save" defaultMessage="Save" />
        </Button>
      </form>
    </Form>
  );
}

export default ProductFieldForm