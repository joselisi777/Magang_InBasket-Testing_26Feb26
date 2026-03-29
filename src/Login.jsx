import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./config/firebase";
import { ref, get, update } from "firebase/database";
import { AuthContext } from "./contexts/AuthContext";

const Login = () => {
    
    const navigate = useNavigate();
    const { startApp } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [voucher, setVoucher] = useState('');
    const [error, setError] = useState(null);
    const [buttonTxt, setButtonTxt] = useState('Mulai Ujian');
    const [pending, setIsPending] = useState(false);

    const verifyAndLogin = async (e) => {
        e.preventDefault();
        setIsPending(true);
        setButtonTxt('Memverifikasi...');
        setError(null);

        const nameInp = name.trim();
        const codeInp = voucher.trim().toUpperCase();

        if (!nameInp || !codeInp) {
            setIsPending(false);
            setButtonTxt('Mulai Ujian');
            setError("Mohon lengkapi Nama dan Kode Voucher.");
            return;
        }

        try {
            const voucherRef = ref(db, 'vouchers/' + codeInp);
            const snapshot = await get(voucherRef);

            if (!snapshot.exists()) {
                throw new Error("Kode Voucher tidak valid.");
            }

            const voucher = snapshot.val()

            if (voucher.status === 'used') throw new Error(`Voucher telah digunakan oleh ${voucher.usedBy}.`);

            await update(voucherRef, {
                status: 'used',
                usedBy: nameInp,
                usedAt: new Date().toISOString()
            });

            const role = voucher.role || "Peserta Asesmen";

            await startApp(nameInp, role, codeInp);

            localStorage.removeItem('logs');
            localStorage.removeItem('emailOverrides');
            localStorage.removeItem('sentEmails');
            
            setButtonTxt('Mulai Ujian');
            setIsPending(false);
            navigate('/test');
        } catch (error) {
            setButtonTxt('Mulai Ujian');
            setIsPending(false);
            setError(error.message);
        }
    };

    return ( 
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>InsightCore Assessment</h2>
                <p>Verifikasi Identitas untuk Memulai Simulasi</p>

                <form onSubmit={verifyAndLogin}>
                    <div className="form-group">
                        <label>Nama Lengkap</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan Nama Anda"/>
                    </div>
                    
                    <div className="voucher-box">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Kode Akses (Voucher)</label>
                            <input type="text" value={voucher} onChange={(e) => setVoucher(e.target.value)} className="voucher-box" placeholder="Contoh: INC-A1B2C"/>
                        </div>
                    </div>
                    
                    <button className="btn-primary" disabled={pending}>
                        {buttonTxt}
                    </button>

                    <div className="error-msg">{error && <div>{error}</div>}</div>
                </form>
            </div>
        </div>
     );
}
 
export default Login;