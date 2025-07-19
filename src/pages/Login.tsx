import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success(t('login') + ' ' + t('welcome') + '!');
      navigate('/');
    } catch (err: any) {
      toast.error(t('login') + ' ' + t('password') + ' inválidos!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label={t('login') + ' form'}>
      <div>
        <label htmlFor="email">{t('email')}</label>
        <input
          id="email"
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="username"
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="password">{t('password')}</label>
        <input
          id="password"
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          aria-required="true"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? t('loading') : t('enter')}
      </button>
    </form>
  );
} 