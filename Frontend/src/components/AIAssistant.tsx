import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
    Bot, Send, Loader2, Sparkles, MessageSquare, Shield, TrendingUp,
    AlertTriangle, Info, User, ArrowRight, RefreshCw, Gift, Zap
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useEarnings } from '../EarningsContext';

type Tab = 'chat' | 'decoder' | 'schemes' | 'risk';

interface ChatMsg {
    role: 'user' | 'assistant';
    content: string;
}

export function AIAssistant() {
    const [activeTab, setActiveTab] = useState<Tab>('chat');

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'chat', label: 'AI Chat', icon: <Bot className="w-4 h-4" /> },
        { id: 'decoder', label: 'Message Decoder', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'schemes', label: 'Scheme Finder', icon: <Gift className="w-4 h-4" /> },
        { id: 'risk', label: 'Risk Prediction', icon: <AlertTriangle className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'decoder' && <DecoderTab />}
            {activeTab === 'schemes' && <SchemesTab />}
            {activeTab === 'risk' && <RiskTab />}
        </div>
    );
}

/* ─────────────── CHAT TAB ─────────────── */
function ChatTab() {
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}`);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, session_id: sessionId })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t connect to the backend. Please check if the server is running.' }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        'What are my total earnings this month?',
        'How can I save tax as a gig worker?',
        'Which government schemes am I eligible for?',
        'Explain UPI transaction failures',
    ];

    return (
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col" style={{ height: '600px' }}>
            {/* Chat Header */}
            <div className="p-5 bg-gradient-to-r from-[#0A1F44] to-[#1e3a5f] text-white flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Bot className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">ArthikSetu AI Assistant</h3>
                    <p className="text-blue-200 text-xs">Ask about earnings, taxes, schemes, loans & more</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-green-300">Online</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">How can I help you today?</h4>
                        <p className="text-sm text-gray-500 mb-6 max-w-md">I can help with earnings tracking, tax advice, government schemes, loan guidance, and decoding financial messages.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setInput(s); }}
                                    className="text-left text-xs p-3 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-700 transition-all"
                                >
                                    <ArrowRight className="w-3 h-3 inline mr-1 text-blue-400" />
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                        )}
                        <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                            }`}>
                            {msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-gray-600" />
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-sm">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="Ask anything about your finances..."
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                        disabled={loading}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

/* ─────────────── DECODER TAB ─────────────── */
function DecoderTab() {
    const [message, setMessage] = useState('');
    const [decoded, setDecoded] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDecode = async () => {
        if (!message.trim()) return;
        setLoading(true);
        setDecoded('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/decode_message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await res.json();
            setDecoded(data.decoded_message);
        } catch {
            setDecoded('Error: Could not decode message. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const examples = [
        'Your UPI transaction of Rs.500 to HDFC Bank failed due to insufficient balance',
        'Dear customer, your a/c XX1234 is debited by Rs.2500 for loan EMI payment',
        'Congratulations! You are pre-approved for a personal loan up to Rs.5 Lakhs at 10.5% p.a.',
        'NEFT Ref No: HDFC123456 Rs.15000 credited to A/C XX5678 from SWIGGY on 15-Mar-26',
    ];

    return (
        <div className="space-y-6">
            <Card className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-100 to-transparent rounded-bl-full opacity-50 -mr-12 -mt-12"></div>
                <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Financial Message Decoder</h3>
                            <p className="text-sm text-gray-500">Paste confusing bank/platform messages — get plain-language explanations</p>
                        </div>
                    </div>

                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Paste your confusing bank or payment message here..."
                        rows={4}
                        className="w-full mb-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-400"
                    />

                    <Button
                        onClick={handleDecode}
                        disabled={!message.trim() || loading}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Decoding...</>
                        ) : (
                            <><Zap className="w-5 h-5 mr-2" /> Decode Message</>
                        )}
                    </Button>

                    <div className="mt-5">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Try an example:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {examples.map((ex, i) => (
                                <button
                                    key={i}
                                    onClick={() => setMessage(ex)}
                                    className="text-left text-xs p-3 bg-gray-50 hover:bg-orange-50 rounded-xl border border-gray-200 hover:border-orange-200 text-gray-600 hover:text-orange-700 transition-all truncate"
                                    title={ex}
                                >
                                    + {ex}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {decoded && (
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-200 shadow-md animate-fade-in-up">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl shrink-0">
                            <Info className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Simple Explanation</h4>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{decoded}</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}

/* ─────────────── SCHEMES TAB ─────────────── */
function SchemesTab() {
    const { totalEarnings } = useEarnings();
    const [age, setAge] = useState('28');
    const [occupation, setOccupation] = useState('Delivery Partner');
    const [category, setCategory] = useState('General');
    const [schemes, setSchemes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleRecommend = async () => {
        setLoading(true);
        setSchemes([]);
        try {
            const res = await fetch(`${API_BASE_URL}/api/recommend_schemes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    age: Number(age),
                    income: totalEarnings * 12,
                    occupation,
                    category
                })
            });
            const data = await res.json();
            setSchemes(data.schemes || []);
        } catch {
            alert('Failed to fetch scheme recommendations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-100 to-transparent rounded-bl-full opacity-50 -mr-12 -mt-12"></div>
                <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                            <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Government Scheme Finder</h3>
                            <p className="text-sm text-gray-500">Get personalized recommendations based on your profile</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                            <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                            <select value={occupation} onChange={(e) => setOccupation(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none bg-white">
                                <option>Delivery Partner</option>
                                <option>Driver</option>
                                <option>Freelancer</option>
                                <option>Home Service Provider</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none bg-white">
                                <option>General</option>
                                <option>SC</option>
                                <option>ST</option>
                                <option>OBC</option>
                                <option>Women</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (auto)</label>
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-700 font-semibold">
                                ₹{(totalEarnings * 12).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleRecommend}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Finding Schemes...</>
                        ) : (
                            <><Shield className="w-5 h-5 mr-2" /> Find Eligible Schemes</>
                        )}
                    </Button>
                </div>
            </Card>

            {schemes.length > 0 && (
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-500">{schemes.length} scheme{schemes.length > 1 ? 's' : ''} found</p>
                    {schemes.map((scheme: any, i: number) => (
                        <Card key={i} className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-100 rounded-xl shrink-0">
                                    <Gift className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">{scheme.name}</h4>
                                    {scheme.description && <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>}
                                    {scheme.simple_explanation && (
                                        <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                            <p className="text-xs font-semibold text-green-700 mb-1">In Simple Words:</p>
                                            <p className="text-sm text-gray-700">{scheme.simple_explanation}</p>
                                        </div>
                                    )}
                                    {scheme.benefits && (
                                        <p className="text-sm text-green-700 mt-2 font-medium">Benefits: {scheme.benefits}</p>
                                    )}
                                    {scheme.eligibility && (
                                        <p className="text-xs text-gray-500 mt-1">Eligibility: {scheme.eligibility}</p>
                                    )}
                                    {scheme.link && (
                                        <a href={scheme.link} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800">
                                            Apply Now <ArrowRight className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────── RISK TAB ─────────────── */
function RiskTab() {
    const { monthlyData, totalEarnings } = useEarnings();
    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        setLoading(true);
        setPrediction(null);
        try {
            const earningsHistory = monthlyData.length > 0
                ? monthlyData.map((m: any) => ({ date: m.month, amount: m.amount }))
                : [{ date: new Date().toISOString().slice(0, 7), amount: totalEarnings }];

            const res = await fetch(`${API_BASE_URL}/api/predict_risk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: earningsHistory })
            });
            const data = await res.json();
            setPrediction(data);
        } catch {
            alert('Failed to predict risk. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const getRiskStyle = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'low': return { bg: 'from-green-500 to-emerald-600', badge: 'bg-green-100 text-green-700', border: 'border-green-200' };
            case 'medium': return { bg: 'from-yellow-500 to-amber-600', badge: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200' };
            case 'high': return { bg: 'from-red-500 to-rose-600', badge: 'bg-red-100 text-red-700', border: 'border-red-200' };
            default: return { bg: 'from-gray-500 to-gray-600', badge: 'bg-gray-100 text-gray-700', border: 'border-gray-200' };
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-red-100 to-transparent rounded-bl-full opacity-50 -mr-12 -mt-12"></div>
                <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Income Risk Prediction</h3>
                            <p className="text-sm text-gray-500">AI analyzes your earnings history to predict potential low-income periods</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Monthly Earnings</p>
                            <p className="text-2xl font-black text-gray-900">₹{totalEarnings.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Data Points</p>
                            <p className="text-2xl font-black text-gray-900">{monthlyData.length || 1} months</p>
                        </div>
                    </div>

                    <Button
                        onClick={handlePredict}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyzing...</>
                        ) : (
                            <><TrendingUp className="w-5 h-5 mr-2" /> Predict Income Risk</>
                        )}
                    </Button>
                </div>
            </Card>

            {prediction && (
                <Card className={`p-8 bg-white rounded-2xl shadow-lg border ${getRiskStyle(prediction.risk_level).border} animate-fade-in-up`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 bg-gradient-to-br ${getRiskStyle(prediction.risk_level).bg} rounded-2xl shadow-lg`}>
                            <AlertTriangle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Risk Level</p>
                            <div className="flex items-center gap-3">
                                <h3 className="text-3xl font-black text-gray-900">{prediction.risk_level || 'Unknown'}</h3>
                                {prediction.risk_score !== undefined && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskStyle(prediction.risk_level).badge}`}>
                                        Score: {prediction.risk_score}/100
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {prediction.predicted_low_months && prediction.predicted_low_months.length > 0 && (
                        <div className="mb-5 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <p className="text-sm font-bold text-yellow-800 mb-2">Predicted Low-Earning Months</p>
                            <div className="flex flex-wrap gap-2">
                                {prediction.predicted_low_months.map((m: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold border border-yellow-200">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {prediction.suggestions && prediction.suggestions.length > 0 && (
                        <div>
                            <p className="text-sm font-bold text-gray-700 mb-3">Suggestions</p>
                            <div className="space-y-2">
                                {prediction.suggestions.map((s: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <RefreshCw className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                        <p className="text-sm text-gray-700">{s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
