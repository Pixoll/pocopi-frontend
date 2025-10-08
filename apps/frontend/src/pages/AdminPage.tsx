import styles from "@/styles/AdminPage/AdminPage.module.css";

export function AdminPage() {
  const Ids: number[] = [1, 2, 3, 4, 5];

  function configSection(id: number) {
    return (
      <div className={styles.configSection} key={id}>
        <div>
          <p>Version number: {id}</p>
          <p>Title</p>
          <p>Subtitle</p>
          <p>Description</p>
        </div>

        <div className={styles.buttons}>
          <button>Modify and select as last version</button>
          <button>Duplicate</button>
          <button>See more details</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sectionsContainer}>
        {Ids.map((id) => configSection(id))}
      </div>

      <div className={styles.addButtonContainer}>
        <button className={styles.addButton}>Add a new version</button>
      </div>
    </div>
  );
}
