import { AIAssistant } from "./AIAssistant";

export function AIAssistantPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-[#0A1F44] mb-2">AI Earnings Assistant</h1>
                <p className="text-gray-600">
                    Automatically parse SMS to track your gig earnings and categorized expenses.
                </p>
            </div>
            <AIAssistant />
        </div>
    );
}
