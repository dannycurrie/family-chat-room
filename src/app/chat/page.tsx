"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import ChatRoom from "@/components/ChatRoom";

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get("username");

  if (!username || username.trim().length < 2) {
    router.replace("/");
    return null;
  }

  return <ChatRoom username={username.trim()} />;
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <p className="text-gray-400 text-lg">Loading chat...</p>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
