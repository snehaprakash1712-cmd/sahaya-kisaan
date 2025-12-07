import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const { t } = useLanguage();
  const { isListening, startListening, stopListening } = useSpeech();

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(
        (text) => {
          setMessage((prev) => prev + (prev ? ' ' : '') + text);
        },
        (error) => {
          console.error('Speech error:', error);
        }
      );
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-card border-t border-border">
      <Button
        variant={isListening ? 'micActive' : 'mic'}
        size="icon"
        onClick={handleMicClick}
        disabled={disabled}
        className={cn('flex-shrink-0', isListening && 'animate-pulse')}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>

      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isListening ? t('listening') : t('type_message')}
          disabled={disabled || isListening}
          className="pr-12 bg-background border-border focus:ring-primary"
        />
      </div>

      <Button
        variant="default"
        size="icon"
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="flex-shrink-0"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
};
