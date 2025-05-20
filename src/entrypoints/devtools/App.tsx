import React, { useState, useEffect } from 'react';
import { initStore } from '../../utils/storage';
import { useStore } from '../../hooks/useStore';

interface MockConfig {
  id: string;
  url: string;
  response: string;
}

const DevToolsPanel: React.FC = () => {
  const [mockConfig, setMockConfig] = useState<MockConfig>({
    id: '',
    url: '',
    response: '',
  });
  const [mocks, setMocks] = useStore('mocks');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig = {
      ...mockConfig,
      id: Date.now().toString(),
    };
    setMocks([...mocks, newConfig]);
    setMockConfig({ id: '', url: '', response: '' });
  };

  const handleDelete = async (id: string) => {
    const updatedConfigs = mocks.filter((config: any) => config.id !== id);
    setMocks(updatedConfigs);
  };

  useEffect(() => {
    initStore();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mock 请求配置</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            请求 URL:
          </label>
          <input
            type='text'
            value={mockConfig.url}
            onChange={(e) =>
              setMockConfig({ ...mockConfig, url: e.target.value })
            }
            style={{ width: '100%', padding: '8px' }}
            placeholder='请输入要 mock 的 URL'
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Mock 返回数据:
          </label>
          <textarea
            value={mockConfig.response}
            onChange={(e) =>
              setMockConfig({ ...mockConfig, response: e.target.value })
            }
            style={{ width: '100%', height: '150px', padding: '8px' }}
            placeholder='请输入 mock 返回的 JSON 数据'
          />
        </div>

        <button
          type='submit'
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
          保存配置
        </button>
      </form>

      <div style={{ marginTop: '30px' }}>
        <h3>已保存的配置</h3>
        {mocks?.length === 0 ? (
          <p>暂无保存的配置</p>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {mocks?.map((config: any) => (
              <div
                key={config.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9',
                }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}>
                  <strong style={{ color: '#2196F3' }}>{config.url}</strong>
                  <button
                    onClick={() => handleDelete(config.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}>
                    删除
                  </button>
                </div>
                <pre
                  style={{
                    backgroundColor: '#fff',
                    padding: '10px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '100px',
                  }}>
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
