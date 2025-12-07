import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { FeatureCard } from '@/components/FeatureCard';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import { 
  Leaf, Mountain, Cloud, Bug, Wheat, TrendingUp, FileText, 
  Home, ArrowLeft, Camera, Microscope 
} from 'lucide-react';

type Message = { text: string; isUser: boolean };

const Dashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    setMessages([{ text: t('ai_greeting'), isUser: false }]);
  }, [t]);

  const features = [
    { id: 'pest', icon: Bug, title: t('feature_pest'), desc: t('feature_pest_desc'), hasCamera: true },
    { id: 'soil', icon: Mountain, title: t('feature_soil'), desc: t('feature_soil_desc'), hasCamera: true },
    { id: 'disease', icon: Microscope, title: 'Disease Detection', desc: 'Identify plant diseases from photos', hasCamera: true },
    { id: 'weather', icon: Cloud, title: t('feature_weather'), desc: t('feature_weather_desc'), hasCamera: false },
    { id: 'crop', icon: Wheat, title: t('feature_crop'), desc: t('feature_crop_desc'), hasCamera: false },
    { id: 'market', icon: TrendingUp, title: t('feature_market'), desc: t('feature_market_desc'), hasCamera: false },
    { id: 'schemes', icon: FileText, title: t('feature_schemes'), desc: t('feature_schemes_desc'), hasCamera: false },
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    setActiveFeature(feature.id);
    setShowUploader(feature.hasCamera);
    
    const greetings: Record<string, Record<string, string>> = {
      pest: {
        en: "I can help identify pests in your crops. Take or upload a photo of the affected area, and I'll analyze it for you!",
        hi: "मैं आपकी फसलों में कीटों की पहचान करने में मदद कर सकता हूं। प्रभावित क्षेत्र की फोटो लें या अपलोड करें!",
        te: "మీ పంటలలో పురుగులను గుర్తించడంలో నేను సహాయం చేయగలను. ప్రభావిత ప్రాంతం యొక్క ఫోటో తీయండి!",
      },
      soil: {
        en: "Let me analyze your soil! Take a photo of a soil sample, and I'll tell you about its health and what crops suit it best.",
        hi: "मुझे अपनी मिट्टी का विश्लेषण करने दें! मिट्टी के नमूने की फोटो लें!",
        te: "మీ నేలను విశ్లేషించనివ్వండి! నేల నమూనా యొక్క ఫోటో తీయండి!",
      },
      disease: {
        en: "I can identify plant diseases. Upload a clear photo of the affected leaves, stems, or fruits for diagnosis!",
        hi: "मैं पौधों की बीमारियों की पहचान कर सकता हूं। प्रभावित पत्तियों की स्पष्ट फोटो अपलोड करें!",
        te: "మొక్కల వ్యాధులను గుర్తించగలను. ప్రభావిత ఆకుల స్పష్టమైన ఫోటో అప్‌లోడ్ చేయండి!",
      },
    };

    const greeting = greetings[feature.id]?.[language] || greetings[feature.id]?.en || t('ai_greeting');
    setMessages([{ text: greeting, isUser: false }]);
  };

  const handleAnalysisComplete = (analysis: string) => {
    setMessages(prev => [...prev, { text: analysis, isUser: false }]);
    setShowUploader(false);
  };

  const handleSend = (message: string) => {
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: `I understand you're asking about "${message}". As your Digital Co-Farmer, I'm here to help! Let me provide guidance...`, 
        isUser: false 
      }]);
    }, 1000);
  };

  const handleBack = () => {
    setActiveFeature(null);
    setShowUploader(false);
    setMessages([{ text: t('ai_greeting'), isUser: false }]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          {activeFeature && (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">{t('app_name')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Home className="w-5 h-5" />
          </Button>
          <LanguageSelector />
        </div>
      </header>

      {!activeFeature ? (
        <div className="flex-1 p-4 overflow-auto">
          <div className="mb-6">
            <ChatMessage message={messages[0]?.text || t('ai_greeting')} isUser={false} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.id} className="relative">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.desc}
                  onClick={() => handleFeatureClick(feature)}
                />
                {feature.hasCamera && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5">
                    <Camera className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-auto space-y-4">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg.text} isUser={msg.isUser} />
            ))}
            
            {showUploader && (activeFeature === 'pest' || activeFeature === 'soil' || activeFeature === 'disease') && (
              <div className="bg-card rounded-2xl p-4 border border-border shadow-soft">
                <ImageUploader
                  analysisType={activeFeature as 'pest' | 'soil' | 'disease'}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              </div>
            )}
          </div>
          <ChatInput onSend={handleSend} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
