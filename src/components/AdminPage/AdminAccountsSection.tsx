import { useState, useEffect } from 'react';
import styles from '@/styles/AdminPage/AdminAccountsSection.module.css';
import api, {type Admin, type NewAdmin} from '@/api';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { LoadingPage } from '@/pages/LoadingPage';

export default function AdminAccountsSection() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | Error | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    username: '',
    password: '',
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllAdmins();
      if (response) {
        setAdmins(response.data ?? []);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : 'Error al cargar los administradores');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();

    if (!newAdmin.username || !newAdmin.password) {
      setError('Usuario y contraseña son requeridos');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.createAdmin({
        body: {
          username: newAdmin.username,
          password: newAdmin.password,
        }
      });

      if (response) {
        await fetchAdmins();
        setNewAdmin({ username: '', password: '' });
        setShowCreateForm(false);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : 'Error al crear el administrador');
    } finally {
      setLoading(false);
    }
  }

  function handleCancelCreate() {
    setShowCreateForm(false);
    setNewAdmin({ username: '', password: '' });
    setError(null);
  }

  if (loading && admins.length === 0) {
    return <LoadingPage message="Cargando administradores..." />;
  }

  return (
    <div className={styles.container}>
      {error && <ErrorDisplay error={error} onClose={() => setError(null)} />}

      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Administrator Accounts</h2>
          <p className={styles.subtitle}>Manage system administrator accounts</p>
        </div>
        {!showCreateForm && (
          <button
            className={styles.createButton}
            onClick={() => setShowCreateForm(true)}
            disabled={loading}
          >
            + New Administrator
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className={styles.createFormCard}>
          <h3 className={styles.formTitle}>Create New Administrator</h3>
          <form onSubmit={handleCreateAdmin} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Username <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                className={styles.input}
                placeholder="Enter username"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Password <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className={styles.input}
                placeholder="Enter secure password"
                required
                disabled={loading}
              />
              <small className={styles.hint}>Minimum 8 characters recommended</small>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleCancelCreate}
                className={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Administrator'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.adminsList}>
        {admins.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No administrators found</p>
          </div>
        ) : (
          admins.map((admin) => (
            <div key={admin.id} className={styles.adminCard}>
              <div className={styles.adminInfo}>
                <div className={styles.adminAvatar}>
                  {admin.username.charAt(0).toUpperCase()}
                </div>
                <span className={styles.adminName}>{admin.username}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
