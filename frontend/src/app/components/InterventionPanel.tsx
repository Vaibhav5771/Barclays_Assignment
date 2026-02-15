import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AlertCircle, PhoneCall, CalendarClock, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { InterventionRecommendation } from '../data/mockData';

interface InterventionPanelProps {
  recommendations: InterventionRecommendation[];
  onApprove?: (intervention: InterventionRecommendation) => void;
  onExecute?: (intervention: InterventionRecommendation) => void;
}

export function InterventionPanel({ recommendations, onApprove, onExecute }: InterventionPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'proactive_outreach': return PhoneCall;
      case 'payment_holiday': return CalendarClock;
      case 'reminder': return MessageSquare;
      case 'credit_counseling': return FileText;
      case 'restructure': return FileText;
      default: return AlertCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const formatInterventionType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Recommended Interventions</h3>
        <p className="text-sm text-slate-600 mt-1">AI-generated actions to prevent delinquency</p>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = getIcon(rec.type);
          
          return (
            <Card key={index} className="p-4 border-l-4" style={{
              borderLeftColor: rec.priority === 'high' ? '#DC2626' : rec.priority === 'medium' ? '#F59E0B' : '#3B82F6'
            }}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${rec.priority === 'high' ? 'bg-red-50' : rec.priority === 'medium' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                  <Icon className={rec.priority === 'high' ? 'text-red-600' : rec.priority === 'medium' ? 'text-amber-600' : 'text-blue-600'} size={20} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">{formatInterventionType(rec.type)}</h4>
                    <Badge variant="outline" className={`${getPriorityColor(rec.priority)} border text-xs`}>
                      {rec.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-700">{rec.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-slate-600">Expected Impact: <span className="font-medium text-slate-900">{rec.expectedImpact}</span></span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    {rec.requiresApproval ? (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => onApprove?.(rec)}
                          className="bg-slate-900 hover:bg-slate-800"
                        >
                          Submit for Approval
                        </Button>
                        <span className="text-xs text-slate-500">Requires manager approval</span>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm"
                          onClick={() => onExecute?.(rec)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Execute Now
                        </Button>
                        <span className="text-xs text-slate-500">Auto-approved</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
