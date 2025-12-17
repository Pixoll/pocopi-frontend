import type { ImageState } from "@/utils/imageCollector.ts";
import React, { useState, useRef } from "react";
import styles from "@/styles/ModifyConfigPage/ImageEditor.module.css";
import {useTheme} from "@/hooks/useTheme.ts";

type ImageEditorProps = {
  image?: ImageState | null;
  onChange: (imageState:  ImageState) => void;
  label: string;
  compact?:  boolean;
}

export function ImageEditor({ image, onChange, label, compact = false }: ImageEditorProps) {
  const {isDarkMode} = useTheme();
  const hasImage = image && image.type !== 'deleted';
  const [isExpanded, setIsExpanded] = useState(!!hasImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compactFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange({
      type: 'new',
      value: file
    });

    if (compact && !isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleRemoveImage = () => {
    if (image?.type === 'unchanged' && image.value) {
      onChange({ type: 'deleted' });
    } else {
      onChange({ type: 'unchanged', value: undefined });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (compactFileInputRef.current) compactFileInputRef.current.value = '';
    if (compact) setIsExpanded(false);
  };

  const triggerFileInput = () => {
    if (compact) {
      compactFileInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const getPreviewUrl = (): string | null => {
    if (!image || image.type === 'deleted') return null;

    if (image.type === 'unchanged') {
      return image.value?. url || null;
    }

    if (image.type === 'new') {
      return URL.createObjectURL(image.value);
    }

    return null;
  };

  const previewUrl = getPreviewUrl();
  const altText = image?. type === 'unchanged' ? image.value?.alt : '';

  if (compact) {
    return (
      <div className={`${styles.imageEditorCompact} ${isDarkMode ? '' : styles.imageEditorCompactLight}`}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${styles.toggleButton} ${isDarkMode ? '' : styles.toggleButtonLight}`}
        >
          <span className={`${styles.toggleText} ${isDarkMode ? '' : styles.toggleTextLight}`}>
            {previewUrl ? 'Imagen agregada' : 'Agregar imagen (opcional)'}
          </span>
          <span className={`${styles.arrow} ${isExpanded ? styles.arrowExpanded : ''} ${isDarkMode ? '' : styles.arrowLight}`}>▼</span>
        </button>

        {isExpanded && (
          <div className={`${styles.compactContent} ${isDarkMode ? '' : styles.compactContentLight}`}>
            {previewUrl ?  (
              <div className={`${styles.imagePreviewWrapper} ${isDarkMode ? '' : styles.imagePreviewWrapperLight}`}>
                <img src={previewUrl} alt={altText || ''} className={styles.previewImage} />
                <div className={styles.imageOverlay}>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className={`${styles.changeButton} ${isDarkMode ? '' : styles.changeButtonLight}`}
                  >
                    Cambiar
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className={`${styles.removeButton} ${isDarkMode ? '' : styles.removeButtonLight}`}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={triggerFileInput}
                className={`${styles.uploadButton} ${isDarkMode ? '' : styles. uploadButtonLight}`}
              >
                + Subir imagen
              </button>
            )}
            <input
              ref={compactFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.imageEditor} ${isDarkMode ? '' : styles.imageEditorLight}`}>
      {label && <label className={`${styles.label} ${isDarkMode ? '' : styles.labelLight}`}>{label}</label>}

      {previewUrl ? (
        <div className={`${styles.imagePreviewWrapper} ${isDarkMode ? '' : styles.imagePreviewWrapperLight}`}>
          <img src={previewUrl} alt={altText || ''} className={styles.preview} />
          <div className={styles.imageOverlay}>
            <button
              type="button"
              onClick={triggerFileInput}
              className={`${styles.changeButton} ${isDarkMode ?  '' : styles.changeButtonLight}`}
            >
              Cambiar imagen
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className={`${styles.removeButton} ${isDarkMode ? '' : styles.removeButtonLight}`}
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div className={`${styles.uploadArea} ${isDarkMode ? '' : styles.uploadAreaLight}`} onClick={triggerFileInput}>
          <div className={styles.uploadContent}>
            <span className={`${styles.uploadText} ${isDarkMode ? '' :  styles.uploadTextLight}`}>Click para subir imagen</span>
            <span className={`${styles.uploadHint} ${isDarkMode ? '' : styles.uploadHintLight}`}>PNG, JPG, GIF hasta 10MB</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />
    </div>
  );
}
