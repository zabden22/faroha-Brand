'use client';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">📏 دليل المقاسات — FarOha_Brand</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <p style={{ color: 'var(--color-text-light)', marginBottom: '16px', fontSize: '14px' }}>
          بما أن موديلاتنا تمتاز بالقصّات الواسعة والمريحة (Oversized)، يرجى الاطلاع على القياسات بالسنتيمتر لاختيار المقاس الأنسب لكِ بسهولة:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-alt)' }}>
                <th>المقاس</th>
                <th>عرض الصدر (سم)</th>
                <th>الطول الكلي (سم)</th>
                <th>عرض الكتف (سم)</th>
                <th>طول الكم (سم)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>M (متوسط)</strong></td>
                <td>105 - 110</td>
                <td>145</td>
                <td>42</td>
                <td>58</td>
              </tr>
              <tr>
                <td><strong>L (كبير)</strong></td>
                <td>112 - 118</td>
                <td>148</td>
                <td>44</td>
                <td>60</td>
              </tr>
              <tr>
                <td><strong>XL (كبير جداً)</strong></td>
                <td>120 - 126</td>
                <td>150</td>
                <td>46</td>
                <td>61</td>
              </tr>
              <tr>
                <td><strong>XXL (واسع جداً)</strong></td>
                <td>128 - 135</td>
                <td>152</td>
                <td>48</td>
                <td>62</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', padding: '12px', background: 'var(--color-bg-alt)', borderRadius: '8px', fontSize: '13px', color: 'var(--color-text-light)' }}>
          💡 <strong>نصيحة اختيار المقاس:</strong> إذا كنتِ تفضلين الإطلالة الأكثر وسعاً وحشمة، ننصح باختيار مقاس أعلى بدرجة واحدة من مقاسك المعتاد.
        </div>
      </div>
    </div>
  );
}
