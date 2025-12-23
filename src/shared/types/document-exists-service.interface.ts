export interface IDocumentExistsService {
  exists(documentId: string): Promise<boolean>;
}
