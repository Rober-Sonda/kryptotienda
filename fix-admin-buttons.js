const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'views', 'admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(adminDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace primary buttons
  content = content.replace(/className="admin-btn"/g, 'className="neon-btn small-btn"');
  
  // Replace admin-btn danger
  content = content.replace(/className="admin-btn danger"/g, 'className="neon-btn small-btn danger"');

  // Replace Edit icon buttons:
  // e.g. <button onClick={() => handleEdit(cat)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginRight: '10px' }}>
  content = content.replace(/style={{ background: 'none', border: 'none', color: 'var\(--text-light\)', cursor: 'pointer', marginRight: '10px' }}/g, 'className="icon-btn"');
  content = content.replace(/style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginRight: '10px' }}/g, 'className="icon-btn"');

  // Replace Delete icon buttons:
  // e.g. <button onClick={() => handleDelete(cat.id!)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
  content = content.replace(/style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}/g, 'className="icon-btn danger"');

  // Replace Cancel / text buttons with inline border styles:
  // style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
  content = content.replace(/style={{ background: 'none', border: '1px solid var\(--border-color\)', color: 'var\(--text-main\)', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}/g, 'className="neon-btn small-btn cancel"');
  content = content.replace(/style={{ background: 'none', border: '1px solid var\(--border-color\)', color: 'white', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}/g, 'className="neon-btn small-btn cancel"');

  // In AdminSalesView there is: style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: 'var(--krypton-green)', cursor: 'pointer' }}
  content = content.replace(/style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: 'var\(--krypton-green\)', cursor: 'pointer' }}/g, 'className="neon-btn small-btn" style={{ padding: "4px 8px" }}');

  // Also tab buttons in AdminClaimsView
  // <button onClick={() => setActiveTab('all')} className={`admin-tab-btn ${activeTab === 'all' ? 'active' : ''}`}>
  // We can leave admin-tab-btn as is, maybe just verify later.

  fs.writeFileSync(filePath, content, 'utf-8');
}

console.log('Button classes updated successfully in admin views.');
