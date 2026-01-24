import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Bot, Send, User, Loader2 } from 'lucide-react';

import { API_BASE_URL } from '../config';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AIChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I\'m your AI Earnings Assistant. I can help you track income, answer financial questions, and provide tips for gig workers. How can I help you today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(`session_${Date.now()}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    session_id: sessionId
                })
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I\'m having trouble connecting. Please make sure the backend is running.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        'How can I increase my earnings?',
        'What government schemes am I eligible for?',
        'How to save money as a gig worker?',
        'Tips for managing irregular income?'
    ];

    const handleQuickQuestion = (question: string) => {
        setInput(question);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="h-[600px] flex flex-col bg-white shadow-lg">
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-[#0A1F44] to-[#1E3A5F] text-white rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">AI Earnings Assistant</h2>
                            <p className="text-sm text-white/80">Ask me anything about your income and finances</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center ${message.role === 'user' ? 'bg-[#F7931E]' : 'bg-[#0A1F44]'
                                }`}>
                                {message.role === 'user' ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className={`flex-1 max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                                    ? 'bg-[#F7931E] text-white ml-auto'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-[#0A1F44]">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <Loader2 className="w-5 h-5 animate-spin text-[#0A1F44]" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length === 1 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleQuickQuestion(q)}
                                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1"
                            disabled={loading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="bg-[#F7931E] hover:bg-[#E8850D]"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
