import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { MessageSquare, Loader2, Info } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { API_BASE_URL } from '../config';

export function MessageDecoder() {
    const [message, setMessage] = useState('');
    const [decoded, setDecoded] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDecode = async () => {
        if (!message.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/decode_message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            setDecoded(data.decoded_message);
        } catch (error) {
            console.error('Decode error:', error);
            setDecoded('Error: Could not decode message. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const exampleMessages = [
        'Your UPI transaction of Rs.500 to HDFC Bank failed due to insufficient balance',
        'Dear customer, your a/c XX1234 is debited by Rs.2500 for loan EMI payment',
        'Congratulations! You are pre-approved for a personal loan up to Rs.5 Lakhs',
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#0A1F44]">Financial Message Decoder</h1>
                <p className="text-gray-500 mt-2">
                    Paste confusing bank or payment platform messages and get simple explanations
                </p>
            </div>

            <Card className="p-6 mb-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Paste your confusing message here:
                        </label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Example: Dear customer, your a/c XX1234 is debited by Rs.500..."
                            rows={5}
                            className="w-full"
                        />
                    </div>

                    <Button
                        onClick={handleDecode}
                        disabled={!message.trim() || loading}
                        className="w-full bg-[#F7931E] hover:bg-[#E8850D]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Decoding...
                            </>
                        ) : (
                            <>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Decode Message
                            </>
                        )}
                    </Button>
                </div>
            </Card>

            {decoded && (
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Info className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#0A1F44] mb-2">
                                Simple Explanation:
                            </h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{decoded}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Examples */}
            <Card className="p-6 mt-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-[#0A1F44] mb-3">Try these examples:</h3>
                <div className="space-y-2">
                    {exampleMessages.map((example, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMessage(example)}
                            className="w-full text-left p-3 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-sm"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
}
