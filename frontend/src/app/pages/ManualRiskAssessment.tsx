// src/pages/ManualAssessment.tsx
import { useState, useEffect, useRef } from "react";
import { Shield, AlertTriangle, CheckCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import axios from 'axios';

interface PredictionResult {
    risk_score: number;
    risk_level: string;
    recommended_action: string;
    reason: string;
}

export default function ManualAssessment() {
    const [form, setForm] = useState({
        limit_bal: "",
        age: "",
        sex: "",
        education: "",
        marriage: "",
        pay_0: "",
        pay_2: "",
        pay_3: "",
        pay_4: "",
        pay_5: "",
        pay_6: "",
        bill_amt1: "",
        bill_amt2: "",
        bill_amt3: "",
        bill_amt4: "",
        bill_amt5: "",
        bill_amt6: "",
        pay_amt1: "",
        pay_amt2: "",
        pay_amt3: "",
        pay_amt4: "",
        pay_amt5: "",
        pay_amt6: "",
    });

    const [result, setResult] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        payment: false,
        bills: false,
        payments: false
    });

    const formRef = useRef<HTMLDivElement>(null);

    // API Base URL - Using your render.com backend
    // API Base URL - Use environment variable with fallback for local development
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    // Check backend health on component mount
    useEffect(() => {
        checkBackendHealth();
    }, []);

    const checkBackendHealth = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/health`);
            if (res.ok) {
                setBackendStatus('online');
                console.log('✅ Backend is online');
            } else {
                setBackendStatus('offline');
                console.log('❌ Backend returned error');
            }
        } catch (err) {
            setBackendStatus('offline');
            console.log('❌ Backend is offline');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError(null);
    };

    const buildPayload = (data) => ({
        limit_bal:  parseFloat(data.limit_bal  || 0),
        age:        parseInt  (data.age        || 0),
        sex:        parseInt  (data.sex        || 1),
        education:  parseInt  (data.education  || 1),
        marriage:   parseInt  (data.marriage   || 1),

        pay_0: parseInt(data.pay_0 || 0),
        pay_2: parseInt(data.pay_2 || 0),
        pay_3: parseInt(data.pay_3 || 0),
        pay_4: parseInt(data.pay_4 || 0),
        pay_5: parseInt(data.pay_5 || 0),
        pay_6: parseInt(data.pay_6 || 0),

        bill_amt1: parseFloat(data.bill_amt1 || 0),
        bill_amt2: 0,   // or parseFloat(data.bill_amt2 || 0) if you add the field later
        bill_amt3: 0,
        bill_amt4: 0,
        bill_amt5: 0,
        bill_amt6: parseFloat(data.bill_amt6 || 0),

        pay_amt1:  parseFloat(data.pay_amt1  || 0),
        pay_amt2:  0,
        pay_amt3:  0,
        pay_amt4:  0,
        pay_amt5:  0,
        pay_amt6:  parseFloat(data.pay_amt6  || 0)
    });

    // In your ManualRiskAssessment.tsx, find the predict function around line 117

    const predict = async () => {
        try {
            setLoading(true);
            setError(null);

            // Force integer fields to be actual integers (no .0)
            const safeParseInt = (val: string, defaultVal: number = 0) => {
                const num = parseInt(val, 10);
                return isNaN(num) ? defaultVal : num;
            };

            const safeParseFloat = (val: string, defaultVal: number = 0) => {
                const num = parseFloat(val);
                return isNaN(num) ? defaultVal : num;
            };

            const payload = {
                limit_bal: safeParseFloat(form.limit_bal),
                age:       safeParseInt(form.age),
                sex:       safeParseInt(form.sex, 1),
                education: safeParseInt(form.education, 2),
                marriage:  safeParseInt(form.marriage, 1),

                pay_0: safeParseInt(form.pay_0),
                pay_2: safeParseInt(form.pay_2),
                pay_3: safeParseInt(form.pay_3),
                pay_4: safeParseInt(form.pay_4),
                pay_5: safeParseInt(form.pay_5),
                pay_6: safeParseInt(form.pay_6),

                bill_amt1: safeParseFloat(form.bill_amt1),
                bill_amt2: safeParseFloat(form.bill_amt2),
                bill_amt3: safeParseFloat(form.bill_amt3),
                bill_amt4: safeParseFloat(form.bill_amt4),
                bill_amt5: safeParseFloat(form.bill_amt5),
                bill_amt6: safeParseFloat(form.bill_amt6),

                pay_amt1: safeParseFloat(form.pay_amt1),
                pay_amt2: safeParseFloat(form.pay_amt2),
                pay_amt3: safeParseFloat(form.pay_amt3),
                pay_amt4: safeParseFloat(form.pay_amt4),
                pay_amt5: safeParseFloat(form.pay_amt5),
                pay_amt6: safeParseFloat(form.pay_amt6),
            };

            console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post(
                `${API_BASE_URL}/predict`,   // ← better to use the variable here too
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log('✅ Response:', response.data);
            setResult(response.data);

            // scroll...
        } catch (error: any) {
            console.error('❌ Prediction error:', error);
            if (error.response?.status === 422) {
                setError("Validation error: " + (error.response.data?.detail?.[0]?.msg || "Check all fields are valid numbers"));
            } else {
                setError(error.message || 'Failed to get prediction');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadDemo = (type: "low" | "medium" | "high") => {
        let demo: Partial<typeof form> = {};

        if (type === "low") {
            demo = {
                limit_bal: "200000",
                age: "35",
                sex: "2",
                education: "2",
                marriage: "1",
                pay_0: "-1",
                pay_2: "-1",
                pay_3: "0",
                pay_4: "0",
                pay_5: "-1",
                pay_6: "0",
                bill_amt1: "50000",
                bill_amt2: "48000",
                bill_amt3: "47000",
                bill_amt4: "46000",
                bill_amt5: "45000",
                bill_amt6: "44000",
                pay_amt1: "15000",
                pay_amt2: "14000",
                pay_amt3: "13000",
                pay_amt4: "12000",
                pay_amt5: "11000",
                pay_amt6: "10000",
            };
        }
        else if (type === "medium") {
            demo = {
                limit_bal: "100000",
                age: "30",
                sex: "1",
                education: "2",
                marriage: "2",
                pay_0: "1",
                pay_2: "1",
                pay_3: "0",
                pay_4: "1",
                pay_5: "0",
                pay_6: "1",
                bill_amt1: "35000",
                bill_amt2: "36000",
                bill_amt3: "37000",
                bill_amt4: "38000",
                bill_amt5: "39000",
                bill_amt6: "40000",
                pay_amt1: "5000",
                pay_amt2: "4500",
                pay_amt3: "4000",
                pay_amt4: "3500",
                pay_amt5: "3000",
                pay_amt6: "2500",
            };
        }
        else if (type === "high") {
            demo = {
                limit_bal: "30000",
                age: "28",
                sex: "1",
                education: "1",
                marriage: "2",
                pay_0: "3",
                pay_2: "3",
                pay_3: "2",
                pay_4: "2",
                pay_5: "3",
                pay_6: "3",
                bill_amt1: "28000",
                bill_amt2: "29000",
                bill_amt3: "30000",
                bill_amt4: "30000",
                bill_amt5: "30000",
                bill_amt6: "30000",
                pay_amt1: "500",
                pay_amt2: "400",
                pay_amt3: "300",
                pay_amt4: "200",
                pay_amt5: "100",
                pay_amt6: "50",
            };
        }

        setForm((prev) => ({ ...prev, ...demo }));

        // Expand all sections on mobile when demo is loaded
        if (window.innerWidth < 640) {
            setExpandedSections({
                basic: true,
                payment: true,
                bills: true,
                payments: true
            });
        }
    };

    const getRiskStyle = () => {
        if (!result) return "";
        if (result.risk_level.includes("LOW")) return "bg-emerald-50 border-emerald-200 text-emerald-800";
        if (result.risk_level.includes("MEDIUM")) return "bg-amber-50 border-amber-200 text-amber-800";
        return "bg-rose-50 border-rose-200 text-rose-800";
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderField = (name: string, label: string, options?: { min?: number; max?: number; type?: string }) => {
        return (
            <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-slate-700">
                    {label}
                </label>
                <input
                    name={name}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={options?.type === "number" ? "0" : ""}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    type={options?.type || "number"}
                    min={options?.min}
                    max={options?.max}
                    step="any"
                />
            </div>
        );
    };

    const renderSection = (
        title: string,
        sectionKey: keyof typeof expandedSections,
        fields: { name: string; label: string; options?: any }[]
    ) => {
        const isExpanded = expandedSections[sectionKey];

        return (
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
                <button
                    type="button"
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                    <span className="font-medium text-slate-900">{title}</span>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isExpanded && (
                    <div className="p-4 grid grid-cols-1 gap-4">
                        {fields.map(field => renderField(field.name, field.label, field.options))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 sm:space-y-6 pb-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-slate-50 py-2 z-10">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Manual Risk Assessment
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">
                        Enter customer data to get a pre-delinquency risk prediction
                    </p>
                </div>

                {/* Backend Status Indicator */}
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                        backendStatus === 'online' ? 'bg-green-500 animate-pulse' :
                            backendStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-xs text-slate-600">
                        {backendStatus === 'online' ? 'Backend Connected' :
                            backendStatus === 'offline' ? 'Backend Offline' : 'Checking...'}
                    </span>
                </div>
            </div>

            {/* Demo Buttons - Scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sticky top-20 bg-slate-50 z-10">
                <button
                    onClick={() => loadDemo("low")}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap flex-shrink-0"
                >
                    Low Risk Demo
                </button>
                <button
                    onClick={() => loadDemo("medium")}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap flex-shrink-0"
                >
                    Medium Risk Demo
                </button>
                <button
                    onClick={() => loadDemo("high")}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap flex-shrink-0"
                >
                    High Risk Demo
                </button>
            </div>

            {/* Backend Offline Warning */}
            {backendStatus === 'offline' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        ⚠️ Backend server is not responding. Make sure it's running on render.com
                    </p>
                </div>
            )}

            {/* Form - Now with collapsible sections on mobile */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" ref={formRef}>
                {/* Mobile View - Collapsible Sections */}
                <div className="block sm:hidden">
                    {renderSection("Basic Information", "basic", [
                        { name: "limit_bal", label: "Limit Balance ($)", options: { type: "number" } },
                        { name: "age", label: "Age", options: { type: "number", min: 18, max: 100 } },
                        { name: "sex", label: "Sex (1 = male, 2 = female)", options: { type: "number", min: 1, max: 2 } },
                        { name: "education", label: "Education (1–6)", options: { type: "number", min: 1, max: 6 } },
                        { name: "marriage", label: "Marriage (1-3)", options: { type: "number", min: 1, max: 3 } },
                    ])}

                    {renderSection("Payment Status (Last 6 months)", "payment", [
                        { name: "pay_0", label: "PAY_0 (September)" },
                        { name: "pay_2", label: "PAY_2 (August)" },
                        { name: "pay_3", label: "PAY_3 (July)" },
                        { name: "pay_4", label: "PAY_4 (June)" },
                        { name: "pay_5", label: "PAY_5 (May)" },
                        { name: "pay_6", label: "PAY_6 (April)" },
                    ])}

                    {renderSection("Bill Amounts", "bills", [
                        { name: "bill_amt1", label: "Bill Amount (September)" },
                        { name: "bill_amt2", label: "Bill Amount (August)" },
                        { name: "bill_amt3", label: "Bill Amount (July)" },
                        { name: "bill_amt4", label: "Bill Amount (June)" },
                        { name: "bill_amt5", label: "Bill Amount (May)" },
                        { name: "bill_amt6", label: "Bill Amount (April)" },
                    ])}

                    {renderSection("Payment Amounts", "payments", [
                        { name: "pay_amt1", label: "Payment Amount (September)" },
                        { name: "pay_amt2", label: "Payment Amount (August)" },
                        { name: "pay_amt3", label: "Payment Amount (July)" },
                        { name: "pay_amt4", label: "Payment Amount (June)" },
                        { name: "pay_amt5", label: "Payment Amount (May)" },
                        { name: "pay_amt6", label: "Payment Amount (April)" },
                    ])}
                </div>

                {/* Desktop View - Grid Layout */}
                <div className="hidden sm:block p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* Basic Info */}
                        {renderField("limit_bal", "Limit Balance ($)", { type: "number" })}
                        {renderField("age", "Age", { type: "number", min: 18, max: 100 })}
                        {renderField("sex", "Sex (1 = male, 2 = female)", { type: "number", min: 1, max: 2 })}
                        {renderField("education", "Education (1–6)", { type: "number", min: 1, max: 6 })}
                        {renderField("marriage", "Marriage (1-3)", { type: "number", min: 1, max: 3 })}

                        {/* Payment Status Fields */}
                        {renderField("pay_0", "PAY_0 (Sep repayment)")}
                        {renderField("pay_2", "PAY_2 (Aug repayment)")}
                        {renderField("pay_3", "PAY_3 (Jul repayment)")}
                        {renderField("pay_4", "PAY_4 (Jun repayment)")}
                        {renderField("pay_5", "PAY_5 (May repayment)")}
                        {renderField("pay_6", "PAY_6 (Apr repayment)")}

                        {/* Bill Amount Fields */}
                        {renderField("bill_amt1", "Bill Amount (Sep)")}
                        {renderField("bill_amt2", "Bill Amount (Aug)")}
                        {renderField("bill_amt3", "Bill Amount (Jul)")}
                        {renderField("bill_amt4", "Bill Amount (Jun)")}
                        {renderField("bill_amt5", "Bill Amount (May)")}
                        {renderField("bill_amt6", "Bill Amount (Apr)")}

                        {/* Payment Amount Fields */}
                        {renderField("pay_amt1", "Payment Amount (Sep)")}
                        {renderField("pay_amt2", "Payment Amount (Aug)")}
                        {renderField("pay_amt3", "Payment Amount (Jul)")}
                        {renderField("pay_amt4", "Payment Amount (Jun)")}
                        {renderField("pay_amt5", "Payment Amount (May)")}
                        {renderField("pay_amt6", "Payment Amount (Apr)")}
                    </div>
                </div>

                {/* Action Buttons - Always visible */}
                <div className="p-4 sm:p-6 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={predict}
                            disabled={loading || backendStatus === 'offline'}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                loading ? "animate-pulse" : ""
                            }`}
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {loading ? "Predicting..." : "Predict Risk"}
                        </button>

                        <button
                            onClick={() => {
                                setForm(Object.fromEntries(Object.keys(form).map(k => [k, ""])));
                                setResult(null);
                                setError(null);
                            }}
                            className="flex-1 px-4 sm:px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition"
                        >
                            Clear Form
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 sm:p-5 text-rose-800 flex items-start gap-3">
                    <AlertTriangle size={18} sm:size={20} className="mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base">Error</p>
                        <p className="text-xs sm:text-sm mt-1 break-words whitespace-pre-line">{error}</p>
                    </div>
                </div>
            )}

            {/* Result */}
            {result && (
                <div id="results-section" className={`rounded-xl border p-4 sm:p-6 ${getRiskStyle()}`}>
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        {result.risk_level.includes("LOW") && <CheckCircle className="text-emerald-600" size={20} sm:size={28} />}
                        {result.risk_level.includes("MEDIUM") && <AlertTriangle className="text-amber-600" size={20} sm:size={28} />}
                        {result.risk_level.includes("HIGH") && <AlertTriangle className="text-rose-600" size={20} sm:size={28} />}
                        <h3 className="text-lg sm:text-xl font-bold">{result.risk_level}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                            <p className="text-xs sm:text-sm opacity-80">Risk Score</p>
                            <p className="text-2xl sm:text-3xl font-bold mt-1">{(result.risk_score * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm opacity-80">Recommended Action</p>
                            <p className="text-base sm:text-lg font-semibold mt-1">{result.recommended_action}</p>
                        </div>
                        <div className="sm:col-span-1">
                            <p className="text-xs sm:text-sm opacity-80">Reason</p>
                            <p className="text-sm sm:text-base mt-1">{result.reason}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}