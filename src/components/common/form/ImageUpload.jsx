import { ImagePlus, User } from 'lucide-react';
import { useState } from 'react';
import { IMAGE_RULES } from '@/lib/constants';
import { readImageFile } from '@/lib/image';

// Sélection d'image avec aperçu ; renvoie une data URL validée
export function ImageUpload({
  id = 'image',
  label,
  value,
  onChange,
  placeholder: Placeholder = User,
}) {
  const [error, setError] = useState('');

  const handleFile = async (event) => {
    setError('');
    try {
      onChange(await readImageFile(event.target.files?.[0]));
    } catch (err) {
      setError(err.message);
    }
    event.target.value = '';
  };

  return (
    <div className="image-upload">
      {label && <p className="field__label">{label}</p>}
      <div className="image-upload__row">
        <div className="image-upload__preview">
          {value ? <img src={value} alt="Aperçu" /> : <Placeholder aria-hidden="true" />}
        </div>
        <label htmlFor={id} className="image-upload__button">
          <ImagePlus aria-hidden="true" />
          Choisir une image
        </label>
        <input
          id={id}
          type="file"
          accept={IMAGE_RULES.types.join(',')}
          onChange={handleFile}
          className="sr-only"
        />
      </div>
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
