import { AIAssistant } from "./AIAssistant";

export function AIAssistantPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-purple-50/20 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <AIAssistant />
            </div>
        </div>
    );
}
