import { AbstractImporter, LoaderMethod } from "@/modules/loader/def";
import type { RawTranslation } from "@/modules/storage";
import Papa from 'papaparse';

export default class CSVImporter extends AbstractImporter {
  readonly name = "csv"
  readonly extension = "csv"
  readonly method = LoaderMethod.Simple

  public async import(raw: ArrayBuffer, options: CSVImporterOptions): Promise<RawTranslation[]> {
    const rows = Papa.parse(new TextDecoder().decode(raw)).data as string[]

    const now = Date.now()

    return rows.map<RawTranslation>(element => ({
      key: element[options.columns.key],
      text: element[options.columns.translation],
      desc: element[options.columns.description],
      updatedAt: now,
      flags: []
    }))
  }
}

interface CSVImporterOptions {
  columns: {
    key: number
    description: number
    translation: number
  }
}