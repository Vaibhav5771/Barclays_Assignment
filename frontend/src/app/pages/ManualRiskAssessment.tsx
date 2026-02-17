// src/pages/ManualAssessment.tsx
import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

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
    const [showAllFields, setShowAllFields] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError(null);
    };

    const buildPayload = () => {
        const payload: any = {};

        // Include all fields, defaulting to 0 if empty
        Object.keys(form).forEach(key => {
            payload[key] = parseFloat(form[key as keyof typeof form]) || 0;
        });

        return payload;
    };

    const predict = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = buildPayload();

            const res = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to connect to prediction service");
        } finally {
            setLoading(false);
        }
    };

// In ManualAssessment.tsx, update the loadDemo function:

    const loadDemo = (type: "low" | "medium" | "high") => {
        let demo: Partial<typeof form> = {};

        if (type === "low") {
            demo = {
                limit_bal: "200000",     // High credit limit
                age: "35",
                sex: "2",
                education: "2",
                marriage: "1",
                pay_0: "-1",              // No delay (paid early)
                pay_2: "-1",              // No delay
                pay_3: "0",                // Paid on time
                pay_4: "0",                // Paid on time
                pay_5: "-1",               // Paid early
                pay_6: "0",                // Paid on time
                bill_amt1: "50000",
                bill_amt2: "48000",
                bill_amt3: "47000",
                bill_amt4: "46000",
                bill_amt5: "45000",
                bill_amt6: "44000",        // Decreasing balance
                pay_amt1: "15000",          // High payments
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
                pay_0: "1",                // 1-month delay
                pay_2: "1",                // 1-month delay
                pay_3: "0",                // Paid on time
                pay_4: "1",                // 1-month delay
                pay_5: "0",                // Paid on time
                pay_6: "1",                // 1-month delay
                bill_amt1: "35000",
                bill_amt2: "36000",
                bill_amt3: "37000",
                bill_amt4: "38000",
                bill_amt5: "39000",
                bill_amt6: "40000",         // Increasing balance
                pay_amt1: "5000",           // Moderate payments
                pay_amt2: "4500",
                pay_amt3: "4000",
                pay_amt4: "3500",
                pay_amt5: "3000",
                pay_amt6: "2500",
            };
        }
        else if (type === "high") {
            demo = {
                limit_bal: "30000",         // Low credit limit (maxed out)
                age: "28",
                sex: "1",
                education: "1",
                marriage: "2",
                pay_0: "3",                 // 3-month delay (severe)
                pay_2: "3",                 // 3-month delay
                pay_3: "2",                 // 2-month delay
                pay_4: "2",                 // 2-month delay
                pay_5: "3",                 // 3-month delay
                pay_6: "3",                 // 3-month delay
                bill_amt1: "28000",          // Near limit
                bill_amt2: "29000",          // Increasing
                bill_amt3: "30000",          // Maxed out
                bill_amt4: "30000",          // Still maxed
                bill_amt5: "30000",          // Still maxed
                bill_amt6: "30000",          // Still maxed
                pay_amt1: "500",             // Very low payments
                pay_amt2: "400",
                pay_amt3: "300",
                pay_amt4: "200",
                pay_amt5: "100",
                pay_amt6: "50",              // Barely any payment
            };
        }

        setForm((prev) => ({ ...prev, ...demo }));

        // Optional: Auto-predict after loading demo
        // setTimeout(predict, 500);
    };

    const getRiskStyle = () => {
        if (!result) return "";
        if (result.risk_level.includes("LOW")) return "bg-emerald-50 border-emerald-200 text-emerald-800";
        if (result.risk_level.includes("MEDIUM")) return "bg-amber-50 border-amber-200 text-amber-800";
        return "bg-rose-50 border-rose-200 text-rose-800";
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

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header Section - Stack on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Manual Risk Assessment
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">
                        Enter customer data to get a pre-delinquency risk prediction
                    </p>
                </div>

                {/* Demo Buttons - Scrollable on mobile */}
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
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
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6">
                {/* Expand/Collapse for mobile */}
                <div className="sm:hidden mb-4">
                    <button
                        onClick={() => setShowAllFields(!showAllFields)}
                        className="text-blue-600 text-sm font-medium"
                    >
                        {showAllFields ? "Show fewer fields" : "Show all fields"}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {/* Basic Info - Always visible */}
                    {renderField("limit_bal", "Limit Balance ($)", { type: "number" })}
                    {renderField("age", "Age", { type: "number", min: 18, max: 100 })}
                    {renderField("sex", "Sex (1 = male, 2 = female)", { type: "number", min: 1, max: 2 })}
                    {renderField("education", "Education (1–6)", { type: "number", min: 1, max: 6 })}
                    {renderField("marriage", "Marriage (1-3)", { type: "number", min: 1, max: 3 })}

                    {/* Conditional rendering based on screen size or expand state */}
                    {(showAllFields || window.innerWidth >= 640) && (
                        <>
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
                        </>
                    )}
                </div>

                {/* Action Buttons - Stack on mobile */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={predict}
                        disabled={loading}
                        className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
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
                        className="px-4 sm:px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition"
                    >
                        Clear Form
                    </button>
                </div>
            </div>

            {/* Error Message - Responsive */}
            {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 sm:p-5 text-rose-800 flex items-start gap-3">
                    <AlertTriangle size={18} sm:size={20} className="mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base">Error</p>
                        <p className="text-xs sm:text-sm mt-1 break-words">{error}</p>
                    </div>
                </div>
            )}

            {/* Result - Responsive */}
            {result && (
                <div className={`rounded-xl border p-4 sm:p-6 ${getRiskStyle()}`}>
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