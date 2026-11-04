import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { SAMPLE_PRESETS } from '../../services/foodAnalysisService';

interface ImageUploaderProps {
  onImageSelected: (base64: string, description: string, fileName?: string) => void;
  isLoading: boolean;
  onSelectSamplePreset: (presetId: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isLoading,
  onSelectSamplePreset,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size is too large. Maximum supported size is 5MB.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyzeClick = () => {
    if (!previewUrl) return;
    onImageSelected(previewUrl, description, fileName);
  };

  return (
    <div className="bg-white rounded-2xl border border-charcoal-200 p-6 shadow-soft-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-forest-600" />
            <span>Upload Meal Photo</span>
          </h3>
          <p className="text-xs text-charcoal-500">
            Take a picture of your canteen tray or choose a sample meal
          </p>
        </div>
        <Badge variant="forest" size="sm">
          Vision Engine
        </Badge>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          previewUrl
            ? 'border-forest-400 bg-forest-50/20'
            : 'border-charcoal-300 hover:border-forest-500 hover:bg-cream-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="space-y-3">
            <div className="relative inline-block max-h-64 rounded-xl overflow-hidden border border-charcoal-200 shadow-soft-sm">
              <img
                src={previewUrl}
                alt="Meal Preview"
                className="max-h-64 object-contain mx-auto"
              />
            </div>
            <div className="text-xs text-charcoal-600 font-semibold">
              {fileName || 'Photo Selected'} • Click to choose another photo
            </div>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            <div className="w-14 h-14 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center mx-auto shadow-soft-sm">
              <Upload className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-sm font-bold text-charcoal-800">
                Click or drag & drop meal photo here
              </p>
              <p className="text-xs text-charcoal-400 mt-0.5">Supports JPG, PNG, WEBP up to 5MB</p>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Optional Description Input */}
      <div>
        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
          Optional Description / Canteen Context
        </label>
        <input
          type="text"
          placeholder="e.g. Lunch thali from block 3 canteen with extra dal and 2 rotis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 placeholder:text-charcoal-400"
        />
      </div>

      {/* Submit analyze button */}
      {previewUrl && (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleAnalyzeClick}
          isLoading={isLoading}
          icon={<Sparkles className="w-4 h-4 text-limeAccent-400" />}
        >
          {isLoading ? 'Analyzing Plate with AI...' : 'Analyze Plate Nutrition'}
        </Button>
      )}

      {/* Sample presets for presentation / zero-friction demo */}
      <div className="pt-4 border-t border-charcoal-100">
        <div className="text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Or Test Sample Canteen Photos (Instant Demo)</span>
          <Badge variant="lime" size="sm">
            Instant Test
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectSamplePreset(preset.id)}
              className="p-3 rounded-xl border border-charcoal-200 bg-cream-50 hover:bg-cream-100 hover:border-forest-400 text-left transition-all group"
            >
              <div className="text-xs font-bold text-charcoal-900 group-hover:text-forest-700">
                {preset.label}
              </div>
              <div className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
