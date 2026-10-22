import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { TextField } from '@/components/common/form/TextField';

export function PasswordField({ icon = Lock, ...props }) {
  const [visible, setVisible] = useState(false);
  const Toggle = visible ? EyeOff : Eye;

  return (
    <TextField
      {...props}
      icon={icon}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          className="field__toggle"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          <Toggle aria-hidden="true" />
        </button>
      }
    />
  );
}
