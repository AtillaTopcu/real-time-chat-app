import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoginPage = () => {
    const [nickName, setNickName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(nickName, password);
            navigate('/chat');
        } catch (err) {
            setError('Giriş başarısız. Kullanıcı adı veya şifre hatalı.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Giriş Yap</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input placeholder="Kullanıcı adı" value={nickName} onChange={(e) => setNickName(e.target.value)} required />
            <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Giriş Yap</button>
            <p>Hesabın yok mu? <Link to="/register">Kayıt ol</Link></p>
        </form>
    );
};

export default LoginPage;