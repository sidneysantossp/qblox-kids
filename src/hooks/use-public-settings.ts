import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/db/api';

export interface PublicSettings {
  navbar_logo_url: string;
  footer_logo_url: string;
  site_meta_title: string;
  site_meta_description: string;
  storefront_home_bg_color: string;
  storefront_header_bg_color: string;
  storefront_header_text_color: string;
  storefront_header_search_bg_color: string;
  storefront_header_search_text_color: string;
  storefront_header_search_placeholder_color: string;
  storefront_header_search_icon_color: string;
  storefront_topbar_bg_color: string;
  storefront_topbar_text_color: string;
}

const defaultSettings: PublicSettings = {
  navbar_logo_url: '',
  footer_logo_url: '',
  site_meta_title: '',
  site_meta_description: '',
  storefront_home_bg_color: '',
  storefront_header_bg_color: '',
  storefront_header_text_color: '',
  storefront_header_search_bg_color: '',
  storefront_header_search_text_color: '',
  storefront_header_search_placeholder_color: '',
  storefront_header_search_icon_color: '',
  storefront_topbar_bg_color: '',
  storefront_topbar_text_color: '',
};

export function usePublicSettings() {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSiteSettings();
        const nextSettings = { ...defaultSettings };

        for (const item of data || []) {
          if (item.setting_key in nextSettings) {
            nextSettings[item.setting_key as keyof PublicSettings] = item.setting_value || '';
          }
        }

        setSettings(nextSettings);
      } catch (error) {
        console.error('Erro ao carregar public settings:', error);
      }
    };

    void loadSettings();
  }, []);

  return settings;
}
