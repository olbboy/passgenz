import { GeneratorConfig, GenerationResult } from './types';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class APIService {
  private static instance: APIService;
  private readonly BASE_URL = '/api/v1';

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  async generatePassword(config: GeneratorConfig): Promise<APIResponse<GenerationResult>> {
    try {
      const response = await fetch(`${this.BASE_URL}/generate/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Add other API endpoints...
} 