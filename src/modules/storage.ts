import { openDB, type DBSchema, type IDBPDatabase } from "idb";

let dbConnection: IDBPDatabase<AppDatabase>;
const DB_NAME = "langy",
      DB_VERSION = 1;

export async function getDatabase() {
  if (dbConnection) return dbConnection;
  dbConnection = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction, event) {
      db.createObjectStore("config");
      db.createObjectStore("projects", {
        keyPath: 'projectId'
      });
      const translationsStore = db.createObjectStore("translations", {
        keyPath: ['projectId', 'languageId', 'key']
      });

      translationsStore.createIndex('by-language', ['projectId', 'languageId']);
      translationsStore.createIndex('by-project', 'projectId');
    },
  });

  return dbConnection;
}

export type ConfigValue = string | number | boolean;

export interface AppDatabase extends DBSchema {
  config: {
    key: string;
    value: ConfigValue;
  };
  projects: {
    key: string;
    value: Project;
  };
  translations: {
    key: [string, string, string]; // `ProjectKey;LanguageKey;TranslationKey`
    value: Translation & {
      projectId: string;
      languageId: string;
      key: string;
    };
    indexes: {
      'by-language': [string, string]; // [projectId, languageId]
      'by-project': string;
    };
  };
}

export interface Project {
  projectId: string
  name: string;
  languages: Language[];
}

export interface Language {
  symbol: string;
  customName?: string;
  updatedAt: number;
  reference: string;
}

export interface Translation {
  text: string;
  desc?: string;
  updatedAt?: number;
  flags: TranslationFlags[];
}

export enum TranslationFlags {
  Translated = "translated",
  Verified = "verified",
  AI = "ai",
}

export interface RawTranslation extends Translation {
  key: string;
}
