'use client'; // keep if using App Router

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { SketchPicker } from 'react-color';

export default function Home() {
  const [image, setImage] = useState(null);
  const [watermarkText, setWatermarkText] = useState("© MyArt");
  const [font, setFont] = useState("Inter");
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(0.7);
  const [position, setPosition] = useState("bottom-right");
  const [logoFile, setLogoFile] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'true') setIsPaid(true);
  }, []);

  const handleImageUpload = (e) => setImage(URL.createObjectURL(e.target.files[0]));
  const handleLogoUpload = (e) => setLogoFile(URL.createObjectURL(e.target.files[0]));

  const handleDownload = async () => {
    const canvas = await html2canvas(previewRef.current, { useCORS: true });
    const link = document.createElement('a');
    link.download = 'watermarked.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSubscribe = async () => {
    const res = await fetch('/api/create-checkout-session', { method: 'POST' });
    const data = await res.json();
    window.location = data.url;
  };

  const getPositionStyle = () => {
    const base = { position: 'absolute', color, fontFamily: font, fontSize, opacity };
    switch (position) {
      case 'top-left': return { ...base, top: 20, left: 20 };
      case 'top-right': return { ...base, top: 20, right: 20 };
      case 'center': return { ...base, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'bottom-left': return { ...base, bottom: 20, left: 20 };
      case 'bottom-right': return { ...base, bottom: 20, right: 20 };
      default: return base;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa', padding: 24 }}>
      {/* Sidebar */}
      <div style={{
        width: 320,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <h2 style={{ fontWeight: 600 }}>Watermark Studio</h2>

        <label style={{ fontWeight: 500 }}>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <label style={{ fontWeight: 500 }}>Upload Logo (optional)</label>
        <input type="file" accept="image/png" onChange={handleLogoUpload} />

        <label style={{ fontWeight: 500 }}>Watermark Text</label>
        <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd' }} />

        <label style={{ fontWeight: 500 }}>Font</label>
        <select value={font} onChange={(e) => setFont(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
          <option>Inter</option>
          <option>Roboto Mono</option>
          <option>Georgia</option>
          <option>Verdana</option>
          <option>Courier New</option>
        </select>

        <label style={{ fontWeight: 500 }}>Font Size</label>
        <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} style={{ padding: 8, borderRadius: 8 }} />

        <label style={{ fontWeight: 500 }}>Color</label>
        <SketchPicker color={color} onChange={(updated) => setColor(updated.hex)} />

        <label style={{ fontWeight: 500 }}>Opacity</label>
        <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} />

        <label style={{ fontWeight: 500 }}>Position</label>
        <select value={position} onChange={(e) => setPosition(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="center">Center</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
        </select>

        <div style={{ marginTop: 16 }}>
          {isPaid ? (
            <button onClick={handleDownload} style={{
              width: '100%',
              padding: 12,
              background: '#4f46e5',
              color: '#fff',
              borderRadius: 8,
              border: 'none',
              fontWeight: 500
            }}>Download Watermarked Image</button>
          ) : (
            <>
              <button onClick={handleSubscribe} style={{
                width: '100%',
                padding: 12,
                background: '#16a34a',
                color: '#fff',
                borderRadius: 8,
                border: 'none',
                fontWeight: 500
              }}>Subscribe to Unlock</button>
              <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>£5/month to unlock downloads</p>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      <div style={{
        flex: 1,
        marginLeft: 32,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}>
        {image ? (
          <div ref={previewRef} style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', maxHeight: '80vh' }}>
            <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }} />
            {logoFile ? (
              <img src={logoFile} alt="Logo" style={{ ...getPositionStyle(), width: 100, height: 'auto' }} />
            ) : (
              <div style={getPositionStyle()}>{watermarkText}</div>
            )}
          </div>
        ) : (
          <p style={{ color: '#999' }}>No image uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
