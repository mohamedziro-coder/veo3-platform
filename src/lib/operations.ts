// Shared utility for tracking video generation operations
// In-memory storage for operation tracking (replace with Redis/DB in production)
const operations = new Map<string, any>();

export function storeOperationResult(operationId: string, result: any) {
    operations.set(operationId, result);
    console.log(`[OPERATION] Stored result: ${operationId}, status: ${result.status}`);

    // Automatically clean up after 10 minutes
    setTimeout(() => {
        operations.delete(operationId);
        console.log(`[OPERATION] Cleaned up: ${operationId}`);
    }, 10 * 60 * 1000);
}

export function getOperationResult(operationId: string): any | undefined {
    return operations.get(operationId);
}

export function deleteOperationResult(operationId: string): void {
    operations.delete(operationId);
}
