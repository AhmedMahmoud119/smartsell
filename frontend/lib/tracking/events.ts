/**
 * Client-side tracking events utility
 * Fires pixel events for Facebook, TikTok, and Google Analytics
 */

export interface TrackingEventData {
  eventType: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';
  productId?: string;
  productName?: string;
  value?: number;
  currency?: string;
  quantity?: number;
  orderId?: string;
  contentIds?: string[];
}

// Track page view event
export function trackPageView() {
  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && (window as any).ttq) {
    (window as any).ttq.page();
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view');
  }
}

// Track view content event (product view)
export function trackViewContent(data: {
  productId: string;
  productName: string;
  value: number;
  currency: string;
}) {
  const { productId, productName, value, currency } = data;

  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'ViewContent', {
      content_type: 'product',
      content_ids: [productId],
      content_name: productName,
      value: value / 100, // Convert from cents
      currency,
    });
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && (window as any).ttq) {
    (window as any).ttq.track('ViewContent', {
      content_type: 'product',
      content_id: productId,
      content_name: productName,
      value: value / 100,
      currency,
    });
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'view_item', {
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: value / 100,
        },
      ],
      value: value / 100,
      currency,
    });
  }
}

// Track add to cart event
export function trackAddToCart(data: {
  productId: string;
  productName: string;
  value: number;
  currency: string;
  quantity: number;
}) {
  const { productId, productName, value, currency, quantity } = data;

  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'AddToCart', {
      content_type: 'product',
      content_ids: [productId],
      content_name: productName,
      value: value / 100,
      currency,
      num_items: quantity,
    });
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && (window as any).ttq) {
    (window as any).ttq.track('AddToCart', {
      content_type: 'product',
      content_id: productId,
      content_name: productName,
      value: value / 100,
      currency,
      quantity,
    });
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: value / 100,
          quantity,
        },
      ],
      value: value / 100,
      currency,
    });
  }
}

// Track initiate checkout event
export function trackInitiateCheckout(data: {
  value: number;
  currency: string;
  contentIds: string[];
  numItems: number;
}) {
  const { value, currency, contentIds, numItems } = data;

  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      content_type: 'product',
      content_ids: contentIds,
      value: value / 100,
      currency,
      num_items: numItems,
    });
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && (window as any).ttq) {
    (window as any).ttq.track('InitiateCheckout', {
      content_type: 'product',
      contents: contentIds.map((id) => ({ content_id: id })),
      value: value / 100,
      currency,
    });
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'begin_checkout', {
      value: value / 100,
      currency,
    });
  }
}

// Track purchase event
export function trackPurchase(data: {
  orderId: string;
  value: number;
  currency: string;
  contentIds: string[];
}) {
  const { orderId, value, currency, contentIds } = data;

  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Purchase', {
      content_type: 'product',
      content_ids: contentIds,
      value: value / 100,
      currency,
      order_id: orderId,
    });
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && (window as any).ttq) {
    (window as any).ttq.track('CompletePayment', {
      content_type: 'product',
      contents: contentIds.map((id) => ({ content_id: id })),
      value: value / 100,
      currency,
      order_id: orderId,
    });
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: orderId,
      value: value / 100,
      currency,
      items: contentIds.map((id) => ({ item_id: id })),
    });
  }
}

// Track lead/signup event
export function trackLead(data?: { value?: number; currency?: string }) {
  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', data);
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && (window as any).ttq) {
    (window as any).ttq.track('SubmitForm', data);
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'generate_lead', data);
  }
}
