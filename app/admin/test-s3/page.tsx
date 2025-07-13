'use client';

import S3Status from '../components/S3Status';

export default function TestS3Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Тест S3 подключения</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Статус S3:</h2>
        <S3Status />
      </div>
      
      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Инструкции:</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Откройте консоль разработчика (F12)</li>
          <li>Посмотрите на логи S3Status</li>
          <li>Если есть ошибка, нажмите кнопку "Повторить"</li>
          <li>Проверьте сетевые запросы в вкладке Network</li>
        </ol>
      </div>
    </div>
  );
} 