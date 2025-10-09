import type {Image} from "@/api";
import { useState } from "react";
import styles from "@/styles/ModifyConfigPage/ImageEditor.module.css";

type ImageEditorProps = {
  image?: Image;
  onChange: (image?: Image) => void;
  label: string;
  compact?: boolean;
}

export function ImageEditor({ image, onChange, label, compact = false }: ImageEditorProps) {
  const [isExpanded, setIsExpanded] = useState(!!image?.url);

  if (compact) {
    return (
      <div className={styles.imageEditorCompact}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.toggleButton}
        >
          <span className={styles.icon}>{image?.url}</span>
          <span className={styles.toggleText}>
            {image?.url ? 'Imagen agregada' : 'Agregar imagen (opcional)'}
          </span>
          <span className={styles.arrow}>{isExpanded ? '▼' : '▶'}</span>
        </button>

        {isExpanded && (
          <div className={styles.compactContent}>
            {image?.url && (
              <div className={styles.miniPreview}>
                <img src={image.url} alt={image.alt || ''} className={styles.previewImage} />
              </div>
            )}
            <input
              type="text"
              placeholder="URL de la imagen"
              value={image?.url || ''}
              onChange={(e) => onChange({
                url: e.target.value,
                alt: image?.alt || ''
              })}
              className={styles.compactInput}
            />
            <input
              type="text"
              placeholder="Texto alternativo"
              value={image?.alt || ''}
              onChange={(e) => onChange({
                url: image?.url || '',
                alt: e.target.value
              })}
              className={styles.compactInput}
            />
            {image?.url && (
              <button
                type="button"
                onClick={() => {
                  onChange(undefined);
                  setIsExpanded(false);
                }}
                className={styles.compactRemoveButton}
              >
                Eliminar imagen
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return(
    <div className={styles.imageEditor}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.imagePreview}>
        {image?.url ? (
          <img src={image.url} alt={image.alt || ''} className={styles.preview} />
        ) : (
          <div className={styles.emptyImage}>Sin imagen</div>
        )}
      </div>
      <input
        type="text"
        placeholder="URL de la imagen"
        value={image?.url || ''}
        onChange={(e) => onChange({
          url: e.target.value,
          alt: image?.alt || ''
        })}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Texto alternativo"
        value={image?.alt || ''}
        onChange={(e) => onChange({
          url: image?.url || '',
          alt: e.target.value
        })}
        className={styles.input}
      />
      {image?.url && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={styles.removeButton}
        >
          Eliminar imagen
        </button>
      )}
    </div>
  )
}