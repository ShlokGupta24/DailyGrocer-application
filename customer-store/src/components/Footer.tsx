import type { FC } from 'react';
import { Store, Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { DailyGrocer_LOCALITIES } from '../data/mockData';

export const Footer: FC = () => {
  return (
    <footer className="main-footer">
      {/* Merchant Onboarding Banner for Startup Pitch */}
      <div className="partner-pitch-band">
        <div className="container pitch-band-content">
          <div className="pitch-text">
            <span className="pitch-tag">For Shop Owners in DailyGrocer</span>
            <h3>Run a local Kirana, Dairy, or Sabzi Mandi stall?</h3>
            <p>List your store on DailyGrocer and start reaching thousands of nearby homes in your ward.</p>
          </div>
          <button 
            className="partner-cta-btn"
            onClick={() => alert('Demo Feature: Merchant Onboarding Portal for DailyGrocer Store Owners')}
          >
            <Store size={16} />
            <span>Partner With Us</span>
          </button>
        </div>
      </div>

      <div className="container footer-container">
        <div className="footer-columns-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <span className="logo-bolt">⚡</span>
              <span className="logo-title">DailyGrocer <strong>Express</strong></span>
            </div>
            <p className="footer-about">
              Empowering local mom-and-pop grocery stores, sabzi mandis, and dairy vendors across DailyGrocer with ultra-fast 15-minute neighborhood delivery.
            </p>
            <div className="footer-trust-chips">
              <span className="trust-pill"><ShieldCheck size={13} /> Verified Local Stores</span>
              <span className="trust-pill">🌱 Fresh Mandi Produce</span>
            </div>
          </div>

          {/* Localities Served */}
          <div className="footer-col">
            <h5 className="footer-heading">Service Localities</h5>
            <ul className="footer-links-list">
              {DailyGrocer_LOCALITIES.slice(0, 6).map((loc) => (
                <li key={loc}>
                  <MapPin size={12} className="bullet-pin" />
                  <span>{loc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h5 className="footer-heading">Categories</h5>
            <ul className="footer-links-list">
              <li>Fruits & Vegetables (Mandi Fresh)</li>
              <li>Dairy, Eggs & Fresh Paneer</li>
              <li>Staples, Atta, Rice & Dal</li>
              <li>Snacks, Namkeen & Samosas</li>
              <li>Beverages & Cold Drinks</li>
              <li>Personal & Home Care</li>
            </ul>
          </div>

          {/* Contact / Founder Notice */}
          <div className="footer-col contact-col">
            <h5 className="footer-heading">Startup Helpline</h5>
            <div className="contact-item">
              <Phone size={14} />
              <span>Customer Care: +91 94520 88990</span>
            </div>
            <div className="contact-item">
              <Mail size={14} />
              <span>support@dailygrocer.in</span>
            </div>
            <div className="contact-item">
              <MapPin size={14} />
              <span>Veer Vinay Chowk (UP) - 271201</span>
            </div>
            <div className="demo-notice-box">
              <Sparkles size={14} />
              <span>Demonstration Prototype for DailyGrocer Hyperlocal Commerce</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} DailyGrocer. Built with care for Your City, India.</p>
          <div className="footer-tagline">
            <span>Made with <Heart size={13} fill="#ededed" color="#ededed" style={{ display: 'inline', verticalAlign: 'middle' }} /> for local retail</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
