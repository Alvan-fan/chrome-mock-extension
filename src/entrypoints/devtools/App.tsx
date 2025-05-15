import React, { useState, useEffect } from 'react';
import { getStore, setStore } from '../../utils';

interface MockConfig {
  id: string;
  url: string;
  response: string;
}

const DevToolsPanel: React.FC = () => {
  const [mockConfig, setMockConfig] = useState<MockConfig>({
    id: '',
    url: '',
    response: ''
  });
  const [savedConfigs, setSavedConfigs] = useState<MockConfig[]>([]);

  // 加载保存的配置
  useEffect(() => {
    const loadConfigs = async () => {
      const store = await getStore();
      if (store?.mock) {
        setSavedConfigs(store.mock);
      }
    };
    loadConfigs();
  }, []);

  // 保存配置到存储
  const saveConfigsToStore = async (configs: MockConfig[]) => {
    const store = await getStore();
    await setStore({
      ...store,
      mock: configs
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig = {
      ...mockConfig,
      id: Date.now().toString()
    };
    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    await saveConfigsToStore(updatedConfigs);
    setMockConfig({ id: '', url: '', response: '' });
  };

  const handleDelete = async (id: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== id);
    setSavedConfigs(updatedConfigs);
    await saveConfigsToStore(updatedConfigs);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mock 请求配置</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            请求 URL:
          </label>
          <input
            type="text"
            value={mockConfig.url}
            onChange={(e) => setMockConfig({ ...mockConfig, url: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
            placeholder="请输入要 mock 的 URL"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Mock 返回数据:
          </label>
          <textarea
            value={mockConfig.response}
            onChange={(e) => setMockConfig({ ...mockConfig, response: e.target.value })}
            style={{ width: '100%', height: '150px', padding: '8px' }}
            placeholder="请输入 mock 返回的 JSON 数据"
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          保存配置
        </button>
      </form>

      <div style={{ marginTop: '30px' }}>
        <h3>已保存的配置</h3>
        {savedConfigs.length === 0 ? (
          <p>暂无保存的配置</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {savedConfigs.map((config) => (
              <div
                key={config.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ color: '#2196F3' }}>{config.url}</strong>
                  <button
                    onClick={() => handleDelete(config.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    删除
                  </button>
                </div>
                <pre
                  style={{
                    backgroundColor: '#fff',
                    padding: '10px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '100px'
                  }}
                >
                  {config.response}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevToolsPanel;
