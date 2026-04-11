import { AbstractExporter, AbstractImporter } from "./def";

type Constructor<T> = new (...args: any[]) => T;

class LoaderManager {
  public importers: AbstractImporter[] = []
  public exporters: AbstractExporter[] = []

  registerImporter(importer: AbstractImporter) {
    if(!((importer as any).__proto__ instanceof AbstractImporter))
      throw new Error(`Importer is not a AbstractImporter extension`)

    this.importers.push(importer)
  }

  registerExporter(exporter: AbstractExporter) {
    if(!((exporter as any).__proto__ instanceof AbstractExporter))
      throw new Error(`Exporter is not a AbstractExporter extension`)

    this.exporters.push(exporter)
  }
}

export const loaderManager = new LoaderManager()