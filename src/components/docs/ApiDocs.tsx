import React, { useState } from 'react';
import { Play, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import { useAuthStore } from '@/store/auth';

interface Endpoint {
  path: string;
  method: string;
  description: string;
  requestBody?: any;
  headers?: Record<string, string>;
  response?: any;
}

const API_ENDPOINTS: Endpoint[] = [
  {
    path: '/user/registerUser',
    method: 'POST',
    description: 'Register a new user with the platform',
    requestBody: {
      appId: 'string',
      deviceId: 'string'
    },
    response: {
      message: 'string',
      data: {
        userId: 'string',
        appId: 'string',
        deviceId: 'string',
        saAddress: 'string'
      },
      token: 'string'
    }
  },
  {
    path: '/user/registerGame',
    method: 'POST',
    description: 'Register a new game',
    headers: {
      Authorization: 'Bearer <token>'
    },
    requestBody: {
      name: 'string',
      type: 'string',
      description: 'string',
      events: [
        {
          eventType: 'string'
        }
      ]
    },
    response: {
      message: 'string',
      data: {
        game: {
          id: 'number',
          createrId: 'number',
          gameId: 'string',
          gameSaAddress: 'string',
          name: 'string',
          type: 'string',
          description: 'string',
          createdAt: 'string'
        },
        events: [
          {
            gameId: 'number',
            eventId: 'string',
            eventType: 'string'
          }
        ],
        Gametoken: 'string'
      }
    }
  }
];

const ApiDocs: React.FC = () => {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const { isAuthenticated } = useAuthStore();

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [key]: true });
    setTimeout(() => {
      setCopyStatus({ ...copyStatus, [key]: false });
    }, 2000);
  };

  const handleTryIt = async (endpoint: Endpoint) => {
    const token = localStorage.getItem('bigads_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(endpoint.headers?.Authorization ? { Authorization: `Bearer ${token}` } : {})
    };

    try {
      const response = await fetch(`https://data-center-7yhai.ondigitalocean.app${endpoint.path}`, {
        method: endpoint.method,
        headers,
        body: JSON.stringify(endpoint.requestBody)
      });
      
      const data = await response.json();
      // TODO: Show response in UI
    } catch (error) {
      console.error('Error:', error);
      // TODO: Show error in UI
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Explore and test the Bigads API endpoints.
        </p>
      </div>

      <div className="space-y-4">
        {API_ENDPOINTS.map((endpoint) => (
          <Card key={endpoint.path}>
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setExpandedEndpoint(
                expandedEndpoint === endpoint.path ? null : endpoint.path
              )}
            >
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {endpoint.method}
                </span>
                <span className="font-mono text-sm">{endpoint.path}</span>
              </div>
              {expandedEndpoint === endpoint.path ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {expandedEndpoint === endpoint.path && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                <p className="text-sm text-gray-600">{endpoint.description}</p>

                {endpoint.headers && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Headers</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <pre className="text-sm font-mono">
                        {JSON.stringify(endpoint.headers, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {endpoint.requestBody && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Request Body</h3>
                    <div className="relative bg-gray-50 p-3 rounded-md">
                      <pre className="text-sm font-mono">
                        {JSON.stringify(endpoint.requestBody, null, 2)}
                      </pre>
                      <button
                        onClick={() => handleCopy(
                          JSON.stringify(endpoint.requestBody, null, 2),
                          `${endpoint.path}-req`
                        )}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                      >
                        {copyStatus[`${endpoint.path}-req`] ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {endpoint.response && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Response</h3>
                    <div className="relative bg-gray-50 p-3 rounded-md">
                      <pre className="text-sm font-mono">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                      <button
                        onClick={() => handleCopy(
                          JSON.stringify(endpoint.response, null, 2),
                          `${endpoint.path}-res`
                        )}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                      >
                        {copyStatus[`${endpoint.path}-res`] ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    icon={Play}
                    onClick={() => handleTryIt(endpoint)}
                    disabled={!isAuthenticated && !!endpoint.headers?.Authorization}
                  >
                    Try it
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApiDocs;