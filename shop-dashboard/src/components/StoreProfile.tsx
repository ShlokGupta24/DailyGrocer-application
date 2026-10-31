import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Save, 
  Check, 
  AlertCircle,
  Truck
} from 'lucide-react';
import type { StoreProfile as StoreProfileType } from '../types';

interface StoreProfileProps {
  storeProfile: StoreProfileType;
  onSaveProfile: (updatedProfile: StoreProfileType) => void;
}

export const StoreProfile: React.FC<StoreProfileProps> = ({
  storeProfile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<StoreProfileType>({ ...storeProfile });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const coveredLocalities = [
    'Station Road & Railway Colony',
    'Veer Vinay Chowk / Chauraha',
    'Civil Lines (DM & Judge Residence)',
    'Pahalwara Ward & Market',
    'Purani Bazar & Clock Tower',
    'Bhagwati Ganj (Ward 7 & 8)',
    'Hospital Road & District Hospital',
    'Peepal Tiraha & Bus Station',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopName.trim()) {
      setErrorMsg('Shop name is required');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Phone number is required');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('Store street address is required');
      return;
    }
    if (!formData.deliveryRadius.trim()) {
      setErrorMsg('Delivery radius is required');
      return;
    }
    if (!formData.openingHours.trim()) {
      setErrorMsg('Opening hours are required');
      return;
    }

    setErrorMsg('');
    onSaveProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div>
      <div className="page-header-row">
        <div className="page-header-title-box">
          <h1>Store Profile & Delivery Settings</h1>
          <p>Manage your grocery store information, operational hours and delivery coverage</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Left column: Profile Edit Form */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Shop Information</div>
            <span className="badge badge-green">Verified Merchant</span>
          </div>

          <form onSubmit={handleSubmit} className="card-body">
            {errorMsg && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                padding: '10px 14px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12.5,
                color: '#0f172a'
              }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSaved && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 6,
                padding: '10px 14px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12.5,
                color: '#15803d'
              }}>
                <Check size={16} />
                <span>Store profile details updated successfully!</span>
              </div>
            )}

            {/* Shop Name & Hindi Name */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="shopName">
                  Shop Name (English)<span className="req">*</span>
                </label>
                <input
                  id="shopName"
                  name="shopName"
                  type="text"
                  className="form-control"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="hindiShopName">
                  Hindi Shop Name (Board Display)
                </label>
                <input
                  id="hindiShopName"
                  name="hindiShopName"
                  type="text"
                  className="form-control"
                  value={formData.hindiShopName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Owner Name & Phone */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="ownerName">
                  Shop Owner / Manager Name<span className="req">*</span>
                </label>
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  className="form-control"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Primary Mobile Number<span className="req">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Alternate Phone & Email */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="alternatePhone">
                  Landline / Alt Phone
                </label>
                <input
                  id="alternatePhone"
                  name="alternatePhone"
                  type="text"
                  className="form-control"
                  value={formData.alternatePhone || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Business Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Street Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="address">
                Store Street Address<span className="req">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* Landmark, Locality, Pincode */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="landmark">
                  Landmark
                </label>
                <input
                  id="landmark"
                  name="landmark"
                  type="text"
                  className="form-control"
                  value={formData.landmark}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="locality">
                  Locality / District
                </label>
                <input
                  id="locality"
                  name="locality"
                  type="text"
                  className="form-control"
                  value={formData.locality}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Delivery Radius & Opening Hours */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="deliveryRadius">
                  Delivery Radius<span className="req">*</span>
                </label>
                <input
                  id="deliveryRadius"
                  name="deliveryRadius"
                  type="text"
                  className="form-control"
                  placeholder="e.g. 3.5 km"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  required
                />
                <span className="form-help-text">Hyperlocal delivery within 15-20 mins.</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="openingHours">
                  Store Opening Hours<span className="req">*</span>
                </label>
                <input
                  id="openingHours"
                  name="openingHours"
                  type="text"
                  className="form-control"
                  placeholder="e.g. 07:00 AM – 10:00 PM (Everyday)"
                  value={formData.openingHours}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* UPI & FSSAI */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="upiId">
                  Store UPI ID (For Direct Customer Settlements)
                </label>
                <input
                  id="upiId"
                  name="upiId"
                  type="text"
                  className="form-control"
                  value={formData.upiId}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fssaiNumber">
                  FSSAI Food License Number
                </label>
                <input
                  id="fssaiNumber"
                  name="fssaiNumber"
                  type="text"
                  className="form-control"
                  value={formData.fssaiNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                id="save-profile-btn"
                className="btn btn-primary"
              >
                <Save size={16} />
                <span>Save Store Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Counter UPI QR & Delivery Radius Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Store UPI Counter QR Card */}
          <div className="store-qr-card">
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
              Counter Payment QR Code
            </div>
            <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2, marginBottom: 16 }}>
              Scan to pay directly to {formData.shopName}
            </div>

            <div className="qr-box">
              <svg viewBox="0 0 100 100" fill="#0f172a">
                {/* Simulated crisp QR pattern */}
                <path d="M10 10h30v30h-30zM15 15v20h20v-20zM22 22h6v6h-6z" />
                <path d="M60 10h30v30h-30zM65 15v20h20v-20zM72 22h6v6h-6z" />
                <path d="M10 60h30v30h-30zM15 65v20h20v-20zM22 72h6v6h-6z" />
                <path d="M45 15h10v10h-10zM45 35h10v10h-10zM15 45h10v10h-10zM35 45h10v10h-10zM55 55h10v10h-10zM75 50h15v10h-15zM50 70h15v10h-15zM70 70h20v20h-20zM50 85h15v10h-15z" />
              </svg>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              color: '#0f172a',
              display: 'inline-block'
            }}>
              UPI ID: {formData.upiId}
            </div>

            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 10 }}>
              Official DailyGrocer Merchant Account • Instant Settlement
            </div>
          </div>

          {/* Delivery Coverage Areas */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Truck size={18} color="#15803d" />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                Delivery Coverage ({formData.deliveryRadius})
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#64748b' }}>
              Your shop currently delivers within 15–20 minutes to these DailyGrocer neighborhoods:
            </p>

            <div className="coverage-areas-list">
              {coveredLocalities.map((loc) => (
                <span key={loc} className="coverage-pill">
                  {loc}
                </span>
              ))}
            </div>

            <div style={{
              marginTop: 16,
              padding: 12,
              background: '#f0fdf4',
              borderRadius: 6,
              border: '1px solid #bbf7d0',
              fontSize: 11.5,
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <ShieldCheck size={16} />
              <span>Free delivery partner assigned by DailyGrocer network.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
