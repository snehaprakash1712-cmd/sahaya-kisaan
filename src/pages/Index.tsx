import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { FeatureCard } from '@/components/FeatureCard';
import { Button } from '@/components/ui/button';
import { Leaf, Sun, Users, ArrowRight, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-farming.png';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">{t('app_name')}</span>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
                <Sparkles className="w-4 h-4" />
                {t('tagline')}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up animation-delay-200">
                {t('home_title')}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-400">
                {t('home_subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-600">
                <Button variant="hero" size="xl" onClick={() => navigate('/register')}>
                  {t('get_started')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="heroOutline" size="xl" onClick={() => navigate('/dashboard')}>
                  {t('learn_more')}
                </Button>
              </div>
            </div>
            
            <div className="flex-1 animate-float">
              <img 
                src={heroImage} 
                alt="AI Farming Assistant" 
                className="w-full max-w-lg mx-auto rounded-3xl shadow-card"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Leaf}
              title={t('feature_1_title')}
              description={t('feature_1_desc')}
              iconColor="text-primary"
              className="animate-fade-in-up"
            />
            <FeatureCard
              icon={Sun}
              title={t('feature_2_title')}
              description={t('feature_2_desc')}
              iconColor="text-secondary"
              className="animate-fade-in-up animation-delay-200"
            />
            <FeatureCard
              icon={Users}
              title={t('feature_3_title')}
              description={t('feature_3_desc')}
              iconColor="text-primary"
              className="animate-fade-in-up animation-delay-400"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
