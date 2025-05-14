// src/pages/MyCoversPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAppSelector } from '@/store/hooks';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button'; // For potential actions like delete/re-generate
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CoverDetailModal from '@/components/ui/modals/CoverDetailModal';
import { RiInformationLine, RiHeartFill, RiHeartLine } from 'react-icons/ri';
import { Link } from 'react-router-dom'; // Assuming you'll use React Router for navigation
import { imageModels } from '@/utils/modelData';
import Tooltip from '@/components/ui/Tooltip';
import { ChevronLeft } from 'lucide-react';

// Define the type for a cover object fetched from Supabase
// This should match the columns in your 'generated_covers' table
export interface SavedCover {
  id: string;
  user_id: string;
  created_at: string;
  album_title?: string | null;
  prompt_text?: string | null;
  model_id?: string | null;
  seed?: number | null;
  width?: number | null;
  height?: number | null;
  steps?: number | null;
  guidance?: number | null;
  image_storage_path: string;
  is_favorite: boolean;
  is_archived: boolean;
  // Add framework fields if you want to display them
  framework_visual_concept?: string | null;
  // ... other framework fields
  // We'll need a way to get the actual image URL
  display_image_url?: string; // This will be populated client-side
}

const MyCoversPage: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const [covers, setCovers] = useState<SavedCover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoverForDetail, setSelectedCoverForDetail] = useState<SavedCover | null>(null);

  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [hasMore, setHasMore] = useState(true);
  const COVERS_PER_PAGE = 8; // Or 12, 16 etc.

  const fetchCovers = useCallback(
    async (page: number) => {
      if (!user) {
        setLoading(false);
        setError('You need to be logged in to view your covers.');
        setHasMore(false);
        return;
      }

      // For initial load or if loading more, set loading true
      if (page === 0) setLoading(true);
      setError(null);

      const from = page * COVERS_PER_PAGE;
      const to = from + COVERS_PER_PAGE - 1;

      try {
        const {
          data,
          error: fetchError,
          count,
        } = await supabase
          .from('generated_covers')
          .select('*', { count: 'exact' }) // Get total count for pagination
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(from, to); // Apply pagination range

        if (fetchError) throw fetchError;

        if (data) {
          const coversWithSignedUrls = await Promise.all(
            data.map(async cover => {
              const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from('album-covers') // Your bucket name
                .createSignedUrl(cover.image_storage_path, 60 * 60); // URL valid for 1 hour

              if (signedUrlError) {
                console.error(
                  `Error creating signed URL for ${cover.image_storage_path}:`,
                  signedUrlError
                );
                return { ...cover, display_image_url: undefined }; // Handle case where URL generation fails
              }
              return { ...cover, display_image_url: signedUrlData?.signedUrl };
            })
          );

          setCovers(prevCovers =>
            page === 0 ? coversWithSignedUrls : [...prevCovers, ...coversWithSignedUrls]
          );
          // Check if there are more items to load
          // 'count' is the total number of items matching the query (ignoring range)
          if (count !== null) {
            setHasMore((page + 1) * COVERS_PER_PAGE < count);
          } else {
            setHasMore(coversWithSignedUrls.length === COVERS_PER_PAGE); // Fallback if count is null
          }
        } else {
          setHasMore(false);
        }
      } catch (err: any) {
        console.error('Error fetching covers:', err);
        setError(err.message || 'Failed to fetch covers.');
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [user]
  ); // Added user to dependency array of useCallback

  useEffect(() => {
    setCovers([]); // Reset covers when user changes or on initial mount
    setCurrentPage(0);
    setHasMore(true);
    fetchCovers(0); // Fetch initial page
  }, [fetchCovers]); // fetchCovers is memoized and includes 'user'

  const loadMoreCovers = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchCovers(nextPage);
    }
  };

  const toggleFavorite = async (coverId: string, currentIsFavorite: boolean) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('generated_covers')
        .update({ is_favorite: !currentIsFavorite })
        .eq('id', coverId)
        .eq('user_id', user.id); // Ensure RLS is respected
      if (error) throw error;
      setCovers(prevCovers =>
        prevCovers.map(c => (c.id === coverId ? { ...c, is_favorite: !currentIsFavorite } : c))
      );
    } catch (err: any) {
      console.error('Error updating favorite status:', err);
      // Show an error to the user
    }
  };
  // We will implement toggleArchive and handleDelete later

  if (loading && currentPage === 0) {
    // Show main loader only on initial load
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your covers..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">{error}</p>
        {!user && (
          <Link to="/auth">
            <Button variant="primary" className="mt-4">
              Login
            </Button>
          </Link>
        )}
      </div>
    );
  }

  if (covers.length === 0) {
    return (
      <>
        <RouterLink to="/">
          <Button variant="ghost" className="mb-6" size="sm" iconLeft={<ChevronLeft />}>
            Go back to home
          </Button>
        </RouterLink>
        <div className="py-10 text-center">
          <p className="text-text-secondary text-lg">You haven't saved any covers yet.</p>
          <Link to="/">
            <Button variant="primary" className="mt-4">
              Generate Some Covers!
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-8">
      <RouterLink to="/">
        <Button variant="ghost" className="mb-6" size="sm" iconLeft={<ChevronLeft />}>
          Go back to home
        </Button>
      </RouterLink>
      <h1 className="text-text-primary text-3xl font-bold">My Saved Covers</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {covers.map(cover => (
          <Card key={cover.id} className="group relative overflow-hidden !p-0">
            {cover.display_image_url ? (
              <img
                src={cover.display_image_url} // Now a signed URL
                alt={cover.album_title || 'Album Cover'}
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="bg-primary-dark text-text-secondary flex aspect-square w-full items-center justify-center">
                <RiInformationLine className="mr-2 h-8 w-8" /> Image loading or unavailable
              </div>
            )}
            {/* ... (rest of the card content, hover effects, favorite badge are the same) ... */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-4">
              <h3
                className="truncate text-base font-semibold text-white md:text-lg"
                title={cover.album_title || 'Untitled'}
              >
                {cover.album_title || 'Untitled'}
              </h3>
              <p className="truncate text-xs text-neutral-300" title={cover.model_id || ''}>
                {imageModels.find(m => m.id === cover.model_id)?.name ||
                  cover.model_id?.split('/').pop() ||
                  'Unknown Model'}
              </p>
              <div className="mt-2 flex items-center space-x-1.5">
                <Tooltip position="top" content={cover.is_favorite ? 'Unfavorite' : 'Favorite'}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="!bg-white/10 !p-1.5 !text-white hover:!bg-white/20"
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(cover.id, cover.is_favorite);
                    }}
                    title={cover.is_favorite ? 'Unfavorite' : 'Favorite'}
                  >
                    {cover.is_favorite ? (
                      <RiHeartFill className="text-accent-pink h-4 w-4" />
                    ) : (
                      <RiHeartLine className="h-4 w-4" />
                    )}
                  </Button>
                </Tooltip>
                {/* Example: View Details Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="cursor-pointer !bg-white/10 !p-1.5 !text-white hover:!bg-white/20"
                  title="View Details"
                  onClick={() => setSelectedCoverForDetail(cover)}
                >
                  <RiInformationLine className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Favorite badge */}
            {cover.is_favorite && (
              <div className="bg-accent-pink/80 absolute top-2 right-2 rounded-full p-1.5 text-white shadow-lg">
                <RiHeartFill className="h-4 w-4" />
              </div>
            )}
          </Card>
        ))}
      </div>
      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <Button
            onClick={loadMoreCovers}
            isLoading={loading && currentPage > 0} // Show loading on button only for subsequent loads
            disabled={loading}
            variant="secondary"
          >
            Load More Covers
          </Button>
        </div>
      )}

      {/* TODO: Implement CoverDetailModal using selectedCover state */}
      <CoverDetailModal
        isOpen={!!selectedCoverForDetail}
        onClose={() => setSelectedCoverForDetail(null)}
        cover={selectedCoverForDetail}
      />
      {/* {selectedCover && <CoverDetailModal cover={selectedCover} onClose={() => setSelectedCover(null)} />} */}
    </div>
  );
};

export default MyCoversPage;
