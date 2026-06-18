import { CheckCircle2, KeyRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api';

export default function ForgotPasswordModal({ open, onClose, defaultEmail = '' }) {
  const [email, setEmail] = useState(defaultEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail(defaultEmail);
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
      setSuccess(null);
      setLoading(false);
    }
  }, [open, defaultEmail]);

  if (!open) return null;

  async function submit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !newPassword || !confirmPassword) {
      setError('Preencha todos os campos antes de salvar.');
      return;
    }
    if (newPassword.length < 6) {
      setError('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas nao coincidem.');
      return;
    }

    setLoading(true);
    try {
      await api.forgotPassword(email.trim(), newPassword, confirmPassword);
      setSuccess('Senha atualizada com sucesso. Faca login com a nova senha.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-rise overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-line bg-slate-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-aqua text-brandDark">
              <KeyRound size={20} />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brandDark">Recuperar senha</p>
              <p className="text-sm font-semibold text-muted">Informe seu e-mail cadastrado e defina uma nova senha.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-2xl bg-white text-muted shadow-sm hover:text-ink"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 px-6 py-6">
          <div>
            <label className="label mb-2 block">E-mail</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@dominio.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="label mb-2 block">Nova senha</label>
            <input
              type="password"
              className="input"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Minimo 6 caracteres"
              minLength={6}
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <label className="label mb-2 block">Confirmar nova senha</label>
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repita a nova senha"
              minLength={6}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-soft" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Atualizando...' : 'Atualizar senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
