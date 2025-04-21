import { useUsers } from "@/hooks/useUsers";
import { UserCard } from "@/components/UserCard";
import styles from "@/pages/UserList.module.css";

export const UserList = () => {
  const { users, loading } = useUsers();

  if (loading) return <p className={styles.loading}>Cargando usuarios...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de Usuarios</h2>
      {users.length > 0 ? (
        <div className={styles.userGrid}>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>No hay usuarios disponibles</p>
      )}
    </div>
  );
};
