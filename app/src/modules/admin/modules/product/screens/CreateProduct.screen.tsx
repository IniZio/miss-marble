import React, { useCallback, useEffect, useState } from 'react';
import { useGetProducts } from '../actions/getProducts';
import { NextPageWithLayout } from '@/lib/types';
import { AdminLayout } from '../../../layout';
import Translated from '@/components/Translated';

import { type ColumnDef } from "@tanstack/react-table"
import { EditAdminProduct, editAdminProductSchema, type ListAdminProduct } from '../models/product';
import { DataTable } from '../components/DataTable';
import { FormattedMessage } from 'react-intl';
import { type Translation } from '@/models/translation';
import Image from 'next/image';
import { useGetProductDetail } from '../actions/getProductDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Upload from '@/components/ui/upload';
import { useSaveProduct } from '../actions/saveProduct';
import { zodResolver } from '@hookform/resolvers/zod';
import Spinner from '@/components/ui/spinner';
import { z } from 'zod';
import ProductForm from '../components/ProductForm';
import { useToast } from '@/components/ui/use-toast';
import { ModuleHeader, ModuleHeaderActions, ModuleHeaderTitle } from '../../../components/module-header';

export interface ProductDetailScreenProps {
}

const CreateProductScreen: React.FC<ProductDetailScreenProps> = () => {
  const { toast } = useToast();
  const [saveProduct, { isLoading: isCreatingProduct }] = useSaveProduct();

  const onSubmit = useCallback(async (data: EditAdminProduct) => {
    await saveProduct(data);
    toast({
      title: 'Product created',
    });
  }, [])

  return (
    <div>
      <ModuleHeader>
        <ModuleHeaderTitle>
          <FormattedMessage id="admin.productDetail.creating" defaultMessage="New product" />
        </ModuleHeaderTitle>
      </ModuleHeader>

      <div className="mt-4">
        <ProductForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default CreateProductScreen