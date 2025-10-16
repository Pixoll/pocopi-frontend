import styles from "@/styles/AdminPage/AdminPage.module.css";
import {useState} from "react";

export function AdminPage() {
  const [Ids, setIds] = useState([1, 2, 3, 4, 5]);
  const [max, setMax] = useState(5);

  const orderConfigs = [...Ids].sort((a, b) => b - a);


  function setAsLastVersion(id: number) {
    const newIds = Ids.filter(existingId => existingId !== id);
    const newMaxId = max + 1;
    setIds([...newIds, newMaxId]);
    setMax(newMaxId);
  }

  function configSection(id: number, isLast: boolean) {
    return (
      <div className={isLast ? styles.lastConfigSection : styles.configSection} key={id}>
        <div>
          <p>Version number: {id}</p>
          <p>Title</p>
          <p>Subtitle</p>
          <p>Description</p>
        </div>

        <div className={styles.buttons}>
          {isLast
            ? (<button>Modify</button>)
            : (
              <>
                <button onClick={() => setAsLastVersion(id)}>Set as last version</button>
                <button>Delete</button>
              </>
            )
          }
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sectionsContainer}>
        {orderConfigs.map((id) => configSection(id, id === max))}
      </div>
    </div>
  );
}
