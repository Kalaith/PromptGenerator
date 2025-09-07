/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_TIMEOUT?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_DEBUG_MODE?: string
  readonly VITE_BASE_PATH?: string
  readonly VITE_ENABLE_TEMPLATES?: string
  readonly VITE_ENABLE_HISTORY?: string
  readonly VITE_ENABLE_FAVORITES?: string
  readonly VITE_DEBOUNCE_MS?: string
  readonly VITE_ERROR_DISPLAY_DURATION_MS?: string
  readonly VITE_DEBUG_LOGS?: string
  readonly DEV: boolean
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}