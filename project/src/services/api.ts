export interface SiteData {
  userId: string;
  header: any;
  hero: any;
  about: any;
  menu: any;
  pricing: any;
  cta: any;
  gallery: any;
  staff: any;
  reviews: any;
  news: any;
  storeInfo: any;
  company: any;
  access: any;
  faq: any;
  contact: any;
  footer: any;
}

const API_ENDPOINT = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/save-content';

export async function fetchSiteData(userId: string): Promise<SiteData | null> {
  try {
    if (!API_ENDPOINT) {
      console.warn('API Gateway endpoint not configured');
      return null;
    }

    const response = await fetch(`${API_ENDPOINT}/sites/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch site data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching site data:', error);
    return null;
  }
}

export async function saveSiteData(userId: string, data: Partial<SiteData>): Promise<boolean> {
  try {
    if (!API_ENDPOINT) {
      alert('API Gatewayエンドポイントが設定されていません。設定から登録してください。');
      return false;
    }

    const response = await fetch(`${API_ENDPOINT}/sites/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save site data');
    }

    return true;
  } catch (error) {
    console.error('Error saving site data:', error);
    alert('データの保存に失敗しました');
    return false;
  }
}

export async function saveSection(userId: string, section: string, data: any): Promise<boolean> {
  try {
    const payload = {
      storeId: userId,
      section: section,
      content: data,
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error('Failed to save section data');
    }

    const result = await response.json();
    console.log('Save successful:', result);
    return true;
  } catch (error) {
    console.error('Error saving section data:', error);
    alert('データの保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
    return false;
  }
}
