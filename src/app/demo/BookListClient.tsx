'use client';

import React from 'react';
import { trpc } from '@/utils/trpc';

function BookListClient() {
  // Query existing books to show in a list
  const {
    data: books,
    refetch,
    isLoading,
    error,
  } = trpc.book.list.useQuery({
    limit: 10,
    offset: 0,
  });

  // Handle successful form submission
  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log('Form submitted with data:', data);
    // Refetch the books list to show the new entry
    await refetch();
  };

  return (
    <>
      {/* Display loading state */}
      {isLoading && (
        <div className='mt-12'>
          <div className='flex justify-center'>
            <div className='text-gray-500'>Loading books...</div>
          </div>
        </div>
      )}

      {/* Display error state */}
      {error && (
        <div className='mt-12'>
          <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
            <h2 className='mb-2 text-lg font-semibold text-red-800'>
              Error Loading Books
            </h2>
            <p className='text-red-600'>
              Failed to load books. Please try again later.
            </p>
            <button
              onClick={() => refetch()}
              className='mt-2 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700'
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Display no books message */}
      {!isLoading &&
        !error &&
        books &&
        (!books.data || books.data.length === 0) && (
          <div className='mt-12'>
            <div className='rounded-lg border bg-gray-50 p-8 text-center'>
              <h2 className='mb-2 text-xl font-semibold text-gray-700'>
                No Books Found
              </h2>
              <p className='text-gray-500'>
                There are no books in the database yet. Submit the form above to
                add the first book!
              </p>
            </div>
          </div>
        )}

      {/* Display existing books */}
      {!isLoading && !error && books && books.data && books.data.length > 0 && (
        <div className='mt-12'>
          <h2 className='mb-4 text-2xl font-semibold'>Existing Books</h2>
          <div className='grid gap-4'>
            {books.data.map((book: Record<string, unknown>) => (
              <div
                key={book.id as string}
                className='rounded-lg border bg-gray-50 p-4'
              >
                <h3 className='text-lg font-semibold'>
                  {book.title as string}
                </h3>
                <p className='text-gray-600'>by {book.author as string}</p>
                <p className='text-sm text-gray-500'>
                  Genre: {book.genre as string} | ISBN: {book.isbn as string}
                </p>
                <p className='text-xs text-gray-400'>
                  Published:{' '}
                  {new Date(book.publishedDate as string).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default trpc.withTRPC(BookListClient);
