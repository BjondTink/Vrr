import React, { useState, useCallback, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { Upload, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { flexibleDb } from '../lib/flexibleDatabase';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  currentImage?: string;
}

const PRESET_IMAGES = [
  { name: "Paris Runway", url: "https://images.unsplash.com/photo-1509631179647-017733150396?auto=format&fit=crop&q=80&w=1200" },
  { name: "Minimalist Coat", url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200" },
  { name: "Silk Elegance", url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200" },
  { name: "Autumn Trench", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" },
  { name: "Studio White", url: "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200" },
  { name: "Raw Linen", url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1200" },
  { name: "Accessories Leather", url: "https://images.unsplash.com/photo-1618333230677-6c30ce0f6244?auto=format&fit=crop&q=80&w=1200" },
  { name: "Draped Silk", url: "https://images.unsplash.com/photo-1544022613-e87ca7fdad78?auto=format&fit=crop&q=80&w=1200" },
];

const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // High compatibility compressed JPEG format
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const dataURLtoFile = (dataurl: string, filename: string): File | Blob => {
  try {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const baseName = filename.substring(0, filename.lastIndexOf('.')) || filename;
    try {
      return new File([u8arr], `${baseName}_compressed.jpg`, { type: mime });
    } catch (e) {
      const blob = new Blob([u8arr], { type: mime });
      Object.defineProperty(blob, 'name', {
        value: `${baseName}_compressed.jpg`,
        writable: true
      });
      return blob;
    }
  } catch (err) {
    console.error("dataURLtoFile failed:", err);
    throw err;
  }
};

export default function ImageUpload({ onUpload, label, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [cloudinaryConfig, setCloudinaryConfig] = useState<{ cloudName?: string, preset?: string }>({});

  useEffect(() => {
    const unsub = flexibleDb.subscribeToDoc("settings", "global", (data) => {
      if (data) {
        setCloudinaryConfig({
          cloudName: data.cloudinaryCloudName || '',
          preset: data.cloudinaryUploadPreset || ''
        });
      }
    });
    return unsub;
  }, []);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const origFile = e.target.files?.[0];
    if (!origFile) return;

    setUploading(true);
    setProgress(10);
    
    // Generate a Base64 string from the original file as an ultimate local fallback
    let fallbackBase64 = "";
    try {
      fallbackBase64 = await convertToBase64(origFile);
    } catch (err) {
      console.warn("Base64 preparation fallback failed:", err);
    }

    const performUpload = (fileToUpload: File | Blob) => {
      const triggerFirebaseUpload = () => {
        const fileName = (fileToUpload as any).name || `image_${Date.now()}.jpg`;
        const storageRef = ref(storage, `images/${Date.now()}_${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(Math.max(10, p));
          },
          async (error) => {
            console.warn("Firebase Storage upload failed, falling back to Base64:", error);
            if (fallbackBase64) {
              onUpload(fallbackBase64);
            } else {
              alert("Image upload failed. Please try again.");
            }
            setUploading(false);
            setProgress(0);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              onUpload(downloadURL);
            } catch (err) {
              console.warn("Failed to get download URL, falling back to Base64:", err);
              if (fallbackBase64) onUpload(fallbackBase64);
            }
            setUploading(false);
            setProgress(0);
          }
        );
      };

      // Check if Cloudinary is configured
      if (cloudinaryConfig.cloudName && cloudinaryConfig.preset) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, true);

        xhr.upload.addEventListener('progress', (ev) => {
          if (ev.lengthComputable) {
            const p = (ev.loaded / ev.total) * 100;
            setProgress(Math.max(10, p));
          }
        });

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 201) {
            try {
              const resp = JSON.parse(xhr.responseText);
              if (resp.secure_url || resp.url) {
                onUpload(resp.secure_url || resp.url);
                setUploading(false);
                setProgress(0);
                return;
              }
            } catch (err) {
              console.error("Failed to parse Cloudinary response:", err);
            }
          }
          console.warn("Cloudinary upload failed with status:", xhr.status, ", falling back to Firebase Storage.");
          triggerFirebaseUpload();
        };

        xhr.onerror = () => {
          console.warn("Cloudinary Upload connection failed, falling back to Firebase Storage.");
          triggerFirebaseUpload();
        };

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('upload_preset', cloudinaryConfig.preset);
        xhr.send(formData);
      } else {
        triggerFirebaseUpload();
      }
    };

    try {
      // 1. Client-side compress before doing anything to minimize transmission size and base64 memory impact
      const base64Url = await compressImage(origFile);
      const file = dataURLtoFile(base64Url, origFile.name);
      performUpload(file);
    } catch (compressErr) {
      console.warn("Image pre-compression failed, uploading original raw file instead:", compressErr);
      performUpload(origFile);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.startsWith('http')) {
      onUpload(urlInput);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">{label}</label>}
      
      <div className="flex flex-col gap-4">
        {currentImage && (
          <div className="relative group w-full h-40 bg-black/5 rounded-xl overflow-hidden border border-black/5">
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
               <button onClick={() => onUpload('')} className="p-2 bg-white rounded-full text-red-500 shadow-xl"><X size={16}/></button>
            </div>
          </div>
        )}

        {/* Curated Preset Grid */}
        <div className="space-y-2 bg-[#F6F5F4] p-3 rounded-xl border border-black/5">
          <p className="text-[9px] uppercase tracking-widest font-bold text-black/40">Select Premium Preset</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {PRESET_IMAGES.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onUpload(img.url)}
                className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${currentImage === img.url ? 'border-studio-accent ring-2 ring-studio-accent/20 scale-95' : 'border-transparent hover:scale-105'}`}
                title={img.name}
              >
                <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <label className="flex-grow border-2 border-dashed border-black/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-studio-accent hover:bg-studio-accent/5 transition-all cursor-pointer">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={24} className="animate-spin text-studio-accent" />
                <span className="text-[9px] font-bold uppercase tracking-widest">{Math.round(progress)}% Uploading...</span>
              </div>
            ) : (
              <>
                <Upload size={20} className="text-black/20" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Upload Custom File</span>
              </>
            )}
            <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          </label>

          <button 
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-6 border border-black/10 rounded-xl flex items-center justify-center hover:bg-black/5 transition-all"
          >
            <LinkIcon size={20} className="text-black/40" />
          </button>
        </div>

        {showUrlInput && (
          <div className="flex gap-2 animate-in slide-in-from-top-2">
             <input 
              type="text" 
              placeholder="Paste Image URL..." 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 bg-black/5 p-3 text-xs rounded-lg focus:outline-studio-accent"
             />
             <button 
              type="button"
              onClick={handleUrlSubmit}
              className="bg-studio-black text-white px-4 rounded-lg text-[10px] uppercase font-bold"
             >
                Add
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
