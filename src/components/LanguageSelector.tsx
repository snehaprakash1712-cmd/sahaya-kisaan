import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as typeof language)}>
      <SelectTrigger className="w-auto min-w-[140px] bg-card border-border">
        <Globe className="w-4 h-4 mr-2 text-primary" />
        <SelectValue placeholder={t('select_language')} />
      </SelectTrigger>
      <SelectContent className="bg-card border-border z-50">
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
            <span className="font-medium">{lang.nativeName}</span>
            <span className="text-muted-foreground ml-2 text-sm">({lang.name})</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
