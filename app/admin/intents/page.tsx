export default function IntentsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Intents Manager
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          This feature is coming soon. Here you&apos;ll be able to manage
          chatbot intents and responses.
        </p>
      </div>
    </div>
  );
}
