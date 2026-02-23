import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Bot, Send, User, Loader2, Sparkles, MessageSquare, FileText, Calculator, Landmark, CreditCard, Shield, HelpCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AIChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: '🙏 Namaste! I\'m your **ArthikSetu Assistant** — your complete financial guide.\n\nI can help you with:\n• 📱 Analyze SMS & transactions\n• 🔍 Decode confusing bank messages\n• 🏛️ Government schemes & eligibility\n• 💰 Tax calculation & ITR guidance\n• 🏦 Loan options & eligibility\n• 📊 Income tracking tips\n• 📄 Document verification help\n\nJust ask me anything or paste an SMS to get started!'
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

    const quickActions = [
        { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Decode a message', prompt: 'Can you decode this message for me: ' },
        { icon: <Landmark className="w-3.5 h-3.5" />, label: 'Govt schemes for me', prompt: 'What government schemes am I eligible for as a gig worker earning ₹25,000/month?' },
        { icon: <Calculator className="w-3.5 h-3.5" />, label: 'Calculate my tax', prompt: 'Help me calculate tax on my annual income of ₹3,00,000' },
        { icon: <CreditCard className="w-3.5 h-3.5" />, label: 'Loan options', prompt: 'What loan options are available for gig workers?' },
        { icon: <FileText className="w-3.5 h-3.5" />, label: 'Analyze SMS', prompt: 'Analyze this SMS: Dear Customer, Rs.1200 has been credited to your a/c for Zomato order delivery.' },
        { icon: <Shield className="w-3.5 h-3.5" />, label: 'Verify documents', prompt: 'How do I verify my Aadhaar and PAN card on ArthikSetu?' },
        { icon: <HelpCircle className="w-3.5 h-3.5" />, label: 'How to use platform', prompt: 'Guide me through all the features of ArthikSetu' },
        { icon: <Sparkles className="w-3.5 h-3.5" />, label: 'Savings tips', prompt: 'Give me savings tips for irregular gig worker income' },
    ];

    const handleQuickAction = (prompt: string) => {
        setInput(prompt);
    };

    // Simple markdown-like formatting for assistant messages
    const formatMessage = (content: string) => {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="h-[650px] flex flex-col bg-white shadow-xl rounded-2xl overflow-hidden border-0 ring-1 ring-gray-200">
                {/* Header */}
                <div className="p-5 border-b bg-gradient-to-r from-[#0A1F44] via-[#152c57] to-[#1E3A5F] text-white">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="p-2.5 bg-white/15 backdrop-blur-sm rounded-xl">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0A1F44] animate-pulse"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">ArthikSetu Assistant</h2>
                            <p className="text-sm text-white/70">Your complete financial guide — SMS, schemes, tax, loans & more</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                                message.role === 'user' ? 'bg-[#F7931E]' : 'bg-[#0A1F44]'
                            }`}>
                                {message.role === 'user' ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className={`flex-1 max-w-[80%] p-3.5 rounded-2xl shadow-sm ${
                                message.role === 'user'
                                    ? 'bg-[#F7931E] text-white ml-auto rounded-tr-md'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-md'
                            }`}>
                                <div 
                                    className="whitespace-pre-wrap text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                                />
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-[#0A1F44]">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white p-3.5 rounded-2xl rounded-tl-md shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Loader2 className="w-4 h-4 animate-spin text-[#0A1F44]" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length <= 2 && (
                    <div className="px-4 py-3 border-t bg-white/80 backdrop-blur-sm">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Quick Actions</p>
                        <div className="flex flex-wrap gap-2">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleQuickAction(action.prompt)}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded-full text-gray-700 transition-all border border-gray-200 hover:border-blue-200"
                                >
                                    {action.icon}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask anything — paste SMS, decode messages, get scheme info..."
                            className="flex-1 rounded-xl"
                            disabled={loading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="bg-[#F7931E] hover:bg-[#E8850D] rounded-xl px-4"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
