import type { RawTranslation } from "@/modules/storage";

export abstract class AbstractExporter {
  abstract readonly name: string;
  abstract readonly extension: string;
  abstract readonly method: LoaderMethod;

  export(projectId: string, options?: any): Promise<ArrayBuffer>{
    throw new Error("SimpleExport is not implemented")
  }

  exportStream(projectId: string, options?: any): TransformStream<any, ArrayBuffer>{
    throw new Error("StreamExport is not implemented")
  }
}

export abstract class AbstractImporter {
  abstract readonly name: string;
  abstract readonly extension: string;
  abstract readonly method: LoaderMethod;

  public import(raw: ArrayBuffer, options?: any): Promise<RawTranslation[]> {
    throw new Error("SimpleImport is not implemented")
  }

  public importStream(raw: ArrayBuffer, options?: any): TransformStream<ArrayBuffer, RawTranslation[]> {
    throw new Error("SimpleImport is not implemented")
  }
}

export enum LoaderMethod {
  Full,
  Streamed,
  Simple
}