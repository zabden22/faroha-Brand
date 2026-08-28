'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DashboardIcon,
  RefreshIcon,
  UsersIcon,
  EyeIcon,
  CalendarIcon,
  TrendingUpIcon,
  BagIcon,
  FlowerIcon,
  CreditCardIcon,
  ClockIcon,
  TagIcon,
} from '@/components/Icons';
import { ORDER_STATUS_LABELS, OrderStatus } from '@/types';

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    ordersCount: number;
    pendingOrdersCount: number;
    deliveredOrdersCount: number;
    totalSales: number;
    recentOrders: any[];
    productsCount: number;
    categories: any[];
    visitorStats: {
      totalVisits: number;
      todayVisits: number;
      thisMonthVisits: number;
      uniqueVisitors: number;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      const json = await res.json();
      if (json && !json.error) {
        setData(json);
      }
    } catch (e) {
      console.error('Error loading admin stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h1
          className="admin-page-title"
          style={{
            marginBottom: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <DashboardIcon size={24} style={{ color: 'var(--color-primary)' }} />
          لوحة الإحصائيات العامة
        </h1>
        <button
          onClick={loadStats}
          className="btn btn-outline btn-sm"
          style={{
            fontSize: '13px',
            padding: '6px 14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <RefreshIcon size={14} />
          تحديث الإحصائيات
        </button>
      </div>

      {loading && !data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="stats-grid">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="stat-card shimmer-skeleton"
                style={{ height: '110px' }}
              />
            ))}
          </div>
          <div className="stats-grid">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="stat-card shimmer-skeleton"
                style={{ height: '110px' }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Visitor Traffic Stats */}
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <UsersIcon size={18} style={{ color: 'var(--color-primary)' }} />
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--color-primary-dark)',
                  margin: 0,
                }}
              >
                حركة وزوار الموقع (Real-time Visitors Traffic)
              </h2>
            </div>

            <div className="stats-grid" style={{ marginBottom: 0 }}>
              <div
                className="stat-card"
                style={{ borderTop: '3px solid var(--color-primary)' }}
              >
                <div
                  className="stat-card-icon"
                  style={{
                    background: 'rgba(155, 123, 107, 0.1)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <UsersIcon size={22} />
                </div>
                <div className="stat-card-value">
                  {data?.visitorStats?.uniqueVisitors || 0}
                </div>
                <div className="stat-card-label">إجمالي الزوار الفريدين</div>
              </div>

              <div
                className="stat-card"
                style={{ borderTop: '3px solid var(--color-success)' }}
              >
                <div
                  className="stat-card-icon"
                  style={{
                    background: 'var(--color-success-light)',
                    color: 'var(--color-success)',
                  }}
                >
                  <EyeIcon size={22} />
                </div>
                <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>
                  {data?.visitorStats?.totalVisits || 0}
                </div>
                <div className="stat-card-label">إجمالي المشاهدات والزيارات</div>
              </div>

              <div
                className="stat-card"
                style={{ borderTop: '3px solid var(--color-gold)' }}
              >
                <div
                  className="stat-card-icon"
                  style={{
                    background: 'rgba(201, 168, 92, 0.12)',
                    color: 'var(--color-gold)',
                  }}
                >
                  <CalendarIcon size={22} />
                </div>
                <div className="stat-card-value" style={{ color: 'var(--color-gold)' }}>
                  {data?.visitorStats?.todayVisits || 0}
                </div>
                <div className="stat-card-label">زيارات اليوم</div>
              </div>

              <div
                className="stat-card"
                style={{ borderTop: '3px solid var(--color-primary-dark)' }}
              >
                <div
                  className="stat-card-icon"
                  style={{
                    background: 'rgba(122, 95, 81, 0.1)',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  <TrendingUpIcon size={22} />
                </div>
                <div
                  className="stat-card-value"
                  style={{ color: 'var(--color-primary-dark)' }}
                >
                  {data?.visitorStats?.thisMonthVisits || 0}
                </div>
                <div className="stat-card-label">زيارات هذا الشهر</div>
              </div>
            </div>
          </div>

          {/* Sales & Orders Stats */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <BagIcon size={18} style={{ color: 'var(--color-primary)' }} />
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                إحصائيات المبيعات والطلبات
              </h2>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div
                  className="stat-card-icon"
                  style={{
                    background: 'rgba(155, 123, 107, 0.1)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <CreditCardIcon size={22} />
                </div>
                <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>
                  {data?.totalSales || 0} ج.م
                </div>
                <div className="stat-card-label">إجمالي المبيعات</div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-card-icon"
                  style={{
                    background: 'rgba(212, 185, 167, 0.2)',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  <BagIcon size={22} />
                </div>
                <div className="stat-card-value">{data?.ordersCount || 0}</div>
                <div className="stat-card-label">إجمالي الطلبات</div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-card-icon"
                  style={{
                    background: 'var(--color-warning-light)',
                    color: 'var(--color-warning)',
                  }}
                >
                  <ClockIcon size={22} />
                </div>
                <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>
                  {data?.pendingOrdersCount || 0}
                </div>
                <div className="stat-card-label">طلبات قيد الانتظار</div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-card-icon"
                  style={{
                    background: 'rgba(155, 123, 107, 0.1)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <FlowerIcon size={22} />
                </div>
                <div className="stat-card-value">{data?.productsCount || 0}</div>
                <div className="stat-card-label">عدد المنتجات</div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Table */}
          <div
            className="admin-grid-2col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <div className="checkout-section">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                  أحدث الطلبات الواردة
                </h3>
                <Link
                  href="/admin/orders"
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                  }}
                >
                  عرض الكل ←
                </Link>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>العميل</th>
                      <th>الإجمالي</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.recentOrders || []).length > 0 ? (
                      data?.recentOrders.map((o: any) => (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 700 }}>{o.orderNumber}</td>
                          <td>{o.customerName}</td>
                          <td style={{ fontWeight: 600 }}>
                            {o.totalAmount + o.deliveryFee} ج.م
                          </td>
                          <td>
                            <span className={`status-badge status-${o.status}`}>
                              {ORDER_STATUS_LABELS[o.status as OrderStatus] ||
                                o.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          style={{ textAlign: 'center', padding: '24px' }}
                        >
                          لا توجد طلبات واردة حتى الآن.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="checkout-section">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                  أقسام المتجر المتاحة ({data?.categories?.length || 0})
                </h3>
                <Link
                  href="/admin/categories"
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                  }}
                >
                  إدارة الأقسام ←
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(data?.categories || []).map((cat: any) => (
                  <div
                    key={cat.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: 'var(--color-bg-alt)',
                      borderRadius: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <TagIcon size={15} style={{ color: 'var(--color-primary)' }} />
                      {cat.name}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        background: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        color: 'var(--color-text-light)',
                        fontWeight: 600,
                      }}
                    >
                      {cat._count?.products || 0} منتجات
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
