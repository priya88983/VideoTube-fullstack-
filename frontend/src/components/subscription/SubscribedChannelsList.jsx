// SubscribedChannelsList.jsx

const SubscribedChannelsList = ({ channels }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      {channels.length === 0 ? (
        <p className="text-gray-400 text-sm col-span-full text-center">
          No subscribed channels.
        </p>
      ) : (
        channels.map((user, index) => (
          <div
            key={index}
            className="bg-[0f0f0f] rounded-lg p-4 flex flex-col items-center text-center shadow"
          >
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.fullName}
              className="w-16 h-16 rounded-full object-cover mb-2"
            />
            <p className="text-white font-medium text-sm">{user.fullName}</p>
            <p className="text-gray-400 text-xs">@{user.username}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SubscribedChannelsList;
