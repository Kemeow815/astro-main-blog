import type { CollectionEntry, CollectionKey } from 'astro:content'
import { getCollection } from 'astro:content'
import { prod } from '.'

/** Note: this function filters out draft posts based on the environment */
export async function getAllCollections(contentType: CollectionKey = 'post') {
  return await getCollection(contentType, ({ data }: CollectionEntry<typeof contentType>) => {
    return prod ? data.draft !== true : true
  })
}

export function groupCollectionsByYear<T extends CollectionKey>(
  collections: CollectionEntry<T>[]
): [string, CollectionEntry<T>[]][] {
  const collectionsByYear = collections.reduce(
    (acc, collection) => {
      const year = new Date(
        collection.data.updatedDate ?? collection.data.publishDate
      ).getFullYear()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(collection)
      return acc
    },
    {} as Record<number, CollectionEntry<T>[]>
  )
  return Object.entries(collectionsByYear).sort((a, b) => Number(b[0]) - Number(a[0]))
}

export function sortMDByDate<T extends CollectionKey>(collections: CollectionEntry<T>[]) {
  return collections.sort((a, b) => {
    const aDate = new Date(a.data.updatedDate ?? a.data.publishDate).valueOf()
    const bDate = new Date(b.data.updatedDate ?? b.data.publishDate).valueOf()
    return bDate - aDate
  })
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllTags<T extends CollectionKey>(collections: CollectionEntry<T>[]) {
  return collections.flatMap((collection) => [...collection.data.tags])
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTags<T extends CollectionKey>(collections: CollectionEntry<T>[]) {
  return [...new Set(getAllTags(collections))]
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTagsWithCount<T extends CollectionKey>(
  collections: CollectionEntry<T>[]
): [string, number][] {
  return [
    ...getAllTags(collections).reduce(
      (acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
      new Map<string, number>()
    )
  ].sort((a, b) => b[1] - a[1])
}
