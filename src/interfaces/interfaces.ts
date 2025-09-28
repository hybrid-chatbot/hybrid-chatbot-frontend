// ===== 상품 시각화 기능을 위한 인터페이스 확장 =====
// 기존 message 인터페이스에 상품 데이터와 메시지 타입 필드 추가
export interface message{
    content:string;
    role:string;
    id:string;
    products?: ProductCard[]; // 상품 카드 목록 추가 - 백엔드에서 전송되는 상품 데이터
    messageType?: string; // 메시지 타입 추가 - "shopping", "recommendation", "text" 등
    analysisInfo?: AnalysisInfo; // 분석 정보 추가
    analysisTrace?: AnalysisTrace; // 분석 추적 정보 추가
    sessionId?: string; // 세션 ID 추가
    userId?: string; // 사용자 ID 추가
    sender?: string; // 발신자 추가
    languageCode?: string; // 언어 코드 추가
    timestamp?: string; // 타임스탬프 추가
}

// ===== 새로운 백엔드 응답 형식 인터페이스 =====
export interface BackendResponse {
    id: string;
    sessionId: string;
    userId: string;
    sender: string;
    message: string;
    languageCode: string;
    timestamp: string;
    analysisInfo: AnalysisInfo;
    analysisTrace: AnalysisTrace;
}

// ===== 분석 정보 인터페이스 =====
export interface AnalysisInfo {
    engine: string;
    intentName: string;
    originalIntentName: string;
    originalIntentScore: number;
}

// ===== 분석 추적 정보 인터페이스 =====
export interface AnalysisTrace {
    dialogflowIntent: string;
    dialogflowScore: number;
    similarityScore: number;
    safetyNetJudgement: string;
    ragFinalIntent: string | null;
    retrievedDocuments: any | null;
    finalEngine: string;
}

// ===== 상품 정보 인터페이스 =====
export interface ProductInfo {
    id: number;
    title: string;
    image: string;
    link: string;
    lprice: number;
    hprice: number;
    mallName: string;
    brand: string;
    category1: string;
    category2: string;
    productType: string;
    maker: string;
    searchCount: number;
    lastSearchedAt: string;
    priceFormatted: string;
    discountRate: string;
    isRecommended: boolean;
    recommendationReason?: string;
}

// ===== 상품 카드 인터페이스 정의 =====
// 백엔드 ShoppingMessageResponse.ProductCard와 동일한 구조
// 채팅 UI에서 상품을 카드 형태로 표시하기 위한 데이터 구조
export interface ProductCard {
    id: number;
    title: string;
    image: string;
    link: string;
    lprice: number;
    hprice: number;
    mallName: string;
    brand: string;
    category1: string;
    category2: string;
    productType: string;
    maker: string;
    searchCount: number;
    lastSearchedAt: string;
    priceFormatted: string;
    discountRate: string;
    isRecommended: boolean;
    recommendationReason?: string;
}

// ===== 쇼핑 분석 정보 인터페이스 =====
// 백엔드에서 전송되는 검색 분석 데이터 구조
export interface ShoppingAnalysisInfo {
    intentType: string;
    originalQuery: string;
    totalResults: number;
}

// ===== 쇼핑 메시지 응답 인터페이스 =====
// 백엔드 ShoppingMessageResponse와 동일한 구조
// 상품 검색 결과를 포함한 완전한 응답 데이터 구조
export interface ShoppingMessageResponse {
    userId: string;
    sessionId: string;
    response: string;
    messageType: string;
    products: ProductCard[];
    analysisInfo: ShoppingAnalysisInfo;
    timestamp: string;
}