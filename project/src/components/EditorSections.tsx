import ImageUpload from './ImageUpload';
import type {
  HeaderData,
  HeroData,
  AboutData,
  MenuData,
  GalleryData,
  StaffData,
  NewsData,
  StoreInfoData,
  CTAData,
  PricingData,
  FooterData,
} from '../data/types';

interface EditorSectionProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export function HeaderEditor({ data, onUpdate }: EditorSectionProps) {
  const headerData = data as HeaderData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">ロゴテキスト</label>
        <input
          type="text"
          value={headerData.logo.text}
          onChange={(e) => onUpdate({ logo: { text: e.target.value } })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ナビゲーション項目</label>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {headerData.navigation.map((item, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">項目 {index + 1}</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">ID</label>
                  <input
                    type="text"
                    value={item.id}
                    disabled
                    className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">ラベル</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const newNavigation = [...headerData.navigation];
                      newNavigation[index] = { ...item, label: e.target.value };
                      onUpdate({ navigation: newNavigation });
                    }}
                    className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroEditor({ data, onUpdate }: EditorSectionProps) {
  const heroData = data as HeroData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">タイトル</label>
        <textarea
          value={heroData.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">サブタイトル</label>
        <input
          type="text"
          value={heroData.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ImageUpload
        value={heroData.backgroundImage}
        onChange={(url) => onUpdate({ backgroundImage: url })}
        label="背景画像"
      />
    </div>
  );
}

export function AboutEditor({ data, onUpdate }: EditorSectionProps) {
  const aboutData = data as AboutData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">セクションタイトル</label>
        <input
          type="text"
          value={aboutData.sectionTitle}
          onChange={(e) => onUpdate({ sectionTitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {aboutData.features.map((feature, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <h4 className="font-medium">特徴 {index + 1}</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">タイトル</label>
            <input
              type="text"
              value={feature.title}
              onChange={(e) => {
                const newFeatures = [...aboutData.features];
                newFeatures[index] = { ...feature, title: e.target.value };
                onUpdate({ features: newFeatures });
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">説明</label>
            <textarea
              value={feature.description}
              onChange={(e) => {
                const newFeatures = [...aboutData.features];
                newFeatures[index] = { ...feature, description: e.target.value };
                onUpdate({ features: newFeatures });
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <ImageUpload
            value={feature.image}
            onChange={(url) => {
              const newFeatures = [...aboutData.features];
              newFeatures[index] = { ...feature, image: url };
              onUpdate({ features: newFeatures });
            }}
            label="画像"
          />
        </div>
      ))}
    </div>
  );
}

export function MenuEditor({ data, onUpdate }: EditorSectionProps) {
  const menuData = data as MenuData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">セクションタイトル</label>
        <input
          type="text"
          value={menuData.sectionTitle}
          onChange={(e) => onUpdate({ sectionTitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">サブタイトル</label>
        <input
          type="text"
          value={menuData.sectionSubtitle}
          onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {menuData.items.slice(0, 5).map((item, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">メニュー {index + 1}</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700">名前</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...menuData.items];
                    newItems[index] = { ...item, name: e.target.value };
                    onUpdate({ items: newItems });
                  }}
                  className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">価格</label>
                <input
                  type="text"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...menuData.items];
                    newItems[index] = { ...item, price: e.target.value };
                    onUpdate({ items: newItems });
                  }}
                  className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">説明</label>
              <textarea
                value={item.description}
                onChange={(e) => {
                  const newItems = [...menuData.items];
                  newItems[index] = { ...item, description: e.target.value };
                  onUpdate({ items: newItems });
                }}
                className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded"
                rows={2}
              />
            </div>
            <ImageUpload
              value={item.image}
              onChange={(url) => {
                const newItems = [...menuData.items];
                newItems[index] = { ...item, image: url };
                onUpdate({ items: newItems });
              }}
              label="画像"
            />
          </div>
        ))}
        <p className="text-xs text-gray-500">最初の5件のみ表示しています</p>
      </div>
    </div>
  );
}

export function GalleryEditor({ data, onUpdate }: EditorSectionProps) {
  const galleryData = data as GalleryData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">セクションタイトル</label>
        <input
          type="text"
          value={galleryData.sectionTitle}
          onChange={(e) => onUpdate({ sectionTitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">サブタイトル</label>
        <input
          type="text"
          value={galleryData.sectionSubtitle}
          onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {galleryData.images.slice(0, 5).map((image, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">画像 {index + 1}</h4>
            <div>
              <label className="block text-xs font-medium text-gray-700">キャプション</label>
              <input
                type="text"
                value={image.caption}
                onChange={(e) => {
                  const newImages = [...galleryData.images];
                  newImages[index] = { ...image, caption: e.target.value };
                  onUpdate({ images: newImages });
                }}
                className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">カテゴリ</label>
              <select
                value={image.category}
                onChange={(e) => {
                  const newImages = [...galleryData.images];
                  newImages[index] = { ...image, category: e.target.value };
                  onUpdate({ images: newImages });
                }}
                className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                {galleryData.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <ImageUpload
              value={image.url}
              onChange={(url) => {
                const newImages = [...galleryData.images];
                newImages[index] = { ...image, url };
                onUpdate({ images: newImages });
              }}
              label="画像"
            />
          </div>
        ))}
        <p className="text-xs text-gray-500">最初の5件のみ表示しています</p>
      </div>
    </div>
  );
}

export function StaffEditor({ data, onUpdate }: EditorSectionProps) {
  const staffData = data as StaffData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">セクションタイトル</label>
        <input
          type="text"
          value={staffData.sectionTitle}
          onChange={(e) => onUpdate({ sectionTitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">サブタイトル</label>
        <input
          type="text"
          value={staffData.sectionSubtitle}
          onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {staffData.members.map((member, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <h4 className="font-medium">スタッフ {index + 1}</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">名前</label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => {
                  const newMembers = [...staffData.members];
                  newMembers[index] = { ...member, name: e.target.value };
                  onUpdate({ members: newMembers });
                }}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">役職</label>
              <input
                type="text"
                value={member.role}
                onChange={(e) => {
                  const newMembers = [...staffData.members];
                  newMembers[index] = { ...member, role: e.target.value };
                  onUpdate({ members: newMembers });
                }}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">説明</label>
            <textarea
              value={member.description}
              onChange={(e) => {
                const newMembers = [...staffData.members];
                newMembers[index] = { ...member, description: e.target.value };
                onUpdate({ members: newMembers });
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>
          <ImageUpload
            value={member.image}
            onChange={(url) => {
              const newMembers = [...staffData.members];
              newMembers[index] = { ...member, image: url };
              onUpdate({ members: newMembers });
            }}
            label="画像"
          />
        </div>
      ))}
    </div>
  );
}

export function NewsEditor({ data, onUpdate }: EditorSectionProps) {
  const newsData = data as NewsData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">セクションタイトル</label>
        <input
          type="text"
          value={newsData.sectionTitle}
          onChange={(e) => onUpdate({ sectionTitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">サブタイトル</label>
        <input
          type="text"
          value={newsData.sectionSubtitle}
          onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {newsData.items.slice(0, 3).map((item, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <h4 className="font-medium">お知らせ {index + 1}</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">日付</label>
              <input
                type="text"
                value={item.date}
                onChange={(e) => {
                  const newItems = [...newsData.items];
                  newItems[index] = { ...item, date: e.target.value };
                  onUpdate({ items: newItems });
                }}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">カテゴリ</label>
              <input
                type="text"
                value={item.category}
                onChange={(e) => {
                  const newItems = [...newsData.items];
                  newItems[index] = { ...item, category: e.target.value };
                  onUpdate({ items: newItems });
                }}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">タイトル</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => {
                const newItems = [...newsData.items];
                newItems[index] = { ...item, title: e.target.value };
                onUpdate({ items: newItems });
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">内容</label>
            <textarea
              value={item.content}
              onChange={(e) => {
                const newItems = [...newsData.items];
                newItems[index] = { ...item, content: e.target.value };
                onUpdate({ items: newItems });
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-500">最初の3件のみ表示しています</p>
    </div>
  );
}

export function StoreInfoEditor({ data, onUpdate }: EditorSectionProps) {
  const storeData = data as StoreInfoData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">セクションタイトル</label>
        <input
          type="text"
          value={storeData.sectionTitle}
          onChange={(e) => onUpdate({ sectionTitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {storeData.items.map((item, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <h4 className="font-medium">{item.title}</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">内容</label>
            <input
              type="text"
              value={item.content}
              onChange={(e) => {
                const newItems = [...storeData.items];
                newItems[index] = { ...item, content: e.target.value };
                onUpdate({ items: newItems });
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      ))}
      <ImageUpload
        value={storeData.mainImage}
        onChange={(url) => onUpdate({ mainImage: url })}
        label="メイン画像"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">画像キャプション</label>
        <input
          type="text"
          value={storeData.mainImageCaption}
          onChange={(e) => onUpdate({ mainImageCaption: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );
}

export function CTAEditor({ data, onUpdate }: EditorSectionProps) {
  const ctaData = data as CTAData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">セクションタイトル</label>
        <input
          type="text"
          value={ctaData.sectionTitle}
          onChange={(e) => onUpdate({ sectionTitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">サブタイトル</label>
        <input
          type="text"
          value={ctaData.sectionSubtitle}
          onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">説明</label>
        <textarea
          value={ctaData.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows={3}
        />
      </div>
      <ImageUpload
        value={ctaData.backgroundImage}
        onChange={(url) => onUpdate({ backgroundImage: url })}
        label="背景画像"
      />
    </div>
  );
}

export function PricingEditor({ data, onUpdate }: EditorSectionProps) {
  const pricingData = data as PricingData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">セクションタイトル</label>
        <input
          type="text"
          value={pricingData.sectionTitle}
          onChange={(e) => onUpdate({ sectionTitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">サブタイトル</label>
        <input
          type="text"
          value={pricingData.sectionSubtitle}
          onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {pricingData.plans.map((plan, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <h4 className="font-medium">プラン {index + 1}</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">名前</label>
            <input
              type="text"
              value={plan.name}
              onChange={(e) => {
                const newPlans = [...pricingData.plans];
                newPlans[index] = { ...plan, name: e.target.value };
                onUpdate({ plans: newPlans });
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">説明</label>
            <textarea
              value={plan.description}
              onChange={(e) => {
                const newPlans = [...pricingData.plans];
                newPlans[index] = { ...plan, description: e.target.value };
                onUpdate({ plans: newPlans });
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">価格</label>
            <input
              type="text"
              value={plan.price}
              onChange={(e) => {
                const newPlans = [...pricingData.plans];
                newPlans[index] = { ...plan, price: e.target.value };
                onUpdate({ plans: newPlans });
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FooterEditor({ data, onUpdate }: EditorSectionProps) {
  const footerData = data as FooterData;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">ロゴ</label>
        <input
          type="text"
          value={footerData.logo}
          onChange={(e) => onUpdate({ logo: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">説明</label>
        <textarea
          value={footerData.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>
      <div className="p-4 border border-gray-200 rounded-lg space-y-3">
        <h4 className="font-medium">営業時間</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700">タイトル</label>
          <input
            type="text"
            value={footerData.businessHours.title}
            onChange={(e) => onUpdate({
              businessHours: { ...footerData.businessHours, title: e.target.value }
            })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">営業日</label>
          <input
            type="text"
            value={footerData.businessHours.days}
            onChange={(e) => onUpdate({
              businessHours: { ...footerData.businessHours, days: e.target.value }
            })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">営業時間</label>
          <input
            type="text"
            value={footerData.businessHours.hours}
            onChange={(e) => onUpdate({
              businessHours: { ...footerData.businessHours, hours: e.target.value }
            })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">定休日</label>
          <input
            type="text"
            value={footerData.businessHours.closedDay}
            onChange={(e) => onUpdate({
              businessHours: { ...footerData.businessHours, closedDay: e.target.value }
            })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <div className="p-4 border border-gray-200 rounded-lg space-y-3">
        <h4 className="font-medium">SNS</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700">タイトル</label>
          <input
            type="text"
            value={footerData.social.title}
            onChange={(e) => onUpdate({
              social: { ...footerData.social, title: e.target.value }
            })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        {footerData.social.links.map((link, index) => (
          <div key={index} className="p-3 border border-gray-100 rounded space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">プラットフォーム</label>
              <input
                type="text"
                value={link.platform}
                disabled
                className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">URL</label>
              <input
                type="text"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...footerData.social.links];
                  newLinks[index] = { ...link, url: e.target.value };
                  onUpdate({ social: { ...footerData.social, links: newLinks } });
                }}
                className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">コピーライト</label>
        <input
          type="text"
          value={footerData.copyright}
          onChange={(e) => onUpdate({ copyright: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
