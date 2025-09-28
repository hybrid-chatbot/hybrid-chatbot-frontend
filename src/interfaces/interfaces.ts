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