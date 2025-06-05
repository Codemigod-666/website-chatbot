import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <main className="relative min-h-screen container mx-auto bg-gray-100">
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1 className="text-3xl font-bold mb-6">Welcome to Our Chat App</h1>
        <p className="text-muted-foreground mb-8">
          Click the chat button in the bottom right corner to start a
          conversation.
        </p>

        <div className="mt-16 p-6 bg-card rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="text-left list-disc list-inside space-y-2">
            <li>Real-time chat interface</li>
            <li>MongoDB message storage</li>
            <li>AI-powered responses</li>
            <li>Clean, responsive design</li>
            <ChatWidget />
          </ul>
        </div>
      </div>
    </main>
  );
}
