import type { ImageState } from "@/utils/imageCollector.ts";
import React, { useState, useRef } from "react";
import styles from "@/styles/ModifyConfigPage/ImageEditor.module.css";

type ImageEditorProps = {
  image?: ImageState | null;
  onChange: (imageState: ImageState) => void;
  label: string;
  compact?: boolean;
}

export function ImageEditor({ image, onChange, label, compact = false }: ImageEditorProps) {
  const hasImage = image && image.type !== 'deleted';
  const [isExpanded, setIsExpanded] = useState(!!hasImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compactFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      return image.value?.url || null;
    }

    if (image.type === 'new') {
      return URL.createObjectURL(image.value);
    }

    return null;
  };

  const previewUrl = getPreviewUrl();
  const altText = image?.type === 'unchanged' ? image.value?.alt : '';

  if (compact) {
    return (
      <div className={styles.imageEditorCompact}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.toggleButton}
        >
          <span className={styles.toggleText}>
            {previewUrl ? 'Imagen agregada' : 'Agregar imagen (opcional)'}
          </span>
          <span className={`${styles.arrow} ${isExpanded ? styles.arrowExpanded : ''}`}>▼</span>
        </button>

        {isExpanded && (
          <div className={styles.compactContent}>
            {previewUrl ? (
              <div className={styles.imagePreviewWrapper}>
                <img src={previewUrl} alt={altText || ''} className={styles.previewImage} />
                <div className={styles.imageOverlay}>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className={styles.changeButton}
                  >
                    Cambiar
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className={styles.removeButton}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={triggerFileInput}
                className={styles.uploadButton}
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
    <div className={styles.imageEditor}>
      {label && <label className={styles.label}>{label}</label>}

      {previewUrl ? (
        <div className={styles.imagePreviewWrapper}>
          <img src={previewUrl} alt={altText || ''} className={styles.preview} />
          <div className={styles.imageOverlay}>
            <button
              type="button"
              onClick={triggerFileInput}
              className={styles.changeButton}
            >
              Cambiar imagen
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className={styles.removeButton}
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.uploadArea} onClick={triggerFileInput}>
          <div className={styles.uploadContent}>
            <span className={styles.uploadText}>Click para subir imagen</span>
            <span className={styles.uploadHint}>PNG, JPG, GIF hasta 10MB</span>
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
