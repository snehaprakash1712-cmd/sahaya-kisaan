import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ChatMessage } from '@/components/ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Leaf, ArrowRight } from 'lucide-react';

type Step = 'name' | 'phone' | 'passcode' | 'success';

const Register = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');

  const getPrompt = () => {
    switch (step) {
      case 'name': return t('registration_welcome');
      case 'phone': return t('registration_phone');
      case 'passcode': return t('registration_passcode');
      case 'success': return t('registration_success');
    }
  };

  const handleContinue = () => {
    if (step === 'name' && name.trim()) {
      setStep('phone');
    } else if (step === 'phone' && phone.length === 10) {
      setStep('passcode');
    } else if (step === 'passcode' && passcode.length === 4) {
      localStorage.setItem('userProfile', JSON.stringify({ name, phone, passcode }));
      setStep('success');
    } else if (step === 'success') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">{t('app_name')}</span>
        </div>
        <LanguageSelector />
      </header>

      <div className="flex-1 flex flex-col justify-center p-6 max-w-md mx-auto w-full">
        <ChatMessage message={getPrompt()} isUser={false} showSpeaker={true} />

        <div className="mt-6 space-y-4">
          {step === 'name' && (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('registration_name_placeholder')}
              className="text-lg py-6"
            />
          )}
          {step === 'phone' && (
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder={t('registration_phone_placeholder')}
              type="tel"
              className="text-lg py-6"
            />
          )}
          {step === 'passcode' && (
            <Input
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder={t('registration_passcode_placeholder')}
              type="password"
              maxLength={4}
              className="text-lg py-6 text-center tracking-widest"
            />
          )}

          <Button variant="hero" className="w-full" onClick={handleContinue}>
            {step === 'success' ? t('get_started') : t('continue')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
