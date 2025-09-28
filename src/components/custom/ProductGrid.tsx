// ===== 상품 그리드 컴포넌트 =====
// 여러 상품을 그리드 형태로 표시하는 컴포넌트
// 반응형 레이아웃과 빈 결과 처리 포함

import { ProductCard } from './ProductCard';
import { ProductCard as ProductCardType } from '../../interfaces/interfaces';

interface ProductGridProps {
  products: ProductCardType[];
  title?: string;
}

export const ProductGrid = ({ products, title }: ProductGridProps) => {
  // ===== 빈 결과 처리 =====
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        상품을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ===== 그리드 제목 ===== */}
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      )}
      
      {/* ===== 반응형 상품 그리드 ===== */}
      {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열, 대형 화면: 4열 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* ===== 상품 개수 표시 ===== */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        총 {products.length}개의 상품을 찾았습니다.
      </div>
    </div>
  );
};
