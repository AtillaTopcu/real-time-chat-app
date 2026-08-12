import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RegisterPage = () => {
    const [nickName, setNickName] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(nickName, fullName, password);
            navigate('/chat');
        } catch (err) {
            setError('Kayıt başarısız.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Kayıt Ol</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input placeholder="Kullanıcı adı" value={nickName} onChange={(e) => setNickName(e.target.value)} required />
            <input placeholder="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Kayıt Ol</button>
            <p>Zaten hesabın var mı? <Link to="/login">Giriş yap</Link></p>
        </form>
    );
};

export default RegisterPage;