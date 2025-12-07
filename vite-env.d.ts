declare module "*.css";

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RECAPTCHA_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
