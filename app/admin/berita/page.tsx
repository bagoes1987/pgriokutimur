'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminBeritaPage() {
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter
      });
      
      const response = await fetch(`/api/admin/news?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.news);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        toast.error('Gagal memuat data berita');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/news/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Berita berhasil dihapus');
        fetchNews();
      } else {
        toast.error(data.message || 'Gagal menghapus berita');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Terjadi kesalahan saat menghapus berita');
    }
  };

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Berita berhasil ${!isPublished ? 'dipublikasikan' : 'disembunyikan'}`);
        fetchNews();
      } else {
        toast.error(data.message || 'Gagal mengubah status publikasi');
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('Terjadi kesalahan saat mengubah status publikasi');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNews(null);
  };

  const handleSaveForm = () => {
    setShowForm(false);
    setEditingNews(null);
    fetchNews();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 rounded w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 space-y-4">
                    <div className="h-48 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <a
                  href="/admin/dashboard"
                  className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-gray-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="font-medium">Kembali ke Dashboard</span>
                </a>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Kelola Berita
                  </h1>
                  <p className="text-gray-600 text-sm">Buat dan kelola berita untuk website PGRI OKU Timur</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-md text-sm"
              >
                <Plus className="h-4 w-4" />
                Tambah Berita
              </button>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari berita berdasarkan judul..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              >
                <option value="ALL">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              >
                <option value="ALL">Semua Status</option>
                <option value="PUBLISHED">Dipublikasikan</option>
                <option value="DRAFT">Draft</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('ALL');
                    setStatusFilter('ALL');
                    setCurrentPage(1);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  Reset Filter
                </button>
                <button
                  onClick={fetchNews}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 text-sm"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced News Grid */}
          {news.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Berita</h3>
              <p className="text-gray-600 mb-4 text-sm">Mulai buat berita pertama untuk website Anda</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 text-sm"
              >
                Buat Berita Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {news.map((newsItem) => (
                <div key={newsItem.id} className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200">
                    {newsItem.image ? (
                      <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        newsItem.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {newsItem.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-justify">
                      {newsItem.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">{formatDate(newsItem.createdAt)}</span>
                      </div>
                      {newsItem.category && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span className="text-xs">{newsItem.category.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(newsItem)}
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-2 py-1.5 rounded-md hover:bg-blue-100 transition-colors text-xs"
                      >
                        <Edit className="h-3 w-3" />
                        Baca Selengkapnya
                      </button>
                      <button
                        onClick={() => togglePublish(newsItem.id, newsItem.isPublished)}
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md transition-colors text-xs ${
                          newsItem.isPublished
                            ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <Eye className="h-3 w-3" />
                        {newsItem.isPublished ? 'Hide' : 'Publish'}
                      </button>
                      <button
                        onClick={() => deleteNews(newsItem.id)}
                        className="flex items-center justify-center gap-1 bg-red-50 text-red-600 px-2 py-1.5 rounded-md hover:bg-red-100 transition-colors text-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Form Modal */}
      {showForm && (
        <NewsFormModal
          news={editingNews}
          categories={categories}
          onClose={handleCloseForm}
          onSave={handleSaveForm}
        />
      )}
    </AdminLayout>
  );
}

// Enhanced News Form Modal Component
function NewsFormModal({ 
  news, 
  categories, 
  onClose, 
  onSave 
}: { 
  news: News | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    title: news?.title || '',
    content: news?.content || '',
    categoryId: '',
    isPublished: news?.isPublished || false,
    image: news?.image || ''
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(news?.image || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = news ? `/api/admin/news/${news.id}` : '/api/admin/news';
      const method = news ? 'PUT' : 'POST';

      // Create FormData for file upload
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('content', formData.content);
      submitFormData.append('categoryId', formData.categoryId);
      submitFormData.append('isPublished', formData.isPublished.toString());
      
      // Add image file if selected
      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      const response = await fetch(url, {
        method,
        body: submitFormData
      });

      const data = await response.json();

      if (data.success) {
        toast.success(news ? 'Berita berhasil diupdate' : 'Berita berhasil dibuat');
        onSave();
      } else {
        toast.error(data.message || 'Gagal menyimpan berita');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Terjadi kesalahan saat menyimpan berita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {news ? 'Edit Berita' : 'Tambah Berita'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Berita
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        setFormData({ ...formData, image: '' });
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="relative text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Klik untuk upload gambar atau drag & drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Berita
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Masukkan judul berita..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>



            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konten Berita
              </label>
              <textarea
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Tulis konten lengkap berita..."
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="published"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-3 block text-sm font-medium text-gray-900">
                Publikasikan berita sekarang
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : (news ? 'Update Berita' : 'Simpan Berita')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}