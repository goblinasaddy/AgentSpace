/**
 * @fileOverview Component for secure API key entry during agent runs.
 */
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Key className="h-3 w-3" />
        API Key (Optional for demo)
      </Label>
      <Input
        type="password"
        placeholder="sk-..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-muted/30 border-none h-9 text-xs"
      />
      <p className="text-[10px] text-muted-foreground italic">
        Your key is used only for this session and never stored.
      </p>
    </div>
  );
}
