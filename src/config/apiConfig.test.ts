import { beforeEach, describe, expect, it } from 'vitest';
import apiConfig from './apiConfig';

describe('apiConfig', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('uses the default API URL when no custom URL is configured', () => {
    expect(apiConfig.getApiUrl()).toBe(apiConfig.defaultApiUrl);
  });

  it('persists and resets a custom API URL', () => {
    apiConfig.setCustomApiUrl('https://example.com');

    expect(apiConfig.getCustomApiUrl()).toBe('https://example.com');
    expect(apiConfig.getApiUrl()).toBe('https://example.com');

    apiConfig.resetToDefault();

    expect(apiConfig.getCustomApiUrl()).toBeNull();
    expect(apiConfig.getApiUrl()).toBe(apiConfig.defaultApiUrl);
  });

  it('validates URL strings', () => {
    expect(apiConfig.validateApiUrl('https://example.com')).toBe(true);
    expect(apiConfig.validateApiUrl('http://localhost:8888')).toBe(true);
    expect(apiConfig.validateApiUrl('example.com')).toBe(false);
  });

  it('builds search URLs for regular and 252035 API hosts', () => {
    expect(apiConfig.buildSearchUrlWithBase('测试 资源', 'https://api.example.com')).toBe(
      'https://api.example.com/api/search?kw=%E6%B5%8B%E8%AF%95%20%E8%B5%84%E6%BA%90',
    );

    expect(apiConfig.buildSearchUrlWithBase('测试', 'https://so.252035.xyz')).toBe(
      'https://so.252035.xyz/api/search?kw=%E6%B5%8B%E8%AF%95&src=all&res=merge',
    );
  });
});
