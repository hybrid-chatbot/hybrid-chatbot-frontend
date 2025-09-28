export interface message{
    content:string;
    role:string;
    id:string;
    analysisInfo?: {
        engine: string;
        intentName: string;
        originalIntentName: string;
        originalIntentScore: number;
    };
    analysisTrace?: {
        dialogflowIntent: string;
        dialogflowScore: number;
        similarityScore: number;
        safetyNetJudgement: string;
        ragFinalIntent: string | null;
        retrievedDocuments: any[] | null;
        finalEngine: string;
    };
    // 상품 검색 모드를 위한 필드들
    products?: ProductInfo[];
    messageType?: 'cs' | 'product_search';
}

// 상품 정보 인터페이스 (이름, 수량, 가격)
export interface ProductInfo {
    id: number;
    name: string;
    quantity: number;
    price: number;
    category?: string;
    brand?: string;
    image?: string;
}

export interface BackendMessage {
    id: string;
    sessionId: string;
    userId: string;
    sender: string;
    message: string;
    languageCode: string;
    timestamp: string;
    analysisInfo: {
        engine: string;
        intentName: string;
        originalIntentName: string;
        originalIntentScore: number;
    };
    analysisTrace: {
        dialogflowIntent: string;
        dialogflowScore: number;
        similarityScore: number;
        safetyNetJudgement: string;
        ragFinalIntent: string | null;
        retrievedDocuments: any[] | null;
        finalEngine: string;
    };
}