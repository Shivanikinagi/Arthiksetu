import { AIChatbot } from "./AIChatbot";

export function AIAssistantPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/20 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-6">
                    <h1 className="text-4xl font-black text-gray-900 mb-2 heading-display">AI Assistant</h1>
                    <p className="text-gray-600 text-lg">Your complete financial guide — ask anything about income, schemes, taxes, loans, and more.</p>
                </div>
                <AIChatbot />
            </div>
        </div>
    );
}
