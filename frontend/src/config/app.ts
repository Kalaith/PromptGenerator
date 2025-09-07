import { APP_CONSTANTS } from '../constants/app';

interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    enableTemplates: boolean;
    enableHistory: boolean;
    enableFavorites: boolean;
  };
  ui: {
    debounceMs: number;
    errorDisplayDurationMs: number;
  };
  development: {
    enableDebugLogs: boolean;
  };
}

class ConfigManager {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    const env = import.meta.env;
    
    return {
      api: {
        baseUrl: this.getEnvValue(
          ['VITE_API_URL', 'VITE_API_BASE_URL'],
          APP_CONSTANTS.API.DEFAULT_BASE_URL
        ),
        timeout: this.getNumberValue(
          env.VITE_API_TIMEOUT,
          APP_CONSTANTS.API.TIMEOUT_MS
        ),
      },
      features: {
        enableTemplates: this.getBooleanValue(env.VITE_ENABLE_TEMPLATES, true),
        enableHistory: this.getBooleanValue(env.VITE_ENABLE_HISTORY, true),
        enableFavorites: this.getBooleanValue(env.VITE_ENABLE_FAVORITES, true),
      },
      ui: {
        debounceMs: this.getNumberValue(
          env.VITE_DEBOUNCE_MS,
          APP_CONSTANTS.UI.DEBOUNCE_MS
        ),
        errorDisplayDurationMs: this.getNumberValue(
          env.VITE_ERROR_DISPLAY_DURATION_MS,
          APP_CONSTANTS.UI.ERROR_DISPLAY_DURATION_MS
        ),
      },
      development: {
        enableDebugLogs: this.getBooleanValue(env.VITE_DEBUG_LOGS, env.DEV),
      },
    };
  }

  private getEnvValue(keys: string[], defaultValue: string): string {
    const env = import.meta.env;
    for (const key of keys) {
      if (env[key]) {
        return env[key];
      }
    }
    return defaultValue;
  }

  private getNumberValue(value: string | undefined, defaultValue: number): number {
    if (!value) return defaultValue;
    const num = Number(value);
    return Number.isFinite(num) ? num : defaultValue;
  }

  private getBooleanValue(value: string | boolean | undefined, defaultValue: boolean): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return defaultValue;
  }

  get(): AppConfig {
    return this.config;
  }

  getApi() {
    return this.config.api;
  }

  getFeatures() {
    return this.config.features;
  }

  getUi() {
    return this.config.ui;
  }

  isDevelopment(): boolean {
    return this.config.development.enableDebugLogs;
  }
}

export const config = new ConfigManager();
export type { AppConfig };