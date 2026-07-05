import { supabase } from '../lib/supabase'

const BUCKET_NAME = 'event-banners'

export const uploadBanner = async (file) => {
  if (!file || !supabase) return null

  try {
    const fileName = `${Date.now()}-${String(file.name || 'banner').replace(/\s+/g, '-')}`
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) {
      throw error
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)
    return data?.publicUrl || null
  } catch (err) {
    console.warn('storageService.uploadBanner failed', err)
    return null
  }
}

export const deleteBanner = async (filePath) => {
  if (!filePath || !supabase) return false

  try {
    const normalizedPath = String(filePath).startsWith('/') ? String(filePath).slice(1) : String(filePath)
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([normalizedPath])
    if (error) throw error
    return true
  } catch (err) {
    console.warn('storageService.deleteBanner failed', err)
    return false
  }
}

export const getBannerUrl = (filePath) => {
  if (!filePath || !supabase) return null

  const normalizedPath = String(filePath).startsWith('/') ? String(filePath).slice(1) : String(filePath)
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(normalizedPath)
  return data?.publicUrl || null
}

export default {
  uploadBanner,
  deleteBanner,
  getBannerUrl,
}
