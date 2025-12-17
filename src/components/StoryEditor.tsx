import { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Card, Button, Select, Input } from './ui';
import { generateId } from '@/utils/helpers';
import { BLANK_TYPES } from '@/types';
import type { Blank } from '@/types';

interface StoryEditorProps {
  story: string;
  blanks: Blank[];
  onStoryChange: (story: string) => void;
  onBlanksChange: (blanks: Blank[]) => void;
}

export function StoryEditor({ story, blanks, onStoryChange, onBlanksChange }: StoryEditorProps) {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [selectedType, setSelectedType] = useState<string>(BLANK_TYPES[0]);
  const [customType, setCustomType] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextSelect = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      setSelection({ start: textarea.selectionStart, end: textarea.selectionEnd });
    }
  };

  const insertBlank = () => {
    const type = selectedType === 'Custom' ? customType : selectedType;
    if (!type) return;

    const blankId = generateId();
    const marker = `[[BLANK:${blankId}:${type}]]`;
    const newStory = story.slice(0, selection.start) + marker + story.slice(selection.end);
    onStoryChange(newStory);

    const newBlanks = [...blanks, { id: blankId, type, index: blanks.length + 1 }];
    onBlanksChange(newBlanks);
  };

  const removeBlank = (blankId: string) => {
    const regex = new RegExp(`\\[\\[BLANK:${blankId}:[^\\]]+\\]\\]`, 'g');
    onStoryChange(story.replace(regex, ''));
    onBlanksChange(
      blanks
        .filter((b) => b.id !== blankId)
        .map((b, i) => ({ ...b, index: i + 1 }))
    );
  };

  const renderPreview = () => {
    let preview = story;
    blanks.forEach((blank, i) => {
      const regex = new RegExp(`\\[\\[BLANK:${blank.id}:[^\\]]+\\]\\]`, 'g');
      preview = preview.replace(
        regex,
        `<span class="bg-orange-400 px-2 py-0.5 rounded font-bold text-sm">(${i + 1}. ${blank.type})</span>`
      );
    });
    return preview;
  };

  const typeOptions = [...BLANK_TYPES, 'Custom'];

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-xl font-bold font-display text-gray-800 mb-4 flex items-center gap-2">
          <span>✏️</span> Story Editor
        </h3>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-600">
            Story Text
          </label>
          <textarea
            ref={textareaRef}
            value={story}
            onChange={(e) => onStoryChange(e.target.value)}
            onSelect={handleTextSelect}
            placeholder="Enter your Mad Libs story here. Then select text and click 'Insert Blank' to create fill-in-the-blank spots."
            rows={10}
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl bg-white text-gray-900 outline-none resize-y leading-relaxed focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-colors"
          />
        </div>

        <div className="flex gap-3 items-end flex-wrap p-4 bg-brand-blue/10 rounded-xl">
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Blank Type"
              value={selectedType}
              onChange={setSelectedType}
              options={typeOptions}
            />
          </div>
          {selectedType === 'Custom' && (
            <div className="flex-1 min-w-[200px]">
              <Input
                label="Custom Type"
                value={customType}
                onChange={setCustomType}
                placeholder="e.g., WGU Team Name"
              />
            </div>
          )}
          <Button onClick={insertBlank} variant="accent" icon={<Plus className="w-4 h-4" />}>
            Insert Blank
          </Button>
        </div>
      </Card>

      {blanks.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold font-display text-gray-800 mb-4">
            📋 Blanks List ({blanks.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {blanks.map((blank, i) => (
              <div
                key={blank.id}
                className="inline-flex items-center gap-2 px-3 py-2 bg-brand-blue/10 rounded-lg"
              >
                <span className="font-bold text-brand-blue">{i + 1}.</span>
                <span className="text-gray-700">{blank.type}</span>
                <button
                  onClick={() => removeBlank(blank.id)}
                  className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-xl font-bold font-display text-gray-800 mb-4">
          👀 Preview
        </h3>
        <div
          className="p-5 bg-gray-100 rounded-xl leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: renderPreview() }}
        />
      </Card>
    </div>
  );
}
