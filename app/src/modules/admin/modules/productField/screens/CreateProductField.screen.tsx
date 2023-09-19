import React, { useCallback, useEffect, useState } from 'react';
import { NextPageWithLayout } from '@/lib/types';
import { AdminLayout } from '../../../layout';
import Translated from '@/components/Translated';

import { type ColumnDef } from "@tanstack/react-table"
import { FormattedMessage } from 'react-intl';
import { type Translation } from '@/models/translation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Upload from '@/components/ui/upload';
import { zodResolver } from '@hookform/resolvers/zod';
import Spinner from '@/components/ui/spinner';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/router';
import { Routes } from 'generated';
import { ModuleHeader, ModuleHeaderDescription, ModuleHeaderTitle } from '../../../components/module-header';
import { useGetProductFieldDetail } from '../actions/getProductFieldDetail';
import ProductFieldForm from '../components/ProductFieldForm';
import { useSaveProductField } from '../actions/saveProductField';
import { type EditAdminProductField } from '../models/productFIeld';

export interface CreateProductFieldProps {}

  const CreateProductField: React.FC<CreateProductFieldProps> = () => {
  const [saveProductField, { isLoading: isCreatingProduct }] = useSaveProductField();

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = useCallback(async (data: EditAdminProductField) => {
    await saveProductField(data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await router.replace(Routes.AdminProductFieldListPage());
    toast({
      title: 'Product field created',
    });
  }, [router, saveProductField, toast])

  return (
    <div>
      <ModuleHeader>
        <div>
          <ModuleHeaderTitle>
            <FormattedMessage id="admin.productFieldDetail.creating" defaultMessage="New product field" />
          </ModuleHeaderTitle>
        </div>
      </ModuleHeader>

      <div className="mt-4">
        <ProductFieldForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default CreateProductField