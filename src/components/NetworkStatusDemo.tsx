import { NetworkStatus } from './NetworkStatus';

export function NetworkStatusDemo() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-2xl mb-8">网络状态检测演示</h1>
        <NetworkStatus />
      </div>
    </div>
  );
}
