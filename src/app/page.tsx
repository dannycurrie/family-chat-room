import WelcomeForm from "@/components/WelcomeForm";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-4">
          Currie-Callaghan Family Chat Room!
        </h1>
        <p className="text-xl text-gray-500">
          Enter your name to start chatting!
        </p>
      </div>
      <WelcomeForm />
    </div>
  );
}
