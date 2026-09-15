import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  maxWidth?: number;
  maxHeight?: number;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  maxWidth = 800,
  maxHeight = 800
}) => {
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImage(file, maxWidth, maxHeight, 0.7);
      onChange(compressedDataUrl);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Failed to compress and load the image.');
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-300">{label}</label>
      
      {/* Drag/Drop & File Input Area */}
      <div className="relative border-2 border-dashed border-slate-700 hover:border-teal-400/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-colors bg-slate-950/50 overflow-hidden">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title="Click or drag to upload image"
        />
        {isCompressing ? (
          <div className="py-6 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin mb-2" />
            <span className="text-[10px] text-teal-400 font-mono">COMPRESSING...</span>
          </div>
        ) : value ? (
          <div className="w-full relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            <img 
              src={value} 
              alt="Preview" 
              className="max-h-32 w-auto mx-auto object-contain" 
            />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
               <span className="text-xs font-bold text-white flex items-center space-x-1 bg-slate-900/80 px-3 py-1.5 rounded-lg backdrop-blur-md">
                 <UploadCloud className="w-4 h-4" />
                 <span>Click to Change</span>
               </span>
            </div>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
              <UploadCloud className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-300 block">Click or drag image to upload</span>
              <span className="text-[9px] text-slate-500 font-mono block mt-0.5">JPG, PNG, WEBP</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
