import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { FeatureCard } from '@/components/FeatureCard';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { Button } from '@/components/ui/button';
import { Leaf, Mountain, Cloud, Bug, Wheat, TrendingUp, FileText, Home, ArrowLeft } from 'lucide-react';

type Message = { text: string; isUser: boolean };

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  useEffect(() => {
    setMessages([{ text: t('ai_greeting'), isUser: false }]);
  }, [t]);

  const features = [
    { id: 'soil', icon: Mountain, title: t('feature_soil'), desc: t('feature_soil_desc') },
    { id: 'weather', icon: Cloud, title: t('feature_weather'), desc: t('feature_weather_desc') },
    { id: 'pest', icon: Bug, title: t('feature_pest'), desc: t('feature_pest_desc') },
    { id: 'crop', icon: Wheat, title: t('feature_crop'), desc: t('feature_crop_desc') },
    { id: 'market', icon: TrendingUp, title: t('feature_market'), desc: t('feature_market_desc') },
    { id: 'schemes', icon: FileText, title: t('feature_schemes'), desc: t('feature_schemes_desc') },
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    setActiveFeature(feature.id);
    const greeting = `${t('ai_greeting')} ${feature.title}`;
    setMessages([{ text: greeting, isUser: false }]);
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {activeFeature && (
            <Button variant="ghost" size="icon" onClick={() => setActiveFeature(null)}>
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
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.desc}
                onClick={() => handleFeatureClick(feature)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-auto space-y-4">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg.text} isUser={msg.isUser} />
            ))}
          </div>
          <ChatInput onSend={handleSend} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
