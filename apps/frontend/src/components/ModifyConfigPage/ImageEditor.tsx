import type {Image} from "@/api";
import React, { useState, useRef } from "react";
import styles from "@/styles/ModifyConfigPage/ImageEditor.module.css";

type ImageEditorProps = {
  image?: Image;
  onChange: (image?: Image, file?: File) => void;
  label: string;
  compact?: boolean;
}

export function ImageEditor({ image, onChange, label, compact = false }: ImageEditorProps) {
  const [isExpanded, setIsExpanded] = useState(!!image?.url);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compactFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    const fileName = file.name.split('.')[0];
    const autoAlt = fileName.replace(/[-_]/g, ' ');

    onChange({
      url: imageUrl,
      alt: autoAlt
    }, file);
  };

  const handleRemoveImage = () => {
    onChange(undefined, undefined);
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

  if (compact) {
    return (
      <div className={styles.imageEditorCompact}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.toggleButton}
        >
          <span className={styles.toggleText}>
            {image?.url ? 'Imagen agregada' : 'Agregar imagen (opcional)'}
          </span>
          <span className={`${styles.arrow} ${isExpanded ? styles.arrowExpanded : ''}`}>▼</span>
        </button>

        {isExpanded && (
          <div className={styles.compactContent}>
            {image?.url ? (
              <div className={styles.imagePreviewWrapper}>
                <img src={image.url} alt={image.alt || ''} className={styles.previewImage} />
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

  return(
    <div className={styles.imageEditor}>
      {label && <label className={styles.label}>{label}</label>}

      {image?.url ? (
        <div className={styles.imagePreviewWrapper}>
          <img src={image.url} alt={image.alt || ''} className={styles.preview} />
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
  )
}