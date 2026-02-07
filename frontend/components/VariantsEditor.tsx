'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

type VariantType = 'COLOR' | 'SIZE' | 'TEXT';

interface VariantOption {
  id: string;
  type: VariantType;
  name: string; // e.g., "Color", "Size"
  values: string[]; // e.g., ["Red", "Blue"], ["S", "M", "L"]
}

interface VariantCombination {
  id: string;
  options: Record<string, string>; // e.g., { "Color": "Red", "Size": "M" }
  sku: string;
  price: string;
  stock: string;
  enabled: boolean;
}

interface VariantsEditorProps {
  onVariantsChange: (variants: VariantCombination[]) => void;
  currency?: string;
}

export function VariantsEditor({ onVariantsChange, currency = 'SAR' }: VariantsEditorProps) {
  const { t } = useTranslation();
  const [hasVariants, setHasVariants] = useState(false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [combinations, setCombinations] = useState<VariantCombination[]>([]);

  // Add new variant option
  const addVariantOption = () => {
    const newOption: VariantOption = {
      id: Date.now().toString(),
      type: 'SIZE',
      name: '',
      values: [''],
    };
    setVariantOptions([...variantOptions, newOption]);
  };

  // Remove variant option
  const removeVariantOption = (id: string) => {
    setVariantOptions(variantOptions.filter(opt => opt.id !== id));
  };

  // Update variant option
  const updateVariantOption = (id: string, field: keyof VariantOption, value: any) => {
    setVariantOptions(variantOptions.map(opt =>
      opt.id === id ? { ...opt, [field]: value } : opt
    ));
  };

  // Add value to variant option
  const addValue = (optionId: string) => {
    setVariantOptions(variantOptions.map(opt =>
      opt.id === optionId ? { ...opt, values: [...opt.values, ''] } : opt
    ));
  };

  // Remove value from variant option
  const removeValue = (optionId: string, index: number) => {
    setVariantOptions(variantOptions.map(opt =>
      opt.id === optionId ? { ...opt, values: opt.values.filter((_, i) => i !== index) } : opt
    ));
  };

  // Update value in variant option
  const updateValue = (optionId: string, index: number, value: string) => {
    setVariantOptions(variantOptions.map(opt =>
      opt.id === optionId ? {
        ...opt,
        values: opt.values.map((v, i) => i === index ? value : v)
      } : opt
    ));
  };

  // Generate all combinations
  const generateCombinations = () => {
    if (variantOptions.length === 0) {
      setCombinations([]);
      return;
    }

    const validOptions = variantOptions.filter(opt => 
      opt.name && opt.values.some(v => v.trim())
    );

    if (validOptions.length === 0) {
      setCombinations([]);
      return;
    }

    const cartesianProduct = (arrays: string[][]): string[][] => {
      return arrays.reduce((acc, curr) =>
        acc.flatMap(a => curr.map(b => [...a, b])),
        [[]] as string[][]
      );
    };

    const valueArrays = validOptions.map(opt => opt.values.filter(v => v.trim()));
    const products = cartesianProduct(valueArrays);

    const newCombinations: VariantCombination[] = products.map((combo, index) => {
      const options: Record<string, string> = {};
      validOptions.forEach((opt, i) => {
        options[opt.name] = combo[i];
      });

      return {
        id: `combo-${index}`,
        options,
        sku: '',
        price: '',
        stock: '0',
        enabled: true,
      };
    });

    setCombinations(newCombinations);
    onVariantsChange(newCombinations);
  };

  // Update combination
  const updateCombination = (id: string, field: keyof VariantCombination, value: any) => {
    const updated = combinations.map(combo =>
      combo.id === id ? { ...combo, [field]: value } : combo
    );
    setCombinations(updated);
    onVariantsChange(updated);
  };

  // Toggle variants
  const toggleVariants = (enabled: boolean) => {
    setHasVariants(enabled);
    if (!enabled) {
      setVariantOptions([]);
      setCombinations([]);
      onVariantsChange([]);
    }
  };

  return (
    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <label className="font-medium text-gray-700 text-sm">
          {t('products.variants') || 'Product Variants'}
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasVariants}
            onChange={(e) => toggleVariants(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            {t('products.enableVariants') || 'Enable variants'}
          </span>
        </label>
      </div>

      {hasVariants && (
        <div className="space-y-4">
          {/* Variant Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {t('products.variantOptions') || 'Variant Options'}
              </label>
              <button
                type="button"
                onClick={addVariantOption}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('products.addOption') || 'Add Option'}
              </button>
            </div>

            {variantOptions.map((option) => (
              <div key={option.id} className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) => updateVariantOption(option.id, 'name', e.target.value)}
                    placeholder={t('products.optionName') || 'Option name (e.g., Size, Color)'}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariantOption(option.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-1">
                  {option.values.map((value, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateValue(option.id, index, e.target.value)}
                        placeholder={t('products.optionValue') || 'Value (e.g., Red, XL)'}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      />
                      {option.values.length > 1 && (
                        <button
                          type="button"
                        onClick={() => removeValue(option.id, index)}
                        className="p-1.5 text-gray-400 hover:text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addValue(option.id)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    + {t('products.addValue') || 'Add value'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Generate Button */}
          {variantOptions.length > 0 && (
            <button
              type="button"
              onClick={generateCombinations}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              {t('products.generateVariants') || 'Generate Variants'}
            </button>
          )}

          {/* Combinations Table */}
          {combinations.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                      {t('products.variant') || 'Variant'}
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                      {t('products.sku') || 'SKU'}
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                      {t('products.price') || 'Price'} ({currency})
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                      {t('products.stock') || 'Stock'}
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                      {t('common.active') || 'Active'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {combinations.map((combo) => (
                    <tr key={combo.id} className="bg-white">
                      <td className="px-3 py-2 text-gray-900">
                        {Object.entries(combo.options).map(([key, value]) => (
                          <span key={key} className="inline-block mr-2 text-xs bg-gray-100 px-2 py-1 rounded">
                            {key}: {value}
                          </span>
                        ))}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={combo.sku}
                          onChange={(e) => updateCombination(combo.id, 'sku', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                          placeholder="SKU"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={combo.price}
                          onChange={(e) => updateCombination(combo.id, 'price', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={combo.stock}
                          onChange={(e) => updateCombination(combo.id, 'stock', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={combo.enabled}
                          onChange={(e) => updateCombination(combo.id, 'enabled', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
