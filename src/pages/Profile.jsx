import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { User, Lock, CheckCircle, AlertCircle, Shield, History, Ticket, X, Save } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  
  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'OTHER',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Transaction History State
  const [transactions, setTransactions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || 'OTHER',
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchTransactionHistory();
    }
  }, [activeTab]);

  const fetchTransactionHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await authApi.getTransactionHistory();
      setTransactions(response || []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setLoadingProfile(true);

    try {
      const updatedUser = await authApi.updateProfile(profileData);
      setUser(updatedUser);
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (err) {
      const errorMsg = err.message || Object.values(err)[0] || 'Cập nhật thất bại!';
      setProfileMsg({ type: 'error', text: errorMsg });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Xác nhận mật khẩu không khớp!' });
      return;
    }

    setLoadingPassword(true);
    try {
      const message = await authApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordMsg({ type: 'success', text: message || 'Đổi mật khẩu thành công!' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMsg({ type: '', text: '' });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }, 1500);
    } catch (err) {
      const errorMsg = err.message || Object.values(err)[0] || 'Đổi mật khẩu thất bại!';
      setPasswordMsg({ type: 'error', text: errorMsg });
    } finally {
      setLoadingPassword(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 max-w-[1200px] mx-auto w-full flex flex-col gap-8">
      {/* Page Title */}
      <div className="w-full flex justify-center mb-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-wider uppercase">Thông tin cá nhân</h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex justify-center gap-2 p-1 bg-white rounded-full border border-slate-200 shadow-sm w-fit mx-auto">
          <button 
            onClick={() => setActiveTab('account')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'account' ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Tài khoản của tôi
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Lịch sử giao dịch
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-grow bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl flex flex-col gap-8 w-full relative overflow-hidden">
          
          {activeTab === 'account' && (
            <>
              <div className="flex items-center gap-3 text-red-600 border-b border-red-100 pb-4">
                <User className="w-6 h-6" />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">Thông tin tài khoản</h2>
                {user?.role === 'ADMIN' && (
                  <span className="ml-auto px-3 py-1 text-xs bg-red-50 text-red-600 rounded-full border border-red-200 flex items-center gap-1 font-bold">
                    <Shield className="w-3.5 h-3.5" /> Admin
                  </span>
                )}
              </div>

              {profileMsg.text && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
                  profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {profileMsg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="font-medium">{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Họ *</label>
                  <input
                    type="text"
                    required
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium outline-none"
                    placeholder="Nhập họ"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Tên *</label>
                  <input
                    type="text"
                    required
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium outline-none"
                    placeholder="Nhập tên"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Email (Không thể thay đổi)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-3 font-medium outline-none cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Ngày sinh *</label>
                  <input
                    type="date"
                    required
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Giới tính</label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium outline-none appearance-none"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-end items-center gap-4 pt-6 border-t border-slate-100 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Đổi mật khẩu
                  </button>
                  <button
                    type="submit"
                    disabled={loadingProfile}
                    className="bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 rounded-xl text-white font-bold shadow-lg shadow-red-600/30 hover:shadow-red-600/40 transition-all active:scale-95 flex items-center gap-2 min-w-[160px] justify-center"
                  >
                    {loadingProfile ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-5 h-5" /> Lưu thông tin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === 'history' && (
            <>
              <div className="flex items-center gap-3 text-red-600 border-b border-red-100 pb-4">
                <History className="w-6 h-6" />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">Lịch sử giao dịch</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                {loadingHistory ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                  </div>
                ) : transactions.length > 0 ? (
                  transactions.map((tx, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-red-200 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                          <Ticket className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg mb-1">{tx.movieTitle}</h3>
                          <p className="text-sm text-slate-500 font-medium">Loại giao dịch: {tx.transactionType}</p>
                          <p className="text-xs text-slate-400 mt-1">{formatDate(tx.transactionDate)}</p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="font-bold text-slate-900 text-lg">{formatCurrency(tx.totalAmount)}</div>
                        <div className="text-sm font-semibold text-emerald-600">Thành công ({tx.ticketCount} vé)</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Chưa có giao dịch nào</h3>
                    <p className="text-slate-500 text-sm">Bạn chưa thực hiện giao dịch đặt vé nào trên hệ thống.</p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform transition-all">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" /> Đổi mật khẩu
              </h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordMsg({ type: '', text: '' });
                }}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {passwordMsg.text && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-2 mb-6 ${
                  passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {passwordMsg.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <span className="font-medium">{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Mật khẩu hiện tại *</label>
                  <input
                    type="password"
                    required
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all outline-none"
                    placeholder="Nhập mật khẩu cũ"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Mật khẩu mới *</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all outline-none"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Xác nhận mật khẩu mới *</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all outline-none"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
                
                <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-xl text-white font-bold shadow-md shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center min-w-[140px]"
                  >
                    {loadingPassword ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : 'Cập nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
