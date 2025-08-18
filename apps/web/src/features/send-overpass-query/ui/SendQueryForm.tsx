'use client';

import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ChevronDown, Loader2, Send } from 'lucide-react';
import { useState } from 'react';

type Props = {
  text: string;
  radius: number;
  onTextChange: (value: string) => void;
  onRadiusChange: (value: number) => void;
  onSubmit: () => void;
  loading?: boolean;
};

export const SendQueryForm = ({
  text,
  radius,
  onTextChange,
  onRadiusChange,
  onSubmit,
  loading,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-[9999]">
      <div className="bg-white shadow-lg rounded-2xl p-3 flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <Textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Enter query..."
            className="resize-none min-h-[50px] flex-1"
          />
          <Button
            onClick={onSubmit}
            size="icon"
            disabled={loading}
            className="h-[50px] w-[50px] cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" /> // icon from lucide-react
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Toggle */}
        <button
          className="flex items-center text-sm text-gray-600 gap-1 select-none"
          onClick={() => setOpen((prev) => !prev)}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
          />
          Advance
        </button>

        {/* Accordion Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            open ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-1 flex gap-2">
            <Input
              type="number"
              placeholder="Radius in meters"
              value={radius}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
