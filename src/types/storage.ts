export interface FileData {
    filename: string;
    fileData: ArrayBuffer;
}
export interface FileStorage {
    uploadFile: (file: FileData) => Promise<string>;
    deleteFile: (filename: string) => Promise<boolean>;
    getObjectUrl: (filename: string) => string;
}
