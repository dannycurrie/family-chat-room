const AVATARS = ["🦊", "🐱", "🐶", "🐸", "🐵", "🐰", "🐻", "🐼", "🦁", "🐯", "🐨", "🦄"];

function getAvatar(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATARS[Math.abs(hash) % AVATARS.length];
}

interface UsersListProps {
  users: string[];
}

export default function UsersList({ users }: UsersListProps) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-md">
      <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-3">
        Online — {users.length}
      </h2>
      <div className="flex flex-wrap gap-2">
        {users.map((user) => (
          <span
            key={user}
            className="inline-flex items-center gap-1.5 px-3 py-1.5
                       bg-gradient-to-r from-purple-100 to-pink-100
                       rounded-full text-sm font-medium text-gray-700"
          >
            <span>{getAvatar(user)}</span>
            {user}
          </span>
        ))}
        {users.length === 0 && (
          <p className="text-gray-400 text-sm italic">No one here yet...</p>
        )}
      </div>
    </div>
  );
}
