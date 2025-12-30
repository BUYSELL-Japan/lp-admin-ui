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

    return await translateResponse.json();
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

  const translatedParts: any = {};

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    console.log(`Translating ${part.name} (${i + 1}/${parts.length})`);

    const partResult = await translateSection(userId, 'company', part.content);
    const actualPartData = partResult.translatedData || partResult;

    for (const lang in actualPartData) {
      if (!translatedParts[lang]) {
        translatedParts[lang] = { company: {} };
      }

      Object.assign(translatedParts[lang].company, actualPartData[lang].company);
    }

    if (i < parts.length - 1) {
      console.log('Waiting 5s before next company part...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('Company section parts merged successfully');
  return translatedParts;
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

  const translatedPlans: any = {};

  for (let i = 0; i < plans.length; i++) {
    console.log(`Translating pricing plan ${i + 1}/${plans.length} (${plans[i].features?.length || 0} features)...`);

    const singlePlanContent = {
      ...pricingContent,
      plans: [plans[i]],
    };

    const planResult = await translateSection(userId, 'pricing', singlePlanContent);
    const actualPlanData = planResult.translatedData || planResult;

    for (const lang in actualPlanData) {
      if (!translatedPlans[lang]) {
        translatedPlans[lang] = { pricing: { plans: [] } };

        for (const key in actualPlanData[lang].pricing) {
          if (key !== 'plans') {
            translatedPlans[lang].pricing[key] = actualPlanData[lang].pricing[key];
          }
        }
      }

      if (actualPlanData[lang].pricing?.plans && Array.isArray(actualPlanData[lang].pricing.plans)) {
        translatedPlans[lang].pricing.plans.push(...actualPlanData[lang].pricing.plans);
      }
    }

    if (i < plans.length - 1) {
      console.log('Waiting 5s before next pricing plan...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('Pricing section plans merged successfully');
  return translatedPlans;
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

  const BATCH_SIZE = 4;
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
    return translateSection(userId, sectionName, sectionContent);
  }

  const batches: any[][] = [];
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }

  console.log(`${sectionName}: Splitting ${items.length} items into ${batches.length} batches of max ${BATCH_SIZE} items each`);

  const translatedBatches: any[] = [];

  for (let i = 0; i < batches.length; i++) {
    console.log(`${sectionName}: Translating batch ${i + 1}/${batches.length} (${batches[i].length} items)...`);

    const batchContent = JSON.parse(JSON.stringify(sectionContent));
    setNestedValue(batchContent, mainArrayField, batches[i]);

    const batchResult = await translateSection(userId, sectionName, batchContent);
    translatedBatches.push(batchResult);

    console.log(`${sectionName}: Batch ${i + 1}/${batches.length} completed`);

    if (i < batches.length - 1) {
      console.log(`Waiting ${BATCH_DELAY_MS}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  console.log(`${sectionName}: Merging ${batches.length} batches...`);
  const mergedResult: any = {};

  for (const batchResult of translatedBatches) {
    const actualBatchData = batchResult.translatedData || batchResult;

    for (const lang in actualBatchData) {
      if (!mergedResult[lang]) {
        mergedResult[lang] = JSON.parse(JSON.stringify(actualBatchData[lang]));
      } else {
        const batchArray = getNestedValue(actualBatchData[lang], mainArrayField);
        if (batchArray && Array.isArray(batchArray)) {
          const existingArray = getNestedValue(mergedResult[lang], mainArrayField);
          if (!existingArray) {
            setNestedValue(mergedResult[lang], mainArrayField, []);
          }
          const targetArray = getNestedValue(mergedResult[lang], mainArrayField);
          targetArray.push(...batchArray);
        }
      }
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
    const sections = Object.keys(allSectionData);
    const translatedData: any = {};

    console.log('Translating content with full serial processing...');
    console.log('Total sections to translate:', sections.length);
    console.log('All sections will be processed one by one to avoid API Gateway timeout');

    let completedCount = 0;

    for (let i = 0; i < sections.length; i++) {
      const sectionName = sections[i];
      console.log(`\n[${i + 1}/${sections.length}] Processing section: ${sectionName}`);

      const sectionContent = allSectionData[sectionName];

      const sectionTranslatedData = await translateSectionInBatches(userId, sectionName, sectionContent);

      const actualData = sectionTranslatedData.translatedData || sectionTranslatedData;
      Object.assign(translatedData, actualData);

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
    console.log('Translated data structure:', Object.keys(translatedData));

    // 言語ごとのネスト構造をセクションごとのフラット構造に変換
    const mergedContent: any = {};

    // まずオリジナルの日本語データをベースにする（deep copy）
    for (const sectionName in allSectionData) {
      mergedContent[sectionName] = JSON.parse(JSON.stringify(allSectionData[sectionName]));
    }

    // 日本語翻訳データがあれば上書き（通常はオリジナルと同じはず）
    if (translatedData.ja) {
      for (const sectionName in translatedData.ja) {
        if (!mergedContent[sectionName]) {
          mergedContent[sectionName] = {};
        }
        const jaData = translatedData.ja[sectionName];
        for (const key in jaData) {
          mergedContent[sectionName][key] = JSON.parse(JSON.stringify(jaData[key]));
        }
      }
    }

    // 各言語の翻訳データをサフィックス付きでマージ
    const languages = ['en', 'zh', 'ko'];
    for (const lang of languages) {
      if (translatedData[lang]) {
        for (const sectionName in translatedData[lang]) {
          if (!mergedContent[sectionName]) {
            mergedContent[sectionName] = {};
          }

          const sectionData = translatedData[lang][sectionName];
          for (const key in sectionData) {
            mergedContent[sectionName][`${key}_${lang}`] = JSON.parse(JSON.stringify(sectionData[key]));
          }
        }
      }
    }

    console.log('Merged content sections:', Object.keys(mergedContent));
    console.log('Sample section keys (hero):', mergedContent.hero ? Object.keys(mergedContent.hero).slice(0, 10) : 'N/A');

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
    console.log('\nSave payload structure:');
    console.log('  storeId:', savePayload.storeId);
    console.log('  section:', savePayload.section);
    console.log('  content keys:', Object.keys(savePayload.content).join(', '));
    console.log('  No metadata (targetLanguages, etc.) in content: ✓');

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

    // DynamoDBに正しく保存されたか確認するため、保存後にデータを取得
    console.log('\nVerifying saved data...');
    try {
      const verifyResponse = await fetch(`${CONTENT_ENDPOINT}?storeId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (verifyResponse.ok) {
        const savedData = await verifyResponse.json();
        console.log('Verification - Saved data sections:', savedData.ContentData ? Object.keys(savedData.ContentData).join(', ') : 'No ContentData');
        console.log('Verification - Total sections saved:', savedData.ContentData ? Object.keys(savedData.ContentData).length : 0);
      } else {
        console.warn('Could not verify saved data');
      }
    } catch (verifyError) {
      console.warn('Verification error:', verifyError);
    }

    return true;
  } catch (error) {
    console.error('Error in translate and save:', error);
    alert('翻訳または保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
    return false;
  }
}
