import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { User, Lock, CheckCircle, AlertCircle, Shield, Ticket, X, Save, ArrowRight } from 'lucide-react';
import ROUTES from '../constants/routes';

const Profile = () => {
  const { user, setUser } = useAuth();
  
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

  return (
    <div className="flex-grow py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full flex flex-col gap-6">
      {/* Page Title */}
      <div className="w-full text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Thông tin cá nhân</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý và cập nhật thông tin tài khoản cá nhân của bạn</p>
      </div>

      {/* Shortcut Banner to My Bookings */}
      <div className="bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base">Bạn muốn xem vé đã đặt & Mã QR Check-in?</h3>
            <p className="text-xs text-white/80">Quản lý chi tiết danh sách vé xem phim và bắp nước dễ dàng</p>
          </div>
        </div>
        <Link
          to={ROUTES.MY_BOOKINGS}
          className="px-4 py-2.5 bg-white text-red-600 hover:bg-slate-50 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap"
        >
          <span>Xem vé của tôi</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl flex flex-col gap-6 w-full">
        <div className="flex items-center gap-3 text-red-600 border-b border-slate-100 pb-4">
          <User className="w-6 h-6" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">Chi tiết tài khoản</h2>
          {user?.role === 'ADMIN' && (
            <span className="ml-auto px-3 py-1 text-xs bg-red-50 text-red-600 rounded-full border border-red-200 flex items-center gap-1 font-bold">
              <Shield className="w-3.5 h-3.5" /> Admin
            </span>
          )}
        </div>

        {profileMsg.text && (
          <div
            className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
              profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {profileMsg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Họ *</label>
            <input
              type="text"
              required
              value={profileData.firstName}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium outline-none"
              placeholder="Nhập họ"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tên *</label>
            <input
              type="text"
              required
              value={profileData.lastName}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium outline-none"
              placeholder="Nhập tên"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Số điện thoại *</label>
            <input
              type="tel"
              required
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium outline-none"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email (Không thể thay đổi)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-2.5 text-sm font-medium outline-none cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ngày sinh *</label>
            <input
              type="date"
              required
              value={profileData.dateOfBirth}
              onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Giới tính</label>
            <select
              value={profileData.gender}
              onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium outline-none"
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end items-center gap-3 pt-6 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Đổi mật khẩu
            </button>
            <button
              type="submit"
              disabled={loadingProfile}
              className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md shadow-red-600/30 hover:shadow-red-600/40 transition-all active:scale-95 flex items-center gap-2 min-w-[140px] justify-center"
            >
              {loadingProfile ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Lưu thông tin
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform transition-all">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" /> Đổi mật khẩu
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordMsg({ type: '', text: '' });
                }}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {passwordMsg.text && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 mb-4 ${
                    passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {passwordMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span className="font-medium">{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Mật khẩu hiện tại *</label>
                  <input
                    type="password"
                    required
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all outline-none"
                    placeholder="Nhập mật khẩu cũ"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Mật khẩu mới *</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all outline-none"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Xác nhận mật khẩu mới *</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all outline-none"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center min-w-[120px]"
                  >
                    {loadingPassword ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Cập nhật'
                    )}
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
