import { useState, useEffect } from 'react';
import { getBorrowers, createBorrower, getBooks } from '../services/api';
import { Library, Plus, Calendar, ArrowLeft, User, Mail, BookOpen } from 'lucide-react'; // Added icons

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(null); // 👈 NEW STATE for detail view
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    book: '',
    return_date: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [borrowersData, booksData] = await Promise.all([
        getBorrowers(),
        getBooks(),
      ]);
      setBorrowers(borrowersData);
      setBooks(booksData);
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
      // NOTE: Your backend needs to handle the decrement of available_copies
      await createBorrower(formData); 
      setSuccess('Book borrowed successfully!');
      setFormData({
        name: '',
        email: '',
        book: '',
        return_date: '',
      });
      setShowForm(false);
      loadData();
    } catch (err) {
      // Attempt to parse validation errors if available, otherwise use generic message
      const errorMessage = err.response?.data ? 
        Object.values(err.response.data).flat().join(' | ') : 
        (err.message || 'Failed to borrow book');
      setError(errorMessage);
    }
  };

  const availableBooks = books.filter((book) => book.available_copies > 0);

  // Helper to find the book title from the book ID (assuming `borrower.book` is the ID)
  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Book not found';
  };
  
  // --- RENDERING LOGIC ---

  // 1. DETAIL VIEW: Rendered when a borrower is selected
  if (selectedBorrower) {
    // Filter all borrowed items to only show the ones belonging to the selected borrower
    // NOTE: This assumes a borrower can have multiple entries in the 'borrowers' table
    //       if they've borrowed multiple books, which is typical for this structure.
    const booksBorrowed = borrowers.filter(b => b.email === selectedBorrower.email);
    
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedBorrower(null)} // Go back to the main list
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition font-medium mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to All Borrowers</span>
        </button>

        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-600" />
            <span>{selectedBorrower.name}'s Borrowing History</span>
          </h2>
          <div className="flex items-center space-x-2 text-gray-600 mb-6">
            <Mail className="w-4 h-4" />
            <p className="text-lg">{selectedBorrower.email}</p>
          </div>

          <h3 className="text-xl font-semibold mb-3 text-gray-700">Currently Borrowed Books ({booksBorrowed.length})</h3>
          
          <div className="space-y-4">
            {booksBorrowed.map((item) => {
              const bookTitle = getBookTitle(item.book); // Use the helper function
              const isOverdue = new Date(item.return_date) < new Date();
              
              return (
                <div key={item.id} className={`p-4 rounded-lg border ${isOverdue ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-lg font-medium text-gray-800">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span>{bookTitle}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isOverdue ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      }`}
                    >
                      {isOverdue ? 'OVERDUE' : 'ACTIVE'}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Borrowed: {new Date(item.borrowed_date).toLocaleDateString()}</p>
                    <p className={isOverdue ? 'text-red-700 font-medium' : 'text-gray-700'}>
                      Due: {new Date(item.return_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. LIST/FORM VIEW: Rendered when no borrower is selected
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Library className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Borrowed Books</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Borrow Book</span>
        </button>
      </div>

      {/* Error and Success Messages (Omitted for brevity, but kept in original code) */}
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

      {/* Form (Omitted for brevity, but kept in original code) */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Borrow a Book</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input fields for Name, Email, Book, Return Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Borrower Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Book</label>
              <select value={formData.book} onChange={(e) => setFormData({ ...formData, book: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                <option value="">Select a book</option>
                {availableBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.available_copies} available)
                  </option>
                ))}
              </select>
              {availableBooks.length === 0 && (<p className="text-sm text-red-600 mt-1">No books available for borrowing</p>)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
              <input type="date" value={formData.return_date} onChange={(e) => setFormData({ ...formData, return_date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min={new Date().toISOString().split('T')[0]} required />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" disabled={availableBooks.length === 0}>Borrow Book</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Loading and List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {borrowers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No borrowed books yet. Start borrowing!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header (Omitted for brevity) */}
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {borrowers.map((borrower) => {
                    const isOverdue = new Date(borrower.return_date) < new Date();
                    
                    // The borrower data you receive from the API might contain duplicates if the same person borrowed multiple books.
                    // This is handled in the detail view by filtering the list.
                    
                    return (
                      <tr key={borrower.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {/* 👈 CLICK HANDLER ADDED HERE */}
                          <button 
                            onClick={() => setSelectedBorrower(borrower)}
                            className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                          >
                            {borrower.name}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{borrower.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBookTitle(borrower.book)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <ArrowLeft className="w-4 h-4 text-gray-400" />
                            <span>{new Date(borrower.borrowed_date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date(borrower.return_date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isOverdue ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {isOverdue ? 'Overdue' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}