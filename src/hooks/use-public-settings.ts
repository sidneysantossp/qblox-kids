import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/db/api';

export interface PublicSettings {
  navbar_logo_url: string;
  footer_logo_url: string;
  site_meta_title: string;
  site_meta_description: string;
}

const defaultSettings: PublicSettings = {
  navbar_logo_url: '',
  footer_logo_url: '',
  site_meta_title: '',
  site_meta_description: '',
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
