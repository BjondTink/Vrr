import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, article }) => {
  const { pathname } = useLocation();
  const defaultTitle = "Vrr Studio | Fine Collection Pieces";
  const defaultDescription = "Discover high-end seasonal collection pieces. Timeless silhouettes met with modern craftsmanship.";
  const siteUrl = window.location.origin;

  const seo = {
    title: title ? `${title} | Vrr Studio` : defaultTitle,
    description: description || defaultDescription,
    image: image || `${siteUrl}/logo.png`,
    url: `${siteUrl}${pathname}`,
  };

  useEffect(() => {
    document.title = seo.title;
    
    const updateMeta = (name: string, content: string, isRepo: boolean = false) => {
      let el = document.querySelector(isRepo ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (isRepo) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', seo.description);
    updateMeta('og:title', seo.title, true);
    updateMeta('og:description', seo.description, true);
    updateMeta('og:image', seo.image, true);
    updateMeta('og:url', seo.url, true);
    updateMeta('og:type', article ? 'article' : 'website', true);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', seo.title);
    updateMeta('twitter:description', seo.description);
    updateMeta('twitter:image', seo.image);

  }, [seo.title, seo.description, seo.image, seo.url, article]);

  return null;
};

export default SEO;
