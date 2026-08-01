import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { User, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'OTHER',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
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
      setProfileMsg({ type: 'error', text: err.message || 'Cập nhật thất bại!' });
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
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Đổi mật khẩu thất bại!' });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex items-center space-x-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-2xs">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {user?.firstName} {user?.lastName}
            {user?.role === 'ADMIN' && (
              <span className="px-3 py-0.5 text-xs bg-red-50 text-red-600 rounded-full border border-red-200 flex items-center gap-1 font-bold">
                <Shield className="w-3.5 h-3.5" /> Admin
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Update Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-red-600" /> Thông tin cá nhân
          </h2>

          {profileMsg.text && (
            <div className={`p-3 rounded-2xl mb-4 text-sm flex items-center gap-2 ${
              profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Họ</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tên</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Giới tính</label>
                <select
                  value={profileData.gender}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingProfile}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-xl transition shadow-md shadow-red-600/30 flex justify-center"
            >
              {loadingProfile ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" /> Đổi mật khẩu
          </h2>

          {passwordMsg.text && (
            <div className={`p-3 rounded-2xl mb-4 text-sm flex items-center gap-2 ${
              passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {passwordMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mật khẩu cũ</label>
              <input
                type="password"
                required
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 rounded-xl transition flex justify-center"
            >
              {loadingPassword ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Cập nhật mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
