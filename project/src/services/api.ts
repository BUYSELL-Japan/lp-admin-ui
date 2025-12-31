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

function mergeTranslationKeys(target: any, source: any): void {
  if (!source || typeof source !== 'object') {
    return;
  }

  // 配列の場合
  if (Array.isArray(source)) {
    if (!Array.isArray(target)) {
      console.warn('Target is not an array but source is. Skipping merge.');
      return;
    }
    // sourceの配列の長さに合わせてtargetを調整
    for (let i = 0; i < source.length; i++) {
      if (source[i] && typeof source[i] === 'object') {
        if (!target[i]) {
          target[i] = Array.isArray(source[i]) ? [] : {};
        }
        mergeTranslationKeys(target[i], source[i]);
      }
    }
    return;
  }

  // オブジェクトの場合
  for (const key in source) {
    const isTranslationKey = key.endsWith('_en') || key.endsWith('_zh') || key.endsWith('_ko');

    // 翻訳キー（_en, _zh, _ko）は常にマージ
    if (isTranslationKey) {
      target[key] = source[key];
      continue;
    }

    // 配列の場合
    if (Array.isArray(source[key])) {
      if (!Array.isArray(target[key])) {
        target[key] = [];
      }
      mergeTranslationKeys(target[key], source[key]);
      continue;
    }

    // ネストされたオブジェクトの場合
    if (source[key] && typeof source[key] === 'object') {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      mergeTranslationKeys(target[key], source[key]);
      continue;
    }

    // プリミティブ値（文字列、数値、真偽値など）
    // 日本語の元データを保持（targetに既に存在する場合は上書きしない）
    if (!(key in target)) {
      target[key] = source[key];
    }
  }
}

function countTranslationKeys(obj: any, prefix: string = ''): number {
  let count = 0;
  if (!obj || typeof obj !== 'object') {
    return 0;
  }

  for (const key in obj) {
    if (key.endsWith('_en') || key.endsWith('_zh') || key.endsWith('_ko')) {
      count++;
    } else if (obj[key] && typeof obj[key] === 'object') {
      count += countTranslationKeys(obj[key], prefix ? `${prefix}.${key}` : key);
    }
  }
  return count;
}

export async function saveAllSections(userId: string, allSectionData: any): Promise<boolean> {
  try {
    console.log('=== Saving all sections ===');
    console.log('Fetching existing data to preserve translations...');

    // 既存のデータを取得して翻訳データを保持
    const existingData = await getSectionData(userId);
    const contentToSave: any = {};

    // 新しい日本語データをベースにする
    for (const sectionName in allSectionData) {
      contentToSave[sectionName] = JSON.parse(JSON.stringify(allSectionData[sectionName]));
    }

    // 既存の翻訳データがあれば保持（ネストされたキーも含む）
    if (existingData) {
      console.log('Existing data found, preserving translation keys recursively...');
      for (const sectionName in existingData) {
        if (contentToSave[sectionName]) {
          mergeTranslationKeys(contentToSave[sectionName], existingData[sectionName]);
        }
      }

      // 翻訳データが保持されたか確認
      let preservedTranslationKeys = 0;
      for (const sectionName in contentToSave) {
        preservedTranslationKeys += countTranslationKeys(contentToSave[sectionName]);
      }
      console.log(`Preserved ${preservedTranslationKeys} translation keys from existing data (including nested)`);
    } else {
      console.log('No existing data found, saving new data only');
    }

    const payload = {
      storeId: userId,
      section: 'all',
      content: contentToSave,
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

function normalizeMultilingualFields(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'object' && !Array.isArray(data)) {
    const keys = Object.keys(data);
    if (keys.includes('ja') && (keys.includes('en') || keys.includes('ko') || keys.includes('zh-tw'))) {
      return data.ja || data.en || data.ko || data['zh-tw'] || '';
    }

    const normalized: any = {};
    for (const key in data) {
      normalized[key] = normalizeMultilingualFields(data[key]);
    }
    return normalized;
  }

  if (Array.isArray(data)) {
    return data.map(item => normalizeMultilingualFields(item));
  }

  return data;
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

    let contentData = null;

    // DynamoDB returns data in ContentData field
    if (result.ContentData) {
      console.log('✓ Returning ContentData from DynamoDB');
      contentData = result.ContentData;
      // Remove Status field as it's not part of section data
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

    console.log('Normalizing multilingual fields...');
    const normalized = normalizeMultilingualFields(contentData);
    console.log('✓ Multilingual fields normalized');

    return normalized;
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

    // レスポンスから content 部分のみを取り出す
    // レスポンス構造: { storeId, section, content: {...}, targetLanguages }
    if (response.content && typeof response.content === 'object') {
      console.log(`  Extracted content keys for ${sectionName}:`, Object.keys(response.content).join(', '));
      return response.content;
    }

    // レスポンスにメタデータフィールドが含まれている場合は除外
    if (response.storeId || response.section || response.targetLanguages) {
      console.warn(`  API response contains metadata fields. Attempting to extract content for ${sectionName}`);
      // メタデータフィールドを除外してコンテンツのみを返す
      const contentOnly: any = {};
      for (const key in response) {
        if (key !== 'storeId' && key !== 'section' && key !== 'targetLanguages' && key !== 'content') {
          contentOnly[key] = response[key];
        }
      }
      if (Object.keys(contentOnly).length > 0) {
        console.log(`  Extracted content keys (fallback) for ${sectionName}:`, Object.keys(contentOnly).join(', '));
        return contentOnly;
      }
    }

    // 最終フォールバック
    console.log(`  Using entire response for ${sectionName}`);
    return response;
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
  console.log('Translating company section with field-level splitting...');

  const parts: Array<{ name: string; content: any }> = [];

  if (companyContent.philosophy) {
    parts.push({ name: 'company.philosophy', content: { philosophy: companyContent.philosophy } });
  }

  if (companyContent.history?.timeline && Array.isArray(companyContent.history.timeline)) {
    parts.push({ name: 'company.history', content: { history: companyContent.history } });
  }

  if (companyContent.companyInfo) {
    parts.push({ name: 'company.companyInfo', content: { companyInfo: companyContent.companyInfo } });
  }

  if (parts.length === 0) {
    return translateSection(userId, 'company', companyContent);
  }

  console.log(`Splitting company into ${parts.length} parts: ${parts.map(p => p.name).join(', ')}`);

  const mergedResult: any = { company: {} };

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    console.log(`Translating ${part.name} (${i + 1}/${parts.length})`);

    const partResult = await translateSection(userId, 'company', part.content);

    // partResult は { company: {...} } という構造を期待
    if (partResult.company) {
      // companyオブジェクトをマージ
      Object.assign(mergedResult.company, partResult.company);
    } else {
      console.warn(`Unexpected structure from translateSection for ${part.name}`);
      Object.assign(mergedResult.company, partResult);
    }

    if (i < parts.length - 1) {
      console.log('Waiting 5s before next company part...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('Company section parts merged successfully');
  return mergedResult;
}

async function translatePricingSection(
  userId: string,
  pricingContent: any
): Promise<any> {
  console.log('Translating pricing section with one-by-one plan processing...');

  const plans = pricingContent.plans || [];
  if (plans.length === 0) {
    return translateSection(userId, 'pricing', pricingContent);
  }

  console.log(`Pricing has ${plans.length} plans, will process one by one`);

  const mergedResult: any = { pricing: { plans: [] } };

  // 最初のプランで、プラン以外のフィールド（sectionTitle等）を初期化
  let isFirstPlan = true;

  for (let i = 0; i < plans.length; i++) {
    console.log(`Translating pricing plan ${i + 1}/${plans.length} (${plans[i].features?.length || 0} features)...`);

    const singlePlanContent = {
      ...pricingContent,
      plans: [plans[i]],
    };

    const planResult = await translateSection(userId, 'pricing', singlePlanContent);

    // planResult は { pricing: {...} } という構造を期待
    if (planResult.pricing) {
      // 最初のプランでは、pricing全体のフィールドをコピー
      if (isFirstPlan) {
        for (const key in planResult.pricing) {
          if (key !== 'plans') {
            mergedResult.pricing[key] = planResult.pricing[key];
          }
        }
        isFirstPlan = false;
      }

      // plansをマージ
      if (planResult.pricing.plans && Array.isArray(planResult.pricing.plans)) {
        mergedResult.pricing.plans.push(...planResult.pricing.plans);
      }
    } else {
      console.warn(`Unexpected structure from translateSection for pricing plan ${i + 1}`);
    }

    if (i < plans.length - 1) {
      console.log('Waiting 5s before next pricing plan...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('Pricing section plans merged successfully');
  return mergedResult;
}

async function translateStaffSection(userId: string, staffContent: any): Promise<any> {
  console.log('Translating staff section with one-by-one member processing...');

  const members = staffContent.members || [];
  if (members.length === 0) {
    return translateSection(userId, 'staff', staffContent);
  }

  console.log(`Staff has ${members.length} members, will process one by one to avoid timeouts`);

  const mergedResult: any = { staff: { members: [] } };

  // 最初のメンバーで、メンバー以外のフィールド（sectionTitle等）を初期化
  let isFirstMember = true;

  for (let i = 0; i < members.length; i++) {
    console.log(`Translating staff member ${i + 1}/${members.length}...`);

    const singleMemberContent = {
      ...staffContent,
      members: [members[i]],
    };

    try {
      const memberResult = await translateSection(userId, 'staff', singleMemberContent);

      // memberResult は { staff: {...} } という構造を期待
      if (memberResult.staff) {
        // 最初のメンバーでは、staff全体のフィールドをコピー
        if (isFirstMember) {
          for (const key in memberResult.staff) {
            if (key !== 'members') {
              mergedResult.staff[key] = memberResult.staff[key];
            }
          }
          isFirstMember = false;
        }

        // membersをマージ
        if (memberResult.staff.members && Array.isArray(memberResult.staff.members)) {
          mergedResult.staff.members.push(...memberResult.staff.members);
        }
      } else {
        console.warn(`Unexpected structure from translateSection for staff member ${i + 1}`);
      }

      if (i < members.length - 1) {
        console.log('Waiting 5s before next staff member...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`Failed to translate staff member ${i + 1}:`, error);
      throw error;
    }
  }

  console.log('Staff section members merged successfully');
  return mergedResult;
}

async function translateArraySectionOneByOne(
  userId: string,
  sectionName: string,
  sectionContent: any,
  mainArrayField: string,
  items: any[]
): Promise<any> {
  console.log(`${sectionName}: Processing ${items.length} items one by one due to timeout prevention`);

  const mergedResult: any = {};
  mergedResult[sectionName] = JSON.parse(JSON.stringify(sectionContent));
  setNestedValue(mergedResult[sectionName], mainArrayField, []);

  let isFirstItem = true;

  for (let i = 0; i < items.length; i++) {
    console.log(`${sectionName}: Translating item ${i + 1}/${items.length}...`);

    const singleItemContent = JSON.parse(JSON.stringify(sectionContent));
    setNestedValue(singleItemContent, mainArrayField, [items[i]]);

    try {
      const itemResult = await translateSection(userId, sectionName, singleItemContent);

      // itemResult は { [sectionName]: {...} } という構造を期待
      if (itemResult[sectionName]) {
        // 最初のアイテムでは、セクション全体のフィールドをコピー（配列以外）
        if (isFirstItem) {
          for (const key in itemResult[sectionName]) {
            if (key !== mainArrayField) {
              mergedResult[sectionName][key] = itemResult[sectionName][key];
            }
          }
          isFirstItem = false;
        }

        // 配列要素をマージ
        const itemArray = getNestedValue(itemResult[sectionName], mainArrayField);
        if (itemArray && Array.isArray(itemArray)) {
          const targetArray = getNestedValue(mergedResult[sectionName], mainArrayField);
          if (targetArray && Array.isArray(targetArray)) {
            targetArray.push(...itemArray);
          }
        }
      } else {
        console.warn(`Unexpected structure from translateSection for ${sectionName} item ${i + 1}`);
      }

      if (i < items.length - 1) {
        console.log('Waiting 5s before next item...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`${sectionName}: Failed to translate item ${i + 1}:`, error);
      throw error;
    }
  }

  console.log(`${sectionName}: All items merged successfully`);
  return mergedResult;
}

async function translateSectionInBatches(
  userId: string,
  sectionName: string,
  sectionContent: any
): Promise<any> {
  if (sectionName === 'company') {
    return translateCompanySection(userId, sectionContent);
  }

  if (sectionName === 'pricing') {
    return translatePricingSection(userId, sectionContent);
  }

  if (sectionName === 'staff') {
    return translateStaffSection(userId, sectionContent);
  }

  let BATCH_SIZE = 4;
  const BATCH_DELAY_MS = 5000;

  const arrayFields = findArrayFields(sectionContent);

  if (arrayFields.length === 0) {
    console.log(`${sectionName}: No array fields detected, processing as single request`);
    return translateSection(userId, sectionName, sectionContent);
  }

  console.log(`${sectionName}: Detected array fields: ${arrayFields.join(', ')}`);
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
      // 例: { hero: { title: "...", title_en: "...", ... } }
      if (actualData[sectionName] && typeof actualData[sectionName] === 'object') {
        console.log(`  Direct section match found for ${sectionName}`);
        const sectionData = actualData[sectionName];
        console.log(`  Merging section ${sectionName}, keys:`, Object.keys(sectionData).join(', '));

        // 翻訳キーを再帰的にマージ（ネストされたキーも含む）
        mergeTranslationKeys(mergedContent[sectionName], sectionData);

        // デバッグ：マージ後のキーを確認
        const translationCount = countTranslationKeys(mergedContent[sectionName]);
        console.log(`    Translation keys in ${sectionName}: ${translationCount} keys (including nested)`);
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

          if (!mergedContent[secName]) {
            mergedContent[secName] = {};
          }

          const sectionData = actualData[secName];
          console.log(`  Merging section ${secName}, keys:`, Object.keys(sectionData).join(', '));

          // 翻訳キーを再帰的にマージ（ネストされたキーも含む）
          mergeTranslationKeys(mergedContent[secName], sectionData);

          // デバッグ：マージ後のキーを確認
          const translationCount = countTranslationKeys(mergedContent[secName]);
          console.log(`    Translation keys in ${secName}: ${translationCount} keys (including nested)`);
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
    console.log('\n=== Final Merged Content ===');

    // 各セクションのキーを表示（翻訳データが含まれているか確認）
    for (const sectionName in mergedContent) {
      const translationCount = countTranslationKeys(mergedContent[sectionName]);
      console.log(`  ${sectionName}: ${translationCount} translation keys (including nested)`);
    }

    // 保存データの検証
    console.log('\n=== Pre-save Data Verification ===');
    console.log('Total sections to save:', Object.keys(mergedContent).length);
    console.log('Section names:', Object.keys(mergedContent).join(', '));

    // 各セクションのキー数を確認
    for (const sectionName in mergedContent) {
      const keyCount = Object.keys(mergedContent[sectionName]).length;
      console.log(`  ${sectionName}: ${keyCount} keys`);
    }

    const savePayload = {
      storeId: userId,
      section: 'all',
      content: mergedContent,
    };

    // メタデータが除外されていることを確認
    console.log('\n=== Save Payload Structure ===');
    console.log('  storeId:', savePayload.storeId);
    console.log('  section:', savePayload.section);
    console.log('  content keys:', Object.keys(savePayload.content).join(', '));

    // ペイロード構造の検証（二重構造になっていないか確認）
    console.log('\n=== Payload Structure Validation ===');
    console.log('  Top level keys:', Object.keys(savePayload).join(', '));
    console.log('  savePayload.content is object:', typeof savePayload.content === 'object');
    console.log('  savePayload.content.content exists:', 'content' in savePayload.content);
    if ('content' in savePayload.content) {
      console.error('  ⚠️ WARNING: Double-nested content structure detected!');
    } else {
      console.log('  ✓ No double nesting - structure is correct');
    }

    // 翻訳データが含まれているか最終確認
    let totalTranslationKeys = 0;
    for (const sectionName in savePayload.content) {
      totalTranslationKeys += countTranslationKeys(savePayload.content[sectionName]);
    }
    console.log(`  Total translation keys in payload: ${totalTranslationKeys} (including nested)`);
    if (totalTranslationKeys === 0) {
      console.error('  ⚠️ WARNING: No translation data in payload!');
    } else {
      console.log(`  ✓ Translation data confirmed (${totalTranslationKeys} keys including nested)`);
    }

    console.log('\nSaving translated content with', Object.keys(mergedContent).length, 'sections...');
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
    console.log('\n=== Save Response ===');
    console.log('Save translated content successful:', result);

    // 保存成功後、確定したデータをログ出力（検証のための再取得は行わない）
    console.log('\n=== Final Data Summary ===');
    console.log('Total sections saved:', Object.keys(mergedContent).length);
    console.log('Sections:', Object.keys(mergedContent).join(', '));

    let totalTranslations = 0;
    for (const sectionName in mergedContent) {
      const count = countTranslationKeys(mergedContent[sectionName]);
      totalTranslations += count;
    }
    console.log(`Total translation keys: ${totalTranslations}`);
    console.log('✓ Translation and save completed successfully');

    return true;
  } catch (error) {
    console.error('Error in translate and save:', error);
    alert('翻訳または保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
    return false;
  }
}
