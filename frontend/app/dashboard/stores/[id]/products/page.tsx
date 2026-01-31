'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { productApi } from '@/lib/api/product';
import { storeApi } from '@/lib/api/store';
import { Product } from '@/lib/types';

export default function ProductsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const storeId = params.id as string;

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Product | null>(null);

  // Fetch store
  const { data: store } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeApi.getOne(storeId),
  });

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', storeId],
    queryFn: () => productApi.getAll(storeId),
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', storeId] });
      queryClient.invalidateQueries({ queryKey: ['store', storeId] });
      setShowDeleteConfirm(null);
    },
  });

  // Bulk update status mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: ({ productIds, status }: { productIds: string[]; status: string }) =>
      productApi.bulkUpdateStatus(productIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', storeId] });
      setSelectedProducts([]);
    },
  });

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products?.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products?.map((p) => p.id) || []);
    }
  };

  const handleBulkAction = async (status: string) => {
    if (selectedProducts.length === 0) return;
    await bulkUpdateMutation.mutateAsync({ productIds: selectedProducts, status });
  };

  const handleDeleteProduct = async (product: Product) => {
    setShowDeleteConfirm(product);
  };

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;
    await deleteMutation.mutateAsync(showDeleteConfirm.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      case 'ARCHIVED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      ACTIVE: 'active',
      DRAFT: 'inactive',
      OUT_OF_STOCK: 'outOfStock',
      ARCHIVED: 'makeArchived',
    };
    return t(`products.${statusMap[status] || 'inactive'}`);
  };

  const getStockBadge = (product: Product) => {
    if (!product.trackInventory) return null;
    if (product.stock === 0) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
          {t('products.outOfStock')}
        </span>
      );
    }
    if (product.stock < 10) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
          {t('products.lowStock')}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
        {t('products.inStock')}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('products.title')}</h1>
          {store && (
            <p className="text-sm text-gray-600 mt-1">
              {store.name}
            </p>
          )}
        </div>
        <button
          onClick={() => router.push(`/dashboard/stores/${storeId}/products/new`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t('products.addProduct')}
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-blue-900">
            {selectedProducts.length} {t('products.selected')}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('ACTIVE')}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
            >
              {t('products.makeActive')}
            </button>
            <button
              onClick={() => handleBulkAction('DRAFT')}
              className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
            >
              {t('products.makeDraft')}
            </button>
            <button
              onClick={() => handleBulkAction('ARCHIVED')}
              className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition"
            >
              {t('products.makeArchived')}
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      {products && products.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-start">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('products.productName')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('products.price')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('products.stock')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('stores.status')}
                </th>
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.sku && (
                          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.price.toLocaleString()} {store?.currency || 'USD'}
                      </p>
                      {product.compareAtPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {product.compareAtPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.trackInventory ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">{product.stock}</span>
                        {getStockBadge(product)}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/stores/${storeId}/products/${product.id}`)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 transition"
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('products.noProductsYet')}
          </h3>
          <p className="text-gray-600 mb-6">{t('products.createFirstProduct')}</p>
          <button
            onClick={() => router.push(`/dashboard/stores/${storeId}/products/new`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t('products.addProduct')}
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t('products.deleteConfirm')}
            </h2>
            <p className="text-gray-600 mb-6">
              {showDeleteConfirm.name}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
