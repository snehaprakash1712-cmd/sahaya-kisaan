import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, User, Bot } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  showSpeaker?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isUser,
  showSpeaker = true,
}) => {
  const { speak, stopSpeaking, isSpeaking } = useSpeech();
  const [isThisMessageSpeaking, setIsThisMessageSpeaking] = React.useState(false);

  const handleSpeak = () => {
    if (isThisMessageSpeaking) {
      stopSpeaking();
      setIsThisMessageSpeaking(false);
    } else {
      speak(message, () => setIsThisMessageSpeaking(false));
      setIsThisMessageSpeaking(true);
    }
  };

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in-up',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-accent text-primary'
        )}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      <div className="flex flex-col gap-2 max-w-[80%]">
        <div
          className={cn(
            'rounded-2xl px-4 py-3 shadow-soft',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-card text-foreground border border-border/50 rounded-tl-sm'
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>

        {!isUser && showSpeaker && (
          <Button
            variant={isThisMessageSpeaking ? 'speakerActive' : 'speaker'}
            size="icon"
            onClick={handleSpeak}
            className="w-8 h-8 self-start"
          >
            {isThisMessageSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
