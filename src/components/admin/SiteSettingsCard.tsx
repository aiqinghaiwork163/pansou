import { Button, Card, Checkbox, Form, Input, Space } from 'antd';

export interface SiteSettingsState {
  customApiUrl: string;
  isValidUrl: boolean;
  selectedSites: string[];
  allSites: string[];
}

interface SiteSettingsCardProps {
  settings: SiteSettingsState;
  loading: boolean;
  error: string | null;
  onCustomApiUrlChange: (value: string) => void;
  onToggleSiteSelection: (site: string) => void;
  onSave: () => void;
  onReset: () => void;
}

export function SiteSettingsCard({
  settings,
  loading,
  error,
  onCustomApiUrlChange,
  onToggleSiteSelection,
  onSave,
  onReset,
}: SiteSettingsCardProps) {
  return (
    <Card title="API站点配置">
      <Form layout="vertical">
        <Form.Item label="自定义API地址">
          <Input
            value={settings.customApiUrl}
            onChange={(event) => onCustomApiUrlChange(event.target.value)}
            placeholder="例如: https://api.example.com"
            status={!settings.isValidUrl && settings.customApiUrl ? 'error' : ''}
          />
          {settings.customApiUrl && !settings.isValidUrl && (
            <div className="text-red-500 mt-1">请输入有效的URL地址</div>
          )}
        </Form.Item>

        <Form.Item label="可用站点">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {settings.allSites.map((site) => (
              <Checkbox
                key={site}
                checked={settings.selectedSites.includes(site)}
                onChange={() => onToggleSiteSelection(site)}
              >
                {site}
              </Checkbox>
            ))}
          </div>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" onClick={onSave} loading={loading}>
              保存设置
            </Button>
            <Button onClick={onReset}>
              重置默认
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
    </Card>
  );
}
