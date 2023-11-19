/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useCallback, useEffect, useState } from 'react';
import { useGetProducts } from '../actions/getProducts';
import { NextPageWithLayout } from '@/lib/types';
import { AdminLayout } from '../../../layout';
import Translated from '@/components/Translated';

import { type ColumnDef } from "@tanstack/react-table"
import { type EditAdminProduct, editAdminProductSchema, type ListAdminProduct } from '../models/product';
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
import { useRouter } from 'next/router';
import { Routes } from 'generated';
import { ModuleHeader, ModuleHeaderDescription, ModuleHeaderTitle } from '../../../components/module-header';
import { useDeleteProduct } from '../actions/deleteProduct';

export interface ProductDetailScreenProps {
  productId: string;
}

  const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ productId }) => {
  const { data: productDetail } = useGetProductDetail(productId);
  const [saveProduct, { isLoading: isCreatingProduct }] = useSaveProduct();
  const [deleteProduct, { isLoading: isDeletingProduct }] = useDeleteProduct();

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = useCallback(async (data: EditAdminProduct) => {
    await saveProduct(data);
    toast({
      title: 'Product updated',
    });
  }, [saveProduct, toast])

  const onDelete = useCallback(async () => {
    await deleteProduct(productId);
    toast({
      title: 'Product deleted',
    });
    await router.replace(Routes.AdminProductsPage());
  }, [deleteProduct, productId, router, toast])

  if (!productDetail) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <ModuleHeader>
        <div>
          <ModuleHeaderTitle>Product</ModuleHeaderTitle>
          <ModuleHeaderDescription>
            <Translated t={productDetail.name} />
          </ModuleHeaderDescription>
        </div>
      </ModuleHeader>

      <Card className="mt-4">
        <CardContent className="pt-6">
          <ProductForm productDetail={productDetail} onSubmit={onSubmit} onDelete={onDelete} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductDetailScreen