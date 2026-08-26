'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.imageUrl || '/images/category_dresses.jpg';
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const existingCart = JSON.parse(localStorage.getItem('faroha_cart') || '[]');
      const defaultVariant = product.variants?.[0];
      
      const itemIndex = existingCart.findIndex(
        (item: any) => item.productId === product.id && item.variantId === (defaultVariant?.id || null)
      );

      if (itemIndex > -1) {
        existingCart[itemIndex].quantity += 1;
      } else {
        existingCart.push({
          productId: product.id,
          variantId: defaultVariant?.id || null,
          product: product,
          variant: defaultVariant,
          quantity: 1,
        });
      }

      localStorage.setItem('faroha_cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('cartUpdated'));

      // Quick visual feedback
      alert(`تمت إضافة "${product.name}" إلى السلة! 🛍️`);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
          style={{ objectFit: 'cover' }}
        />

        {/* Discount / New Badges */}
        {product.discountPrice ? (
          <span className="product-card-badge">خصم</span>
        ) : product.isNew ? (
          <span className="product-card-badge new">جديد</span>
        ) : null}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        
        {/* Pricing */}
        <div className="product-card-price">
          {product.discountPrice ? (
            <>
              <span className="current">{product.discountPrice} ج.م</span>
              <span className="original">{product.price} ج.m</span>
            </>
          ) : (
            <span className="current">{product.price} ج.م</span>
          )}
        </div>

        {/* Color Swatches if available */}
        {product.variants && product.variants.length > 0 && (
          <div className="product-card-colors">
            {product.variants.map((variant) => (
              <span
                key={variant.id}
                className="color-swatch"
                style={{ backgroundColor: variant.colorHex }}
                title={`${variant.color} - مقاس ${variant.size}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-card-footer">
        <button
          onClick={handleAddToCart}
          className="btn btn-outline btn-sm"
        >
          أضيفي للسلة 🛒
        </button>
      </div>
    </Link>
  );
}
