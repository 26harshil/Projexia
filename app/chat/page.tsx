import ChatComponent from "@/components/ui/Chat";

export default function ChatPage() {
  return (
    <div className="h-screen w-full p-4 md:p-6 bg-background">
      <div className="h-full max-h-[1000px] w-full max-w-7xl mx-auto flex flex-col">
        {/* Optional Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">Communication Hub</h1>
          <p className="text-muted-foreground text-sm">
            Chat with faculty members, project partners, and administrators.
          </p>
        </div>
        
        {/* Chat Component */}
        <div className="flex-1 overflow-hidden">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}
