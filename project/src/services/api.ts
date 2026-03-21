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

// Cloudflare Deploy Webhook URL
const CLOUDFLARE_WEBHOOK_URL = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/8c8ca4f1-f500-41c5-968a-4c92046077e8';

export async function triggerDeployWebhook(): Promise<boolean> {
  try {
    const response = await fetch(CLOUDFLARE_WEBHOOK_URL, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Webhook request failed');
    }
    console.log('Deploy Webhook triggered successfully');
    return true;
  } catch (error) {
    console.error('Failed to trigger webhook:', error);
    return false;
  }
}

// 有効なセクション名のリスト
const VALID_SECTIONS = [
  'header', 'hero', 'about', 'menu', 'pricing', 'cta',
  'gallery', 'staff', 'reviews', 'news', 'storeInfo',
  'company', 'access', 'faq', 'contact', 'footer'
];

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
    const normalizedData = normalizeDataStructure(data, section);

    const payload = {
      storeId: userId,
      section: section,
      content: normalizedData,
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

// No longer needed - Lambda returns multilingual object format

export async function saveAllSections(userId: string, allSectionData: any, status: 'Draft' | 'Published' = 'Draft'): Promise<boolean> {
  try {
    console.log(`=== Saving all sections (Status: ${status}, with normalization) ===`);

    const normalizedContent: any = {};

    for (const sectionName in allSectionData) {
      if (VALID_SECTIONS.includes(sectionName)) {
        console.log(`Normalizing ${sectionName}...`);
        normalizedContent[sectionName] = normalizeDataStructure(allSectionData[sectionName], sectionName);
      } else {
        normalizedContent[sectionName] = allSectionData[sectionName];
      }
    }

    const payload = {
      storeId: userId,
      section: 'all',
      content: normalizedContent,
      status: status
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

// 多言語オブジェクトから日本語のみを抽出する関数
function extractJapanese(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // プリミティブ型はそのまま返す
  if (typeof obj !== 'object') {
    return obj;
  }

  // 配列の場合は各要素を再帰的に処理
  if (Array.isArray(obj)) {
    return obj.map(item => extractJapanese(item));
  }

  // 多言語オブジェクトかチェック（ja, en, ko, zh-tw のキーを持つ）
  const keys = Object.keys(obj);
  const languageKeys = ['ja', 'en', 'ko', 'zh-tw'];
  const hasMultipleLanguages = languageKeys.filter(lang => keys.includes(lang)).length >= 2;

  if (hasMultipleLanguages && keys.includes('ja')) {
    // 日本語の値を返す（空文字の場合は空文字を返す）
    return obj.ja !== undefined ? obj.ja : '';
  }

  // 通常のオブジェクトの場合は各プロパティを再帰的に処理
  const result: any = {};
  for (const key in obj) {
    // メタデータフィールドはスキップ
    if (key === 'success' || key === 'storeId' || key === 'section' || key === 'targetLanguages') {
      continue;
    }
    result[key] = extractJapanese(obj[key]);
  }
  return result;
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

    const returnedStoreId = result.storeId || result.StoreId || (result.ContentData && (result.ContentData.storeId || result.ContentData.StoreId));
    if (returnedStoreId && returnedStoreId !== storeId) {
      console.warn(`[SECURITY] API returned data for store: ${returnedStoreId}, but requested: ${storeId}. Rejecting response to load initial sample data.`);
      return null; // Return null to fallback to initial sample data
    }

    let contentData = null;

    if (result.ContentData) {
      console.log('✓ Returning ContentData from DynamoDB');
      contentData = result.ContentData;
      if (contentData.Status) {
        delete contentData.Status;
      }
    } else if (result.content) {
      contentData = result.content;
    } else if (result.Content) {
      contentData = result.Content;
    } else if (result.hero || result.about || result.menu) {
      contentData = result;
    }

    if (!contentData) {
      console.log('⚠ No valid data structure found in response');
      return null;
    }

    console.log('✓ Processing multilingual data structure');
    console.log('ContentData sections:', Object.keys(contentData).join(', '));

    const normalizedData: any = {};
    for (const sectionKey in contentData) {
      const section = contentData[sectionKey];

      console.log(`\n=== Processing section: ${sectionKey} ===`);
      console.log(`  Type:`, typeof section);
      console.log(`  Is Object:`, section && typeof section === 'object');
      console.log(`  Keys:`, section && typeof section === 'object' ? Object.keys(section).slice(0, 5).join(', ') : 'N/A');

      if (!section || typeof section !== 'object') {
        console.log(`  ⚠ Skipping invalid section`);
        continue;
      }

      let extractedData = null;

      if (section.translatedData && typeof section.translatedData === 'object') {
        console.log(`  Has translatedData wrapper`);
        const translatedKeys = Object.keys(section.translatedData);
        console.log(`  translatedData keys:`, translatedKeys.join(', '));

        if (section.translatedData[sectionKey]) {
          console.log(`  ✓ Found nested section key: ${sectionKey}`);
          extractedData = section.translatedData[sectionKey];
        } else {
          console.log(`  ✓ Using translatedData directly`);
          extractedData = section.translatedData;
        }
      } else {
        console.log(`  ✓ No wrapper, using section directly`);
        extractedData = section;
      }

      if (extractedData && typeof extractedData === 'object') {
        const dataKeys = Object.keys(extractedData);
        console.log(`  Extracted data keys:`, dataKeys.slice(0, 10).join(', '));
        console.log(`  Sample field:`, dataKeys[0], '=', JSON.stringify(extractedData[dataKeys[0]]).substring(0, 100));
        normalizedData[sectionKey] = extractedData;
      } else {
        console.log(`  ⚠ No valid data extracted`);
      }
    }

    console.log('\n=== Conversion Summary ===');
    console.log('Normalized sections:', Object.keys(normalizedData).join(', '));
    if (normalizedData.hero) {
      console.log('Hero data sample:', JSON.stringify(normalizedData.hero, null, 2).substring(0, 300));
    }

    console.log('\n=== Converting to Editor Format ===');
    const editorFormatData: any = {};
    for (const sectionKey in normalizedData) {
      console.log(`Converting ${sectionKey}...`);
      editorFormatData[sectionKey] = convertMultilingualToEditorFormat(normalizedData[sectionKey]);

      const convertedKeys = Object.keys(editorFormatData[sectionKey] || {});
      console.log(`  ✓ ${sectionKey} converted, keys:`, convertedKeys.slice(0, 10).join(', '));

      if (sectionKey === 'hero') {
        console.log(`  Hero title:`, editorFormatData[sectionKey].title);
        console.log(`  Hero subtitle:`, editorFormatData[sectionKey].subtitle);
      }
    }

    console.log('\n=== Final Editor Data ===');
    console.log('Sections:', Object.keys(editorFormatData).join(', '));
    console.log('Hero data:', JSON.stringify(editorFormatData.hero, null, 2).substring(0, 300));

    return editorFormatData;
  } catch (error) {
    console.error('Error fetching section data:', error);
    return null;
  }
}

function convertMultilingualToEditorFormat(obj: any, depth: number = 0): any {
  if (obj === null || obj === undefined || depth > 10) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertMultilingualToEditorFormat(item, depth + 1));
  }

  const keys = Object.keys(obj);
  const languageKeys = ['ja', 'en', 'ko', 'zh-tw'];
  const hasOnlyLanguageKeys = keys.length > 0 && keys.every(key => languageKeys.includes(key));

  if (hasOnlyLanguageKeys && obj.ja !== undefined) {
    return obj.ja;
  }

  const result: any = {};
  for (const key in obj) {
    result[key] = convertMultilingualToEditorFormat(obj[key], depth + 1);
  }
  return result;
}

function convertLegacyFormatToMultilingual(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertLegacyFormatToMultilingual(item));
  }

  const result: any = {};
  const processedFields = new Set<string>();

  for (const key in obj) {
    if (processedFields.has(key)) {
      continue;
    }

    if (key.endsWith('_ja') || key.endsWith('_en') || key.endsWith('_ko') || key.endsWith('_zh') || key.endsWith('_zh-tw')) {
      const baseFieldName = key.replace(/_(?:ja|en|ko|zh-tw|zh)$/, '');

      if (!processedFields.has(baseFieldName)) {
        const multilingualField: any = {};

        if (obj[`${baseFieldName}_ja`] !== undefined) {
          multilingualField.ja = obj[`${baseFieldName}_ja`];
          processedFields.add(`${baseFieldName}_ja`);
        }
        if (obj[`${baseFieldName}_en`] !== undefined) {
          multilingualField.en = obj[`${baseFieldName}_en`];
          processedFields.add(`${baseFieldName}_en`);
        }
        if (obj[`${baseFieldName}_ko`] !== undefined) {
          multilingualField.ko = obj[`${baseFieldName}_ko`];
          processedFields.add(`${baseFieldName}_ko`);
        }
        if (obj[`${baseFieldName}_zh-tw`] !== undefined) {
          multilingualField['zh-tw'] = obj[`${baseFieldName}_zh-tw`];
          processedFields.add(`${baseFieldName}_zh-tw`);
        }
        if (obj[`${baseFieldName}_zh`] !== undefined) {
          multilingualField['zh-tw'] = obj[`${baseFieldName}_zh`];
          processedFields.add(`${baseFieldName}_zh`);
        }

        if (Object.keys(multilingualField).length > 0) {
          result[baseFieldName] = multilingualField;
          processedFields.add(baseFieldName);
        }
      }
    } else {
      processedFields.add(key);
      result[key] = convertLegacyFormatToMultilingual(obj[key]);
    }
  }

  return result;
}

function convertCategoriesToMultilingual(categories: any[]): any[] {
  if (!Array.isArray(categories)) {
    return categories;
  }

  return categories.map(cat => {
    if (typeof cat === 'string') {
      return { ja: cat, en: cat, ko: cat, 'zh-tw': cat };
    }
    return convertLegacyFormatToMultilingual(cat);
  });
}

function convertStringFieldsToMultilingual(obj: any, depth: number = 0): any {
  if (obj === null || obj === undefined || depth > 10) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertStringFieldsToMultilingual(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    const languageKeys = ['ja', 'en', 'ko', 'zh-tw'];
    const hasMultipleLanguages = languageKeys.filter(lang => keys.includes(lang)).length >= 2;

    if (hasMultipleLanguages) {
      return obj;
    }

    const result: any = {};
    for (const key in obj) {
      const value = obj[key];

      if (key === 'icon' || key === 'image' || key === 'url' || key === 'avatar' || key === 'backgroundImage' ||
          key === 'mainImage' || key === 'mapEmbedUrl' || key === 'link' || key === 'rating' || key === 'date' ||
          key === 'year' || key === 'price' || key === 'isPopular' || key === 'id' || key === 'type' || key === 'platform' ||
          key === 'categoryId') {
        result[key] = value;
      } else if (typeof value === 'string') {
        result[key] = { ja: value, en: value, ko: value, 'zh-tw': value };
      } else {
        result[key] = convertStringFieldsToMultilingual(value, depth + 1);
      }
    }
    return result;
  }

  return obj;
}

function hasMultilingualFormat(obj: any, depth: number = 0, maxDepth: number = 5): boolean {
  if (depth > maxDepth || !obj || typeof obj !== 'object') {
    return false;
  }

  if (Array.isArray(obj)) {
    return obj.some(item => hasMultilingualFormat(item, depth + 1, maxDepth));
  }

  const keys = Object.keys(obj);
  const languageKeys = ['ja', 'en', 'ko', 'zh-tw'];

  // 多言語オブジェクトかチェック
  const langKeysInObj = keys.filter(k => languageKeys.includes(k));
  if (langKeysInObj.length >= 2) {
    return true;
  }

  // 子オブジェクトを再帰的にチェック
  for (const key of keys) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (hasMultilingualFormat(obj[key], depth + 1, maxDepth)) {
        return true;
      }
    }
  }

  return false;
}

function normalizeDataStructure(data: any, sectionName: string): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  let normalized = convertLegacyFormatToMultilingual(data);

  const hasMultilingualData = hasMultilingualFormat(normalized);
  console.log(`${sectionName}: Multilingual data detected: ${hasMultilingualData}`);

  if (!hasMultilingualData) {
    console.log(`No multilingual data detected in ${sectionName}, converting string fields...`);
    normalized = convertStringFieldsToMultilingual(normalized);
  } else {
    console.log(`${sectionName}: Skipping string conversion, data already multilingual`);
  }

  if (sectionName === 'menu' && normalized.categories && Array.isArray(normalized.categories)) {
    const flatItems: any[] = [];

    for (const category of normalized.categories) {
      const categoryName = category.name || category.name_ja || category;
      const items = category.items || [];

      for (const item of items) {
        flatItems.push({
          ...item,
          category: typeof categoryName === 'object' ? categoryName : { ja: categoryName, en: categoryName, ko: categoryName, 'zh-tw': categoryName }
        });
      }
    }

    delete normalized.categories;
    normalized.items = flatItems;
  }

  if (sectionName === 'gallery') {
    if (normalized.categories && Array.isArray(normalized.categories)) {
      normalized.categories = normalized.categories.map((cat: any) => {
        if (typeof cat === 'string') {
          return { ja: cat, en: cat, ko: cat, 'zh-tw': cat };
        }
        return cat;
      });
    }

    if (normalized.images && Array.isArray(normalized.images)) {
      normalized.images = normalized.images.map((img: any) => {
        const processedImg: any = { ...img };

        if (img.caption && typeof img.caption === 'string') {
          processedImg.caption = { ja: img.caption, en: img.caption, ko: img.caption, 'zh-tw': img.caption };
        }
        if (img.alt && typeof img.alt === 'string') {
          processedImg.alt = { ja: img.alt, en: img.alt, ko: img.alt, 'zh-tw': img.alt };
        }
        if (img.category && typeof img.category === 'string') {
          processedImg.category = { ja: img.category, en: img.category, ko: img.category, 'zh-tw': img.category };
        }

        if (img.categoryId) {
          processedImg.categoryId = img.categoryId;
        } else if (img.category) {
          const categoryStr = typeof img.category === 'string' ? img.category : img.category.ja;
          if (categoryStr === '料理') {
            processedImg.categoryId = '1';
          } else if (categoryStr === '店内') {
            processedImg.categoryId = '2';
          } else if (categoryStr === 'イベント') {
            processedImg.categoryId = '3';
          }
        }

        return processedImg;
      });
    }
  }

  if (normalized.title && !normalized.sectionTitle) {
    normalized.sectionTitle = normalized.title;
    delete normalized.title;
  }
  if (normalized.subtitle && !normalized.sectionSubtitle) {
    normalized.sectionSubtitle = normalized.subtitle;
    delete normalized.subtitle;
  }

  if (sectionName === 'pricing' && normalized.plans && Array.isArray(normalized.plans)) {
    normalized.plans = normalized.plans.map((plan: any) => {
      const convertedPlan = { ...plan };

      if (convertedPlan.features && Array.isArray(convertedPlan.features)) {
        convertedPlan.features = convertedPlan.features.map((feature: any) => {
          if (typeof feature === 'string') {
            return { ja: feature, en: feature, ko: feature, 'zh-tw': feature };
          }
          if (feature.text_ja || feature.text_en) {
            return {
              ja: feature.text_ja || feature.ja || '',
              en: feature.text_en || feature.en || '',
              ko: feature.text_ko || feature.ko || '',
              'zh-tw': feature['text_zh-tw'] || feature['zh-tw'] || ''
            };
          }
          if (feature.ja || feature.en) {
            return feature;
          }
          if (typeof feature === 'object') {
            return { ja: feature, en: feature, ko: feature, 'zh-tw': feature };
          }
          return feature;
        });
      }

      return convertedPlan;
    });
  }

  return normalized;
}

async function translateItem(
  userId: string,
  itemId: string,
  itemContent: any,
  retryCount: number = 0
): Promise<any> {
  const translatePayload = {
    storeId: userId,
    section: itemId,
    content: itemContent,
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
      if (translateResponse.status === 504 && retryCount < 3) {
        const waitTimes = [15000, 25000, 35000];
        const waitTime = waitTimes[retryCount];
        console.warn(`504 timeout for ${itemId}, retrying in ${waitTime}ms (attempt ${retryCount + 1}/3)...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return translateItem(userId, itemId, itemContent, retryCount + 1);
      }

      const errorText = await translateResponse.text();
      console.error(`Translation API Error for ${itemId}:`, errorText);
      throw new Error(`Failed to translate item: ${itemId}`);
    }

    const response = await translateResponse.json();

    console.log(`  Raw API response keys for ${itemId}:`, Object.keys(response).join(', '));

    let extractedContent: any = null;

    if (response.content && typeof response.content === 'object') {
      console.log(`  ✓ Extracted content from response.content for ${itemId}`);
      extractedContent = response.content;
    }
    else if (response.storeId || response.section || response.targetLanguages) {
      console.log(`  API response contains metadata fields, extracting content for ${itemId}`);
      const contentOnly: any = {};
      for (const key in response) {
        if (key !== 'storeId' && key !== 'section' && key !== 'targetLanguages' && key !== 'content') {
          contentOnly[key] = response[key];
        }
      }
      if (Object.keys(contentOnly).length > 0) {
        extractedContent = contentOnly;
      }
    }
    else {
      console.log(`  Using entire response for ${itemId}`);
      extractedContent = response;
    }

    if (!extractedContent) {
      console.error(`  ✗ Could not extract valid content for ${itemId}`);
      throw new Error(`Invalid response structure for item: ${itemId}`);
    }

    // 翻訳結果の検証：多言語フィールドが存在するか確認
    const sampleField = Object.keys(extractedContent)[0];
    if (sampleField && extractedContent[sampleField] && typeof extractedContent[sampleField] === 'object') {
      const fieldKeys = Object.keys(extractedContent[sampleField]);
      const hasMultilingual = fieldKeys.includes('ja') || fieldKeys.includes('en');
      console.log(`  Multilingual check for ${itemId}: ${hasMultilingual ? 'PASS' : 'FAIL'}`);
      if (hasMultilingual) {
        console.log(`    Sample: ${sampleField} has languages: ${fieldKeys.join(', ')}`);
      } else {
        console.warn(`    ⚠ No multilingual data detected in ${itemId}. Sample field: ${sampleField}`);
      }
    }

    console.log(`  ✓ Successfully extracted content for ${itemId}`);
    return extractedContent;
  } catch (error) {
    if (retryCount < 3 && (error instanceof TypeError || (error as any).name === 'AbortError')) {
      const waitTimes = [15000, 25000, 35000];
      const waitTime = waitTimes[retryCount];
      console.warn(`Network error for ${itemId}, retrying in ${waitTime}ms (attempt ${retryCount + 1}/3)...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return translateItem(userId, itemId, itemContent, retryCount + 1);
    }
    throw error;
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
      if (translateResponse.status === 504 && retryCount < 3) {
        const waitTimes = [15000, 25000, 35000];
        const waitTime = waitTimes[retryCount];
        console.warn(`504 timeout for ${sectionName}, retrying in ${waitTime}ms (attempt ${retryCount + 1}/3)...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return translateSection(userId, sectionName, sectionContent, retryCount + 1);
      }

      const errorText = await translateResponse.text();
      console.error(`Translation API Error for ${sectionName}:`, errorText);
      throw new Error(`Failed to translate section: ${sectionName}`);
    }

    const response = await translateResponse.json();

    console.log(`  Raw API response keys for ${sectionName}:`, Object.keys(response).join(', '));

    let extractedContent: any = null;

    if (response.content && typeof response.content === 'object') {
      console.log(`  Extracted content keys for ${sectionName}:`, Object.keys(response.content).join(', '));
      extractedContent = response.content;
    }
    else if (response.storeId || response.section || response.targetLanguages) {
      console.warn(`  API response contains metadata fields. Attempting to extract content for ${sectionName}`);
      const contentOnly: any = {};
      for (const key in response) {
        if (key !== 'storeId' && key !== 'section' && key !== 'targetLanguages' && key !== 'content') {
          contentOnly[key] = response[key];
        }
      }
      if (Object.keys(contentOnly).length > 0) {
        console.log(`  Extracted content keys (fallback) for ${sectionName}:`, Object.keys(contentOnly).join(', '));
        extractedContent = contentOnly;
      }
    }
    else {
      console.log(`  Using entire response for ${sectionName}`);
      extractedContent = response;
    }

    if (extractedContent && extractedContent[sectionName]) {
      console.log(`  ✓ Response has correct structure: { ${sectionName}: {...} }`);

      // 翻訳結果の検証：多言語フィールドが存在するか確認
      const sectionContent = extractedContent[sectionName];
      const sampleField = Object.keys(sectionContent).find(key => typeof sectionContent[key] === 'object' && sectionContent[key] !== null);
      if (sampleField && sectionContent[sampleField]) {
        const fieldKeys = Object.keys(sectionContent[sampleField]);
        const hasMultilingual = fieldKeys.includes('ja') || fieldKeys.includes('en');
        console.log(`  Multilingual check for ${sectionName}: ${hasMultilingual ? 'PASS' : 'FAIL'}`);
        if (hasMultilingual) {
          console.log(`    Sample: ${sampleField} has languages: ${fieldKeys.join(', ')}`);
        } else {
          console.warn(`    ⚠ No multilingual data detected in ${sectionName}. Sample field: ${sampleField}, keys: ${fieldKeys.join(', ')}`);
        }
      }

      return extractedContent;
    } else if (extractedContent) {
      console.warn(`  ⚠ Response missing section wrapper, wrapping as { ${sectionName}: {...} }`);
      return { [sectionName]: extractedContent };
    }

    console.error(`  ✗ Could not extract valid content for ${sectionName}`);
    throw new Error(`Invalid response structure for section: ${sectionName}`);
  } catch (error) {
    if (retryCount < 3 && (error instanceof TypeError || (error as any).name === 'AbortError')) {
      const waitTimes = [15000, 25000, 35000];
      const waitTime = waitTimes[retryCount];
      console.warn(`Network error for ${sectionName}, retrying in ${waitTime}ms (attempt ${retryCount + 1}/3)...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return translateSection(userId, sectionName, sectionContent, retryCount + 1);
    }
    throw error;
  }
}

function findArrayFields(content: any, prefix: string = ''): string[] {
  const arrayFields: string[] = [];
  for (const key in content) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(content[key])) {
      arrayFields.push(fullPath);
    } else if (content[key] && typeof content[key] === 'object') {
      arrayFields.push(...findArrayFields(content[key], fullPath));
    }
  }
  return arrayFields;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

async function translateCompanySection(
  userId: string,
  companyContent: any
): Promise<any> {
  console.log('\n=== Translating company section with field-level splitting ===');

  const parts: Array<{ name: string; content: any }> = [];

  if (companyContent.sectionTitle || companyContent.sectionSubtitle) {
    parts.push({
      name: 'company.sectionFields',
      content: {
        sectionTitle: companyContent.sectionTitle,
        sectionSubtitle: companyContent.sectionSubtitle
      }
    });
    console.log('  ✓ Added section title/subtitle part');
  }

  if (companyContent.philosophy) {
    parts.push({ name: 'company.philosophy', content: { philosophy: companyContent.philosophy } });
    console.log('  ✓ Added philosophy part');
  }

  if (companyContent.history?.timeline && Array.isArray(companyContent.history.timeline)) {
    parts.push({ name: 'company.history', content: { history: companyContent.history } });
    console.log(`  ✓ Added history part (${companyContent.history.timeline.length} timeline items)`);
  }

  if (companyContent.companyInfo) {
    parts.push({ name: 'company.companyInfo', content: { companyInfo: companyContent.companyInfo } });
    const itemCount = companyContent.companyInfo.items?.length || 0;
    console.log(`  ✓ Added companyInfo part (${itemCount} info items)`);
  }

  if (parts.length === 0) {
    console.log('  No parts to split, translating entire company section');
    return translateSection(userId, 'company', companyContent);
  }

  console.log(`  Total parts to translate: ${parts.length}`);

  const mergedResult: any = { company: {} };

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    console.log(`\n  [${i + 1}/${parts.length}] Translating ${part.name}...`);

    const partResult = await translateSection(userId, 'company', part.content);

    // partResult は { company: {...} } という構造を期待
    if (partResult.company) {
      const keysBefore = Object.keys(mergedResult.company).length;
      Object.assign(mergedResult.company, partResult.company);
      const keysAfter = Object.keys(mergedResult.company).length;
      console.log(`  ✓ Merged ${part.name}: ${keysBefore} -> ${keysAfter} keys`);
    } else {
      console.warn(`  ⚠ Unexpected structure from translateSection for ${part.name}`);
      console.warn(`  Available keys:`, Object.keys(partResult).join(', '));
      Object.assign(mergedResult.company, partResult);
    }

    if (i < parts.length - 1) {
      console.log('  Waiting 5s before next company part...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log(`\n  ✓ Company section completed`);
  return mergedResult;
}

async function translateHeaderSection(
  userId: string,
  headerContent: any
): Promise<any> {
  console.log('\n=== Translating header section with simplified item-by-item processing ===');

  const navigation = headerContent.navigation || [];
  if (navigation.length === 0) {
    console.log('  No navigation items found, translating entire header section');
    return translateSection(userId, 'header', headerContent);
  }

  console.log(`  Total navigation items to translate: ${navigation.length}`);

  const translatedLogo = headerContent.logo
    ? await translateItem(userId, 'header-logo', { text: headerContent.logo.text })
    : { text: headerContent.logo?.text || '' };

  const translatedNavigationItems: any[] = [];

  for (let i = 0; i < navigation.length; i++) {
    console.log(`\n  [${i + 1}/${navigation.length}] Translating nav item: "${navigation[i].label}" (id: ${navigation[i].id})...`);

    try {
      const translatedNavItem = await translateItem(userId, `nav-${i}`, { label: navigation[i].label });

      const mergedNavItem = {
        id: navigation[i].id,
        ...translatedNavItem
      };

      console.log(`  ✓ Translated nav item ${i}:`, JSON.stringify(mergedNavItem, null, 2).substring(0, 200));
      translatedNavigationItems.push(mergedNavItem);

      if (i < navigation.length - 1) {
        console.log('  Waiting 3s before next navigation item...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`  ✗ Failed to translate navigation item ${i + 1}:`, error);
      throw error;
    }
  }

  const mergedResult = {
    header: {
      logo: translatedLogo,
      navigation: translatedNavigationItems
    }
  };

  console.log(`\n  ✓ Header section completed`);
  console.log(`  Final merged navigation items count: ${mergedResult.header.navigation.length}`);
  return mergedResult;
}

async function translatePricingSection(
  userId: string,
  pricingContent: any
): Promise<any> {
  console.log('\n=== Translating pricing section with simplified item-by-item processing ===');

  const plans = pricingContent.plans || [];
  if (plans.length === 0) {
    console.log('  No plans found, translating entire pricing section');
    return translateSection(userId, 'pricing', pricingContent);
  }

  console.log(`  Total plans to translate: ${plans.length}`);

  const translatedSectionFields = pricingContent.sectionTitle
    ? await translateItem(userId, 'pricing-section-fields', {
        sectionTitle: pricingContent.sectionTitle,
        sectionSubtitle: pricingContent.sectionSubtitle || ''
      })
    : { sectionTitle: pricingContent.sectionTitle, sectionSubtitle: pricingContent.sectionSubtitle };

  const translatedPlans: any[] = [];

  for (let i = 0; i < plans.length; i++) {
    const featureCount = plans[i].features?.length || 0;
    console.log(`\n  [${i + 1}/${plans.length}] Translating plan: "${plans[i].name}" (${featureCount} features)...`);

    const translatedPlan = await translateItem(userId, `plan-${i}`, plans[i]);

    console.log(`  ✓ Translated plan ${i}:`, JSON.stringify(translatedPlan, null, 2).substring(0, 300));
    translatedPlans.push(translatedPlan);

    if (i < plans.length - 1) {
      console.log('  Waiting 5s before next pricing plan...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  const mergedResult = {
    pricing: {
      ...translatedSectionFields,
      plans: translatedPlans
    }
  };

  console.log(`\n  ✓ Pricing section completed`);
  console.log(`  Final merged pricing plans count: ${mergedResult.pricing.plans.length}`);
  if (mergedResult.pricing.plans.length > 0) {
    console.log(`  Final merged pricing sample:`, JSON.stringify(mergedResult.pricing, null, 2).substring(0, 600));
  } else {
    console.warn('  ⚠️ No plans were merged!');
  }
  return mergedResult;
}

async function translateStaffSection(userId: string, staffContent: any): Promise<any> {
  console.log('\n=== Translating staff section with simplified item-by-item processing ===');

  const members = staffContent.members || [];
  if (members.length === 0) {
    console.log('  No members found, translating entire staff section');
    return translateSection(userId, 'staff', staffContent);
  }

  console.log(`  Total members to translate: ${members.length}`);

  const translatedSectionFields = staffContent.sectionTitle
    ? await translateItem(userId, 'staff-section-fields', {
        sectionTitle: staffContent.sectionTitle,
        sectionSubtitle: staffContent.sectionSubtitle || ''
      })
    : { sectionTitle: staffContent.sectionTitle, sectionSubtitle: staffContent.sectionSubtitle };

  const translatedMembers: any[] = [];

  for (let i = 0; i < members.length; i++) {
    console.log(`\n  [${i + 1}/${members.length}] Translating member: "${members[i].name}"...`);

    try {
      const translatedMember = await translateItem(userId, `member-${i}`, members[i]);

      console.log(`  ✓ Translated member ${i}:`, JSON.stringify(translatedMember, null, 2).substring(0, 300));
      translatedMembers.push(translatedMember);

      if (i < members.length - 1) {
        console.log('  Waiting 5s before next staff member...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`  ✗ Failed to translate staff member ${i + 1}:`, error);
      throw error;
    }
  }

  const mergedResult = {
    staff: {
      ...translatedSectionFields,
      members: translatedMembers
    }
  };

  console.log(`\n  ✓ Staff section completed`);
  return mergedResult;
}

async function translateReviewsSection(userId: string, reviewsContent: any): Promise<any> {
  console.log('\n=== Translating reviews section with simplified item-by-item processing ===');

  const reviews = reviewsContent.reviews || [];
  if (reviews.length === 0) {
    console.log('  No reviews found, translating entire reviews section');
    return translateSection(userId, 'reviews', reviewsContent);
  }

  console.log(`  Total reviews to translate: ${reviews.length}`);

  const translatedSectionFields = reviewsContent.sectionTitle
    ? await translateItem(userId, 'reviews-section-fields', {
        sectionTitle: reviewsContent.sectionTitle,
        sectionSubtitle: reviewsContent.sectionSubtitle || ''
      })
    : { sectionTitle: reviewsContent.sectionTitle, sectionSubtitle: reviewsContent.sectionSubtitle };

  const translatedReviews: any[] = [];

  for (let i = 0; i < reviews.length; i++) {
    console.log(`\n  [${i + 1}/${reviews.length}] Translating review from: "${reviews[i].name}"...`);

    try {
      const translatedReview = await translateItem(userId, `review-${i}`, reviews[i]);

      console.log(`  ✓ Translated review ${i}:`, JSON.stringify(translatedReview, null, 2).substring(0, 300));
      translatedReviews.push(translatedReview);

      if (i < reviews.length - 1) {
        console.log('  Waiting 5s before next review...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`  ✗ Failed to translate review ${i + 1}:`, error);
      throw error;
    }
  }

  const mergedResult = {
    reviews: {
      ...translatedSectionFields,
      reviews: translatedReviews
    }
  };

  console.log(`\n  ✓ Reviews section completed`);
  console.log(`  Final merged reviews count: ${mergedResult.reviews.reviews.length}`);
  if (mergedResult.reviews.reviews.length > 0) {
    console.log(`  Final merged reviews sample:`, JSON.stringify(mergedResult.reviews, null, 2).substring(0, 600));
  } else {
    console.warn('  ⚠️ No reviews were merged!');
  }
  return mergedResult;
}

async function translateAccessSection(userId: string, accessContent: any): Promise<any> {
  console.log('\n=== Translating access section with simplified item-by-item processing ===');

  const methods = accessContent.transportation?.methods || [];
  if (methods.length === 0) {
    console.log('  No transportation methods found, translating entire access section');
    return translateSection(userId, 'access', accessContent);
  }

  console.log(`  Total transportation methods to translate: ${methods.length}`);

  const baseFields = {
    sectionTitle: accessContent.sectionTitle,
    sectionSubtitle: accessContent.sectionSubtitle,
    address: accessContent.address,
    mapEmbedUrl: accessContent.mapEmbedUrl,
    parking: accessContent.parking
  };

  const translatedBaseFields = await translateItem(userId, 'access-base-fields', baseFields);
  const translatedTransportationTitle = await translateItem(userId, 'access-transportation-title', {
    title: accessContent.transportation.title
  });

  const translatedMethods: any[] = [];

  for (let i = 0; i < methods.length; i++) {
    console.log(`\n  [${i + 1}/${methods.length}] Translating method: "${methods[i].type}"...`);

    try {
      const translatedMethod = await translateItem(userId, `method-${i}`, methods[i]);

      console.log(`  ✓ Translated method ${i}:`, JSON.stringify(translatedMethod, null, 2).substring(0, 300));
      translatedMethods.push(translatedMethod);

      if (i < methods.length - 1) {
        console.log('  Waiting 5s before next transportation method...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`  ✗ Failed to translate access method ${i + 1}:`, error);
      throw error;
    }
  }

  const mergedResult = {
    access: {
      ...translatedBaseFields,
      transportation: {
        ...translatedTransportationTitle,
        methods: translatedMethods
      }
    }
  };

  console.log(`\n  ✓ Access section completed`);
  console.log(`  Final merged access methods count: ${mergedResult.access.transportation.methods.length}`);
  if (mergedResult.access.transportation.methods.length > 0) {
    console.log(`  Final merged access sample:`, JSON.stringify(mergedResult.access, null, 2).substring(0, 600));
  } else {
    console.warn('  ⚠️ No access methods were merged!');
  }
  return mergedResult;
}

async function translateStoreInfoSection(userId: string, storeInfoContent: any): Promise<any> {
  console.log('\n=== Translating storeInfo section with simplified item-by-item processing ===');

  const items = storeInfoContent.items || [];
  if (items.length === 0) {
    console.log('  No items found, translating entire storeInfo section');
    return translateSection(userId, 'storeInfo', storeInfoContent);
  }

  console.log(`  Total items to translate: ${items.length}`);

  const baseFields = {
    sectionTitle: storeInfoContent.sectionTitle,
    mainImage: storeInfoContent.mainImage,
    mainImageCaption: storeInfoContent.mainImageCaption
  };

  const translatedBaseFields = await translateItem(userId, 'storeInfo-base-fields', baseFields);

  const translatedItems: any[] = [];

  for (let i = 0; i < items.length; i++) {
    console.log(`\n  [${i + 1}/${items.length}] Translating item: "${items[i].title}"...`);

    try {
      const translatedItem = await translateItem(userId, `storeInfo-item-${i}`, items[i]);

      console.log(`  ✓ Translated item ${i}:`, JSON.stringify(translatedItem, null, 2).substring(0, 300));
      translatedItems.push(translatedItem);

      if (i < items.length - 1) {
        console.log('  Waiting 3s before next item...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`  ✗ Failed to translate storeInfo item ${i + 1}:`, error);
      throw error;
    }
  }

  const mergedResult = {
    storeInfo: {
      ...translatedBaseFields,
      items: translatedItems
    }
  };

  console.log(`\n  ✓ StoreInfo section completed`);
  console.log(`  Final merged items count: ${mergedResult.storeInfo.items.length}`);
  if (mergedResult.storeInfo.items.length > 0) {
    console.log(`  Final merged storeInfo sample:`, JSON.stringify(mergedResult.storeInfo, null, 2).substring(0, 600));
  } else {
    console.warn('  ⚠️ No items were merged!');
  }
  return mergedResult;
}

async function translateArraySectionOneByOne(
  userId: string,
  sectionName: string,
  sectionContent: any,
  mainArrayField: string,
  items: any[]
): Promise<any> {
  console.log(`\n=== ${sectionName}: Processing ${items.length} items one-by-one ===`);
  console.log(`  Array field: ${mainArrayField}`);

  const mergedResult: any = {};
  mergedResult[sectionName] = JSON.parse(JSON.stringify(sectionContent));
  setNestedValue(mergedResult[sectionName], mainArrayField, []);

  let isFirstItem = true;

  for (let i = 0; i < items.length; i++) {
    console.log(`\n  [${i + 1}/${items.length}] Translating item...`);

    const singleItemContent = JSON.parse(JSON.stringify(sectionContent));
    setNestedValue(singleItemContent, mainArrayField, [items[i]]);

    try {
      const itemResult = await translateSection(userId, sectionName, singleItemContent);

      // itemResult は { [sectionName]: {...} } という構造を期待
      if (itemResult[sectionName]) {
        // 最初のアイテムでは、セクション全体のフィールドをコピー（配列以外）
        if (isFirstItem) {
          for (const key in itemResult[sectionName]) {
            if (key !== mainArrayField.split('.')[0]) {
              mergedResult[sectionName][key] = itemResult[sectionName][key];
            }
          }
          console.log(`  ✓ Initialized fields:`, Object.keys(mergedResult[sectionName]).filter(k => k !== mainArrayField.split('.')[0]).join(', '));
          isFirstItem = false;
        }

        // 配列要素をマージ
        const itemArray = getNestedValue(itemResult[sectionName], mainArrayField);
        if (itemArray && Array.isArray(itemArray)) {
          const targetArray = getNestedValue(mergedResult[sectionName], mainArrayField);
          if (targetArray && Array.isArray(targetArray)) {
            targetArray.push(...itemArray);
            console.log(`  ✓ Added item (total: ${targetArray.length}/${items.length})`);
          } else {
            console.warn(`  ⚠ Target array not found at ${mainArrayField}`);
          }
        } else {
          console.warn(`  ⚠ Item array not found in result`);
        }
      } else {
        console.warn(`  ⚠ Unexpected structure from translateSection for ${sectionName} item ${i + 1}`);
        console.warn(`  Available keys:`, Object.keys(itemResult).join(', '));
      }

      if (i < items.length - 1) {
        console.log('  Waiting 5s before next item...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`  ✗ ${sectionName}: Failed to translate item ${i + 1}:`, error);
      throw error;
    }
  }

  console.log(`\n  ✓ ${sectionName}: All items merged successfully`);
  return mergedResult;
}

async function translateSectionInBatches(
  userId: string,
  sectionName: string,
  sectionContent: any
): Promise<any> {
  console.log(`\n=== translateSectionInBatches: ${sectionName} ===`);

  if (sectionName === 'header') {
    console.log(`${sectionName}: Using specialized header translation function`);
    return translateHeaderSection(userId, sectionContent);
  }

  if (sectionName === 'company') {
    console.log(`${sectionName}: Using specialized company translation function`);
    return translateCompanySection(userId, sectionContent);
  }

  if (sectionName === 'pricing') {
    console.log(`${sectionName}: Using specialized pricing translation function`);
    return translatePricingSection(userId, sectionContent);
  }

  if (sectionName === 'staff') {
    console.log(`${sectionName}: Using specialized staff translation function`);
    return translateStaffSection(userId, sectionContent);
  }

  if (sectionName === 'reviews') {
    console.log(`${sectionName}: Using specialized reviews translation function`);
    return translateReviewsSection(userId, sectionContent);
  }

  if (sectionName === 'access') {
    console.log(`${sectionName}: Using specialized access translation function`);
    return translateAccessSection(userId, sectionContent);
  }

  if (sectionName === 'storeInfo') {
    console.log(`${sectionName}: Using specialized storeInfo translation function`);
    return translateStoreInfoSection(userId, sectionContent);
  }

  let BATCH_SIZE = 4;
  const BATCH_DELAY_MS = 5000;

  const arrayFields = findArrayFields(sectionContent);

  if (arrayFields.length === 0) {
    console.log(`${sectionName}: No array fields detected, processing as single request`);
    return translateSection(userId, sectionName, sectionContent);
  }

  console.log(`${sectionName}: Using array field for batch processing: ${arrayFields[0]}`);
  const mainArrayField = arrayFields[0];
  const items = getNestedValue(sectionContent, mainArrayField);

  if (!Array.isArray(items)) {
    console.log(`${sectionName}: Field '${mainArrayField}' is not an array, processing as single request`);
    return translateSection(userId, sectionName, sectionContent);
  }

  console.log(`${sectionName}: Array '${mainArrayField}' has ${items.length} items`);

  if (items.length <= BATCH_SIZE) {
    console.log(`${sectionName}: ${items.length} items <= batch size (${BATCH_SIZE}), processing in single request`);
    try {
      return await translateSection(userId, sectionName, sectionContent);
    } catch (error: any) {
      if (error.message?.includes('504') || error.message?.includes('500')) {
        console.warn(`${sectionName}: Got timeout/error with ${items.length} items, falling back to one-by-one processing`);
        return translateArraySectionOneByOne(userId, sectionName, sectionContent, mainArrayField, items);
      }
      throw error;
    }
  }

  const translatedBatches: any[] = [];
  let currentBatchSize = BATCH_SIZE;

  for (let i = 0; i < items.length; i += currentBatchSize) {
    const batch = items.slice(i, i + currentBatchSize);
    const batchNumber = Math.floor(i / currentBatchSize) + 1;
    const totalBatches = Math.ceil(items.length / currentBatchSize);

    console.log(`${sectionName}: Translating batch ${batchNumber} (${batch.length} items, batch size: ${currentBatchSize})...`);

    const batchContent = JSON.parse(JSON.stringify(sectionContent));
    setNestedValue(batchContent, mainArrayField, batch);

    try {
      const batchResult = await translateSection(userId, sectionName, batchContent);
      translatedBatches.push(batchResult);

      console.log(`${sectionName}: Batch ${batchNumber} completed`);

      if (i + currentBatchSize < items.length) {
        console.log(`Waiting ${BATCH_DELAY_MS}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
      }
    } catch (error: any) {
      if ((error.message?.includes('504') || error.message?.includes('500')) && currentBatchSize > 1) {
        console.warn(`${sectionName}: Batch ${batchNumber} failed with timeout/error, reducing batch size to 1 and retrying remaining items`);

        const remainingItems = items.slice(i);
        console.log(`${sectionName}: Processing ${remainingItems.length} remaining items one by one...`);

        const remainingResult = await translateArraySectionOneByOne(
          userId,
          sectionName,
          sectionContent,
          mainArrayField,
          remainingItems
        );

        translatedBatches.push(remainingResult);
        break;
      }
      throw error;
    }
  }

  console.log(`${sectionName}: Merging ${translatedBatches.length} batches...`);

  if (translatedBatches.length === 0) {
    console.warn(`${sectionName}: No batches to merge`);
    return { [sectionName]: sectionContent };
  }

  const mergedResult: any = {};
  mergedResult[sectionName] = JSON.parse(JSON.stringify(sectionContent));
  setNestedValue(mergedResult[sectionName], mainArrayField, []);

  let isFirstBatch = true;

  for (const batchResult of translatedBatches) {
    // batchResult は { [sectionName]: {...} } という構造を期待
    if (batchResult[sectionName]) {
      // 最初のバッチでは、セクション全体のフィールドをコピー（配列以外）
      if (isFirstBatch) {
        for (const key in batchResult[sectionName]) {
          if (key !== mainArrayField) {
            mergedResult[sectionName][key] = batchResult[sectionName][key];
          }
        }
        isFirstBatch = false;
      }

      // 配列要素をマージ
      const batchArray = getNestedValue(batchResult[sectionName], mainArrayField);
      if (batchArray && Array.isArray(batchArray)) {
        const targetArray = getNestedValue(mergedResult[sectionName], mainArrayField);
        if (targetArray && Array.isArray(targetArray)) {
          targetArray.push(...batchArray);
        }
      }
    } else {
      console.warn(`${sectionName}: Unexpected batch result structure`);
    }
  }

  console.log(`${sectionName}: All batches merged successfully`);
  return mergedResult;
}

export async function translateAndSave(
  userId: string,
  allSectionData: any,
  onProgress?: (current: number, total: number, sectionName: string) => void
): Promise<boolean> {
  try {
    // 有効なセクションのみをフィルタリング
    const sections = Object.keys(allSectionData).filter(sectionName =>
      VALID_SECTIONS.includes(sectionName)
    );

    const mergedContent: any = {};

    console.log('Translating content with full serial processing...');
    console.log('Total sections to translate:', sections.length);
    console.log('Valid sections:', sections.join(', '));
    console.log('All sections will be processed one by one to avoid API Gateway timeout');

    // まずオリジナルの日本語データをベースにコピー（有効なセクションのみ）
    for (const sectionName of sections) {
      mergedContent[sectionName] = JSON.parse(JSON.stringify(allSectionData[sectionName]));
    }

    let completedCount = 0;

    for (let i = 0; i < sections.length; i++) {
      const sectionName = sections[i];
      console.log(`\n[${i + 1}/${sections.length}] Processing section: ${sectionName}`);

      const sectionContent = allSectionData[sectionName];

      const sectionTranslatedData = await translateSectionInBatches(userId, sectionName, sectionContent);

      let actualData = sectionTranslatedData.translatedData || sectionTranslatedData;

      // デバッグ：返された翻訳データの構造を確認
      console.log(`  actualData structure for ${sectionName}:`, Object.keys(actualData).join(', '));

      // レスポンスにメタデータが含まれているかチェック
      if (actualData.storeId || actualData.section || actualData.targetLanguages) {
        console.warn(`  Response contains metadata, extracting content only for ${sectionName}`);
        if (actualData.content) {
          actualData = actualData.content;
          console.log(`  Extracted content structure:`, Object.keys(actualData).join(', '));
        }
      }

      // actualData が { [sectionName]: {...} } の形式の場合、その中身を取り出す
      if (actualData[sectionName] && typeof actualData[sectionName] === 'object') {
        console.log(`  ✓ Direct section match found for ${sectionName}`);
        console.log(`  DEBUG: Section data sample:`, JSON.stringify(actualData[sectionName], null, 2).substring(0, 800));
        mergedContent[sectionName] = actualData[sectionName];
      }
      // actualData が複数セクションを含む場合（バッチ処理の結果など）
      else {
        console.log(`  Processing multiple sections from response`);
        for (const secName in actualData) {
          // 有効なセクション名のみ処理
          if (!VALID_SECTIONS.includes(secName)) {
            console.log(`  Skipping invalid key: ${secName}`);
            continue;
          }
          console.log(`  DEBUG: Merging section ${secName}, data sample:`, JSON.stringify(actualData[secName], null, 2).substring(0, 400));
          mergedContent[secName] = actualData[secName];
        }
      }

      completedCount++;
      if (onProgress) {
        onProgress(completedCount, sections.length, sectionName);
      }

      console.log(`✓ Section ${sectionName} completed (${completedCount}/${sections.length})`);

      if (i < sections.length - 1) {
        console.log('Waiting 5s before next section...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log('\nAll sections translated successfully');
    console.log('Merged content structure:', Object.keys(mergedContent).join(', '));

    // デバッグ：各セクションのデータ量を確認
    for (const sectionName of Object.keys(mergedContent)) {
      const section = mergedContent[sectionName];
      if (section && typeof section === 'object') {
        const arrayFields = findArrayFields(section);
        if (arrayFields.length > 0) {
          for (const field of arrayFields) {
            const arr = getNestedValue(section, field);
            if (Array.isArray(arr)) {
              console.log(`  ${sectionName}.${field}: ${arr.length} items`);
              if (arr.length > 0) {
                console.log(`    Sample item structure:`, Object.keys(arr[0]).join(', '));
                // 各アイテムの翻訳状況を確認
                const firstItem = arr[0];
                for (const key in firstItem) {
                  if (typeof firstItem[key] === 'object' && firstItem[key] !== null) {
                    const langs = Object.keys(firstItem[key]);
                    if (langs.includes('ja') || langs.includes('en')) {
                      console.log(`      ${key}: multilingual (${langs.join(', ')})`);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    const savePayload = {
      storeId: userId,
      section: 'all',
      content: mergedContent,
    };

    console.log('\nSaving translated content with', Object.keys(mergedContent).length, 'sections...');
    console.log('Save payload sections:', Object.keys(savePayload.content).join(', '));

    // 保存前に主要セクションのデータ構造を確認
    console.log('\n=== Final Save Data Structure Check ===');
    if (savePayload.content.pricing?.plans) {
      console.log('Pricing plans count:', savePayload.content.pricing.plans.length);
      if (savePayload.content.pricing.plans.length > 0) {
        console.log('First plan sample:', JSON.stringify(savePayload.content.pricing.plans[0], null, 2).substring(0, 500));
      } else {
        console.warn('⚠️ Pricing plans array is EMPTY!');
      }
    } else {
      console.warn('⚠️ Pricing section or plans array is missing!');
    }

    if (savePayload.content.reviews?.reviews) {
      console.log('Reviews count:', savePayload.content.reviews.reviews.length);
      if (savePayload.content.reviews.reviews.length > 0) {
        console.log('First review sample:', JSON.stringify(savePayload.content.reviews.reviews[0], null, 2).substring(0, 300));
      } else {
        console.warn('⚠️ Reviews array is EMPTY!');
      }
    } else {
      console.warn('⚠️ Reviews section or reviews array is missing!');
    }

    if (savePayload.content.access?.transportation?.methods) {
      console.log('Access methods count:', savePayload.content.access.transportation.methods.length);
      if (savePayload.content.access.transportation.methods.length > 0) {
        console.log('First method sample:', JSON.stringify(savePayload.content.access.transportation.methods[0], null, 2).substring(0, 300));
      } else {
        console.warn('⚠️ Access methods array is EMPTY!');
      }
    } else {
      console.warn('⚠️ Access section or methods array is missing!');
    }

    if (savePayload.content.staff?.members) {
      console.log('Staff members count:', savePayload.content.staff.members.length);
      if (savePayload.content.staff.members.length === 0) {
        console.warn('⚠️ Staff members array is EMPTY!');
      }
    } else {
      console.warn('⚠️ Staff section or members array is missing!');
    }
    console.log('========================================\n');

    // 翻訳後のデータは既に多言語形式なので、正規化処理は不要
    console.log('Skipping normalization for translated data (already in multilingual format)');

    // 最終的な保存データの多言語検証
    console.log('\n=== Final Save Data Multilingual Validation ===');
    for (const sectionName of Object.keys(mergedContent)) {
      const isMultilingual = hasMultilingualFormat(mergedContent[sectionName]);
      console.log(`${sectionName}: ${isMultilingual ? '✓ Multilingual' : '✗ NOT Multilingual'}`);

      if (!isMultilingual) {
        console.warn(`⚠️ WARNING: ${sectionName} does not have multilingual format!`);
        // サンプルデータを表示
        const sample = JSON.stringify(mergedContent[sectionName], null, 2).substring(0, 500);
        console.warn(`Sample data: ${sample}`);
      }
    }
    console.log('===============================================\n');

    const payloadString = JSON.stringify(savePayload);
    console.log(`Payload size: ${payloadString.length} characters`);

    const saveResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payloadString,
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error('Save API Error:', errorText);
      throw new Error('Failed to save translated content');
    }

    const result = await saveResponse.json();
    console.log('Save translated content successful:', result);
    console.log('✓ Translation and save completed successfully');

    return true;
  } catch (error) {
    console.error('Error in translate and save:', error);
    alert('翻訳または保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
    return false;
  }
}

export async function saveAllSectionsNormalized(userId: string, allSectionData: any): Promise<boolean> {
  try {
    console.log('=== Normalizing and saving all sections ===');

    const normalizedContent: any = {};

    for (const sectionName in allSectionData) {
      if (VALID_SECTIONS.includes(sectionName)) {
        console.log(`Normalizing ${sectionName}...`);
        normalizedContent[sectionName] = normalizeDataStructure(allSectionData[sectionName], sectionName);
      }
    }

    const payload = {
      storeId: userId,
      section: 'all',
      content: normalizedContent,
    };

    console.log('Normalized sections:', Object.keys(normalizedContent).join(', '));

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
      throw new Error('Failed to save normalized sections');
    }

    const result = await response.json();
    console.log('Save normalized sections successful:', result);
    return true;
  } catch (error) {
    console.error('Error saving normalized sections:', error);
    alert('データの保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
    return false;
  }
}
