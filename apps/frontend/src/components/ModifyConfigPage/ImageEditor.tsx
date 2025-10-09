import type {Image} from "@/api";
import styles from "@/styles/ModifyConfigPage/ImageEditor.module.css";

type ImageEditorProps = {
  image?: Image;
  onChange: (image?: Image) => void;
  label: string;
}

export function ImageEditor({ image, onChange, label }: ImageEditorProps) {
  return(
    <div className={styles.imageEditor}>
      <label className={styles.label}>{label}</label>
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
      {image && (
        <button
          onClick={() => onChange(undefined)}
          className={styles.removeButton}
        >
          Eliminar imagen
        </button>
      )}
    </div>
  )
}