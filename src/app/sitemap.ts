import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.nameframe.site'
  const currentDate = new Date()
  
  return [
    // Core marketing pages (highest priority)
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    
    // User flow pages
    {
      url: `${baseUrl}/sign-in`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    
    // Feature pages
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // {
    //   url: `${baseUrl}/testimonials`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly',
    //   priority: 0.6,
    // },
    
    // // Legal and support pages
    // {
    //   url: `${baseUrl}/privacy-policy`,
    //   lastModified: currentDate,
    //   changeFrequency: 'yearly',
    //   priority: 0.4,
    // },
    // {
    //   url: `${baseUrl}/terms-of-service`,
    //   lastModified: currentDate,
    //   changeFrequency: 'yearly',
    //   priority: 0.4,
    // },
    // {
    //   url: `${baseUrl}/faq`,
    //   lastModified: currentDate, 
    //   changeFrequency: 'monthly',
    //   priority: 0.6,
    // }
  ]
}