/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute API base for cross-origin script embeds, e.g. https://host/api. Defaults to "/api". */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
