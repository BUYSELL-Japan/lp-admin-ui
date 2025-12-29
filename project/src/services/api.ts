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
const SETTINGS_ENDPOINT = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/settings';
const CONTENT_ENDPOINT = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/get-content';
const TRANSLATE_ENDPOINT = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/translate';

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

export async function saveAllSections(userId: string, allSectionData: any): Promise<boolean> {
  try {
    const payload = {
      storeId: userId,
      section: 'all',
      content: allSectionData,
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
      throw new Error('Failed to save all sections data');
    }

    const result = await response.json();
    console.log('Save all sections successful:', result);
    return true;
  } catch (error) {
    console.error('Error saving all sections data:', error);
    alert('データの保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
    return false;
  }
}

export async function getSubdomain(storeId: string): Promise<string | null> {
  try {
    const response = await fetch(`${SETTINGS_ENDPOINT}/${storeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error('Failed to fetch subdomain');
    }

    const result = await response.json();
    console.log('Subdomain API Response:', result);
    console.log('Subdomain value:', result.subdomain);

    return result.subdomain || result.Subdomain || null;
  } catch (error) {
    console.error('Error fetching subdomain:', error);
    return null;
  }
}

export async function getSectionData(storeId: string): Promise<any | null> {
  try {
    const response = await fetch(`${CONTENT_ENDPOINT}/${storeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('No saved data found for store:', storeId);
        return null;
      }
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error('Failed to fetch section data');
    }

    const result = await response.json();
    console.log('=== API Response Debug ===');
    console.log('Raw result keys:', Object.keys(result));
    console.log('result.ContentData exists:', !!result.ContentData);
    console.log('========================');

    // DynamoDB returns data in ContentData field
    if (result.ContentData) {
      console.log('✓ Returning ContentData from DynamoDB');
      const contentData = result.ContentData;
      // Remove Status field as it's not part of section data
      if (contentData.Status) {
        delete contentData.Status;
      }
      return contentData;
    } else if (result.content) {
      return result.content;
    } else if (result.Content) {
      return result.Content;
    } else if (result.hero || result.about || result.menu) {
      return result;
    }

    console.log('⚠ No valid data structure found in response');
    return null;
  } catch (error) {
    console.error('Error fetching section data:', error);
    return null;
  }
}

async function translateSection(
  userId: string,
  sectionName: string,
  sectionContent: any,
  retryCount: number = 0
): Promise<any> {
  const translatePayload = {
    storeId: userId,
    section: sectionName,
    content: { [sectionName]: sectionContent },
    targetLanguages: ['en', 'zh', 'ko']
  };

  try {
    const translateResponse = await fetch(TRANSLATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(translatePayload),
    });

    if (!translateResponse.ok) {
      if (translateResponse.status === 504 && retryCount === 0) {
        console.warn(`504 timeout for ${sectionName}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return translateSection(userId, sectionName, sectionContent, retryCount + 1);
      }

      const errorText = await translateResponse.text();
      console.error(`Translation API Error for ${sectionName}:`, errorText);
      throw new Error(`Failed to translate section: ${sectionName}`);
    }

    return await translateResponse.json();
  } catch (error) {
    if (retryCount === 0 && (error instanceof TypeError || (error as any).name === 'AbortError')) {
      console.warn(`Network error for ${sectionName}, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return translateSection(userId, sectionName, sectionContent, retryCount + 1);
    }
    throw error;
  }
}

export async function translateAndSave(userId: string, allSectionData: any): Promise<boolean> {
  try {
    const sections = Object.keys(allSectionData);
    const translatedData: any = {};

    console.log('Translating content section by section...');
    console.log('Total sections to translate:', sections.length);

    for (let i = 0; i < sections.length; i++) {
      const sectionName = sections[i];
      const sectionContent = allSectionData[sectionName];

      console.log(`Translating section ${i + 1}/${sections.length}: ${sectionName}`);

      const sectionTranslatedData = await translateSection(userId, sectionName, sectionContent);
      Object.assign(translatedData, sectionTranslatedData);

      console.log(`Section ${sectionName} translated successfully`);
    }

    console.log('All sections translated successfully');
    console.log('Translated sections:', Object.keys(translatedData));

    const savePayload = {
      storeId: userId,
      section: 'all',
      content: translatedData,
    };

    console.log('Saving translated content...');
    const saveResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savePayload),
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error('Save API Error:', errorText);
      throw new Error('Failed to save translated content');
    }

    const result = await saveResponse.json();
    console.log('Save translated content successful:', result);
    return true;
  } catch (error) {
    console.error('Error in translate and save:', error);
    alert('翻訳または保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
    return false;
  }
}
