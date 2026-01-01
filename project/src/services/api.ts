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

// No longer needed - Lambda returns multilingual object format

export async function saveAllSections(userId: string, allSectionData: any): Promise<boolean> {
  try {
    console.log('=== Saving all sections ===');

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

    console.log('✓ Returning multilingual data as-is (object format with ja, en, zh-tw, ko)');
    return contentData;
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

    let extractedContent: any = null;

    // レスポンスから content 部分のみを取り出す
    // レスポンス構造: { storeId, section, content: {...}, targetLanguages }
    if (response.content && typeof response.content === 'object') {
      console.log(`  Extracted content keys for ${sectionName}:`, Object.keys(response.content).join(', '));
      extractedContent = response.content;
    }
    // レスポンスにメタデータフィールドが含まれている場合は除外
    else if (response.storeId || response.section || response.targetLanguages) {
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
        extractedContent = contentOnly;
      }
    }
    // 最終フォールバック
    else {
      console.log(`  Using entire response for ${sectionName}`);
      extractedContent = response;
    }

    // 確実に { [sectionName]: {...} } の構造を返す
    if (extractedContent && extractedContent[sectionName]) {
      console.log(`  ✓ Response has correct structure: { ${sectionName}: {...} }`);
      return extractedContent;
    } else if (extractedContent) {
      // セクション名でラップされていない場合は、ラップして返す
      console.warn(`  ⚠ Response missing section wrapper, wrapping as { ${sectionName}: {...} }`);
      return { [sectionName]: extractedContent };
    }

    // エラーケース
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

async function translatePricingSection(
  userId: string,
  pricingContent: any
): Promise<any> {
  console.log('\n=== Translating pricing section with one-by-one plan processing ===');

  const plans = pricingContent.plans || [];
  if (plans.length === 0) {
    console.log('  No plans found, translating entire pricing section');
    return translateSection(userId, 'pricing', pricingContent);
  }

  console.log(`  Total plans to translate: ${plans.length}`);

  const mergedResult: any = { pricing: { plans: [] } };

  // 最初のプランで、プラン以外のフィールド（sectionTitle等）を初期化
  let isFirstPlan = true;

  for (let i = 0; i < plans.length; i++) {
    const featureCount = plans[i].features?.length || 0;
    console.log(`\n  [${i + 1}/${plans.length}] Translating plan: "${plans[i].name}" (${featureCount} features)...`);

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
        console.log(`  ✓ Initialized pricing fields:`, Object.keys(mergedResult.pricing).filter(k => k !== 'plans').join(', '));
        isFirstPlan = false;
      }

      // plansをマージ
      if (planResult.pricing.plans && Array.isArray(planResult.pricing.plans)) {
        mergedResult.pricing.plans.push(...planResult.pricing.plans);
        console.log(`  ✓ Added plan (total: ${mergedResult.pricing.plans.length}/${plans.length})`);
      } else {
        console.warn(`  ⚠ No plans array in result`);
      }
    } else {
      console.warn(`  ⚠ Unexpected structure from translateSection for pricing plan ${i + 1}`);
      console.warn(`  Available keys:`, Object.keys(planResult).join(', '));
    }

    if (i < plans.length - 1) {
      console.log('  Waiting 5s before next pricing plan...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log(`\n  ✓ Pricing section completed`);
  return mergedResult;
}

async function translateStaffSection(userId: string, staffContent: any): Promise<any> {
  console.log('\n=== Translating staff section with one-by-one member processing ===');

  const members = staffContent.members || [];
  if (members.length === 0) {
    console.log('  No members found, translating entire staff section');
    return translateSection(userId, 'staff', staffContent);
  }

  console.log(`  Total members to translate: ${members.length}`);

  const mergedResult: any = { staff: { members: [] } };

  // 最初のメンバーで、メンバー以外のフィールド（sectionTitle等）を初期化
  let isFirstMember = true;

  for (let i = 0; i < members.length; i++) {
    console.log(`\n  [${i + 1}/${members.length}] Translating member: "${members[i].name}"...`);

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
          console.log(`  ✓ Initialized staff fields:`, Object.keys(mergedResult.staff).filter(k => k !== 'members').join(', '));
          isFirstMember = false;
        }

        // membersをマージ
        if (memberResult.staff.members && Array.isArray(memberResult.staff.members)) {
          mergedResult.staff.members.push(...memberResult.staff.members);
          console.log(`  ✓ Added member (total: ${mergedResult.staff.members.length}/${members.length})`);
        } else {
          console.warn(`  ⚠ No members array in result`);
        }
      } else {
        console.warn(`  ⚠ Unexpected structure from translateSection for staff member ${i + 1}`);
        console.warn(`  Available keys:`, Object.keys(memberResult).join(', '));
      }

      if (i < members.length - 1) {
        console.log('  Waiting 5s before next staff member...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`  ✗ Failed to translate staff member ${i + 1}:`, error);
      throw error;
    }
  }

  console.log(`\n  ✓ Staff section completed`);
  return mergedResult;
}

async function translateReviewsSection(userId: string, reviewsContent: any): Promise<any> {
  console.log('\n=== Translating reviews section with one-by-one review processing ===');

  const reviews = reviewsContent.reviews || [];
  if (reviews.length === 0) {
    console.log('  No reviews found, translating entire reviews section');
    return translateSection(userId, 'reviews', reviewsContent);
  }

  console.log(`  Total reviews to translate: ${reviews.length}`);

  const mergedResult: any = { reviews: { reviews: [] } };

  let isFirstReview = true;

  for (let i = 0; i < reviews.length; i++) {
    console.log(`\n  [${i + 1}/${reviews.length}] Translating review from: "${reviews[i].name}"...`);

    const singleReviewContent = {
      ...reviewsContent,
      reviews: [reviews[i]],
    };

    try {
      const reviewResult = await translateSection(userId, 'reviews', singleReviewContent);

      if (reviewResult.reviews) {
        if (isFirstReview) {
          for (const key in reviewResult.reviews) {
            if (key !== 'reviews') {
              mergedResult.reviews[key] = reviewResult.reviews[key];
            }
          }
          console.log(`  ✓ Initialized reviews fields:`, Object.keys(mergedResult.reviews).filter(k => k !== 'reviews').join(', '));
          isFirstReview = false;
        }

        if (reviewResult.reviews.reviews && Array.isArray(reviewResult.reviews.reviews)) {
          mergedResult.reviews.reviews.push(...reviewResult.reviews.reviews);
          console.log(`  ✓ Added review (total: ${mergedResult.reviews.reviews.length}/${reviews.length})`);
        } else {
          console.warn(`  ⚠ No reviews array in result`);
        }
      } else {
        console.warn(`  ⚠ Unexpected structure from translateSection for reviews ${i + 1}`);
        console.warn(`  Available keys:`, Object.keys(reviewResult).join(', '));
      }

      if (i < reviews.length - 1) {
        console.log('  Waiting 5s before next review...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`  ✗ Failed to translate review ${i + 1}:`, error);
      throw error;
    }
  }

  console.log(`\n  ✓ Reviews section completed`);
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

    const savePayload = {
      storeId: userId,
      section: 'all',
      content: mergedContent,
    };

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
    console.log('Save translated content successful:', result);
    console.log('✓ Translation and save completed successfully');

    return true;
  } catch (error) {
    console.error('Error in translate and save:', error);
    alert('翻訳または保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
    return false;
  }
}
