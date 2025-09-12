function ChatCard({ userMessage, response }) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-start mb-2">
          <img
            src="https://via.placeholder.com/40"
            alt="user"
            className="rounded-full mr-3"
          />
          <p className="text-sm text-gray-800">{userMessage}</p>
        </div>
        <p className="text-gray-700 text-sm">{response}</p>
      </div>
    );
  }
  