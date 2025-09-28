// ===== 상품 검색 결과를 표시하는 메시지 컴포넌트 =====
// 이름, 수량, 가격 정보를 카드 형태로 표시

import { ProductInfo } from '@/interfaces/interfaces';

interface ProductMessageProps {
  products: ProductInfo[];
}

export function ProductMessage({ products }: ProductMessageProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-xs">
          <p className="text-gray-600 dark:text-gray-400">검색된 상품이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 max-w-2xl">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            🛍️ 상품 검색 결과
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            총 {products.length}개의 상품을 찾았습니다.
          </p>
        </div>
        
        <div className="space-y-3">
          {products.map((product) => (
            <div 
              key={product.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {product.name}
                    </h4>
                    {product.brand && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.brand}
                      </p>
                    )}
                    {product.category && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.category}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">수량</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.quantity}개
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">가격</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      {product.price.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            💡 더 자세한 정보가 필요하시면 상품명을 클릭해보세요!
          </p>
        </div>
      </div>
    </div>
  );
}
