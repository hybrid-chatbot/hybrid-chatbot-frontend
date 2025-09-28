// ===== 상품 카드 컴포넌트 =====
// 개별 상품을 카드 형태로 표시하는 컴포넌트
// 상품 이미지, 제목, 가격, 쇼핑몰 정보, 액션 버튼들을 포함

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingCart, Heart } from 'lucide-react';
import { ProductCard as ProductCardType } from '../../interfaces/interfaces';

interface ProductCardProps {
  product: ProductCardType;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  // ===== 이벤트 핸들러들 =====
  
  // 상품 카드 클릭 시 상품 페이지로 이동
  const handleProductClick = () => {
    if (product.link) {
      window.open(product.link, '_blank');
    }
  };

  // 장바구니 추가 버튼 클릭 (추후 구현 예정)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    // 장바구니 추가 로직 (추후 구현)
    console.log('장바구니에 추가:', product.title);
  };

  // 위시리스트 추가 버튼 클릭 (추후 구현 예정)
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    // 위시리스트 추가 로직 (추후 구현)
    console.log('위시리스트에 추가:', product.title);
  };

  return (
    // ===== 상품 카드 메인 컨테이너 =====
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={handleProductClick}>
      <CardHeader className="p-0">
        <div className="relative">
          {/* 상품 이미지 - 오류 시 플레이스홀더 표시 */}
          <img 
            src={product.image || '/placeholder-product.jpg'} 
            alt={product.title}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-product.jpg';
            }}
          />
          {/* 추천 상품 배지 */}
          {product.isRecommended && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              추천
            </div>
          )}
          {/* 할인율 배지 */}
          {product.discountRate && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              {product.discountRate}
            </div>
          )}
        </div>
      </CardHeader>
      
      {/* ===== 상품 정보 섹션 ===== */}
      <CardContent className="p-4">
        {/* 상품 제목 - 2줄로 제한 */}
        <CardTitle className="text-sm font-medium line-clamp-2 mb-2">
          {product.title}
        </CardTitle>
        
        <div className="space-y-1">
          {/* 가격 정보 - 최저가와 최고가 표시 */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-red-600">
              {product.priceFormatted}
            </span>
            {/* 최고가가 최저가보다 높을 때 취소선 표시 */}
            {product.hprice && product.hprice > product.lprice && (
              <span className="text-sm text-gray-500 line-through">
                {product.hprice.toLocaleString()}원
              </span>
            )}
          </div>
          
          {/* 쇼핑몰과 브랜드 정보 */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{product.mallName}</span>
            {product.brand && <span>{product.brand}</span>}
          </div>
          
          {/* 검색 횟수 표시 (인기도) */}
          {product.searchCount > 0 && (
            <div className="text-xs text-gray-500">
              검색 {product.searchCount}회
            </div>
          )}
        </div>
      </CardContent>
      
      {/* ===== 액션 버튼 섹션 ===== */}
      <CardFooter className="p-4 pt-0 flex gap-2">
        {/* 장바구니 추가 버튼 */}
        <Button 
          size="sm" 
          className="flex-1"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          장바구니
        </Button>
        {/* 위시리스트 추가 버튼 */}
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleAddToWishlist}
        >
          <Heart className="w-4 h-4" />
        </Button>
        {/* 상품 페이지 이동 버튼 */}
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleProductClick}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
