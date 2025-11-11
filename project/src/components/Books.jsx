import { useState, useEffect } from 'react';
import { getBooks, createBook, getAuthors } from '../services/api';
import { BookOpen, Plus, Calendar, Copy } from 'lucide-react';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_date: '',
    available_copies: 1,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, authorsData] = await Promise.all([
        getBooks(),
        getAuthors(),
      ]);
      setBooks(booksData);
      setAuthors(authorsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createBook(formData);
      setSuccess('Book added successfully!');
      setFormData({
        title: '',
        author: '',
        published_date: '',
        available_copies: 1,
      });
      setShowForm(false);
      loadData();
    } catch (err) {
      setError('Failed to add book');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Books</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Book</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Add New Book</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <select
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select an author</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Published Date
              </label>
              <input
                type="date"
                value={formData.published_date}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Copies
              </label>
              <input
                type="number"
                min="1"
                value={formData.available_copies}
                onChange={(e) => setFormData({ ...formData, available_copies: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Book
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {books.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No books found. Add your first book!
            </div>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex-1">
                    {book.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      book.available_copies > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {book.available_copies > 0 ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Author:</span>
                    <span>{book.author_name || book.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(book.published_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Copy className="w-4 h-4 text-gray-400" />
                    <span>{book.available_copies} copies available</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
