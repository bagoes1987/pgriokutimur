'use client'

import PublicLayout from '@/components/layout/PublicLayout'
import { Building, Eye, Target, Heart, Award, Users, Flag, Lightbulb } from 'lucide-react'

export default function TentangPage() {
  return (
    <PublicLayout>
      {/* Hero Section - Lebih kompak */}
      <section className="bg-gradient-to-br from-pgri-red to-pgri-red-dark text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              <span className="block text-white">Tentang</span>
              <span className="block text-pgri-yellow">PGRI OKU Timur</span>
            </h1>
            <p className="text-sm md:text-base text-red-100 max-w-4xl mx-auto leading-relaxed">
              PGRI Kabupaten OKU Timur adalah organisasi perjuangan profesi guru dan tenaga kependidikan yang berupaya mewujudkan guru yang profesional, bermartabat, sejahtera, serta meningkatkan mutu pendidikan, serta bertugas membela dan memperjuangkan hak-hak guru di Kabupaten OKU Timur, sehingga mampu mewujudkan visi "OKU Timur Maju Lebih Mulia," dan menjaga kesatuan serta persatuan bangsa Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Sejarah Section - Lebih ringkas */}
      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Building className="h-10 w-10 text-pgri-red mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Sejarah Organisasi</h2>
            <div className="w-16 h-0.5 bg-pgri-yellow mx-auto"></div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                PGRI Kabupaten OKU Timur merupakan organisasi profesi guru yang berdiri sebagai wadah 
                perjuangan dan pengembangan profesi guru di wilayah Kabupaten Ogan Komering Ulu Timur.
              </p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                Sebagai bagian dari PGRI Nasional, kami berkomitmen memperjuangkan kesejahteraan guru, 
                meningkatkan kualitas pendidikan, dan membangun sistem pendidikan berkualitas di daerah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi Section - Layout horizontal yang kompak */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Visi */}
            <div className="text-center">
              <Eye className="h-10 w-10 text-pgri-red mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">Visi</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Mewujudkan guru profesional, bermartabat, dan sejahtera untuk meningkatkan mutu pendidikan serta mendukung terwujudnya visi "OKU Timur Maju Lebih Mulia."
                </p>
              </div>
            </div>

            {/* Misi */}
            <div className="text-center">
              <Target className="h-10 w-10 text-pgri-red mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">Misi</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-pgri-red rounded-full mt-1.5 mr-2"></span>
                    <span className="text-gray-700">Membela dan memperjuangkan hak-hak guru dan tenaga kependidikan di Kabupaten OKU Timur.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-pgri-red rounded-full mt-1.5 mr-2"></span>
                    <span className="text-gray-700">Meningkatkan profesionalisme guru melalui pengembangan kompetensi dan integritas.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-pgri-red rounded-full mt-1.5 mr-2"></span>
                    <span className="text-gray-700">Memperkuat peran guru dalam memajukan mutu pendidikan nasional, khususnya di Kabupaten OKU Timur.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-pgri-red rounded-full mt-1.5 mr-2"></span>
                    <span className="text-gray-700">Menjaga persatuan dan kesatuan bangsa melalui solidaritas profesi guru.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-pgri-red rounded-full mt-1.5 mr-2"></span>
                    <span className="text-gray-700">Menjadi mitra strategis pemerintah dan masyarakat dalam mencerdaskan kehidupan bangsa.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai-Nilai Organisasi - Grid yang lebih kompak */}
      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <Heart className="h-10 w-10 text-pgri-red mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Nilai-Nilai Organisasi</h2>
            <div className="w-16 h-0.5 bg-pgri-yellow mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Profesionalisme */}
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <Award className="h-8 w-8 text-pgri-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-900 mb-2">Profesionalisme</h4>
              <p className="text-xs text-gray-600">
                Mengutamakan kompetensi, kualitas, dan dedikasi guru dalam menjalankan tugas.
              </p>
            </div>

            {/* Integritas */}
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <Flag className="h-8 w-8 text-pgri-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-900 mb-2">Integritas</h4>
              <p className="text-xs text-gray-600">
                Menjunjung tinggi kejujuran, etika, dan tanggung jawab dalam setiap tindakan.
              </p>
            </div>

            {/* Kesejahteraan */}
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <Heart className="h-8 w-8 text-pgri-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-900 mb-2">Kesejahteraan</h4>
              <p className="text-xs text-gray-600">
                Memperjuangkan hak-hak guru untuk kehidupan yang layak dan bermartabat.
              </p>
            </div>

            {/* Solidaritas */}
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <Users className="h-8 w-8 text-pgri-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-900 mb-2">Solidaritas</h4>
              <p className="text-xs text-gray-600">
                Memperkuat persatuan, kebersamaan, dan kepedulian antaranggota.
              </p>
            </div>

            {/* Pengabdian */}
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <Target className="h-8 w-8 text-pgri-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-900 mb-2">Pengabdian</h4>
              <p className="text-xs text-gray-600">
                Berkomitmen mencerdaskan kehidupan bangsa melalui pendidikan yang bermutu.
              </p>
            </div>

            {/* Kebangsaan */}
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <Flag className="h-8 w-8 text-pgri-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-900 mb-2">Kebangsaan</h4>
              <p className="text-xs text-gray-600">
                Menjaga kesatuan, persatuan, dan nilai luhur Pancasila serta NKRI.
              </p>
            </div>

            {/* Inovasi */}
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <Lightbulb className="h-8 w-8 text-pgri-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-900 mb-2">Inovasi</h4>
              <p className="text-xs text-gray-600">
                Mendorong pemanfaatan teknologi dan pembaruan dalam pendidikan.
              </p>
            </div>

            {/* Tanggung Jawab Sosial */}
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <Eye className="h-8 w-8 text-pgri-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-900 mb-2">Tanggung Jawab Sosial</h4>
              <p className="text-xs text-gray-600">
                Aktif berperan dalam pembangunan masyarakat dan kepedulian terhadap lingkungan sekitar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Lebih sederhana */}
      <section className="py-6 bg-gradient-to-r from-pgri-green to-pgri-green-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg md:text-xl font-bold mb-3">
            Bergabunglah dengan PGRI OKU Timur
          </h2>
          <p className="text-sm mb-4 max-w-3xl mx-auto leading-relaxed">
            Bersama PGRI Kabupaten OKU Timur, wujudkan guru sejahtera dan pendidikan bermutu<br />
            untuk OKU Timur Maju Lebih Mulia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/daftar"
              className="inline-flex items-center justify-center px-6 py-2 bg-white text-pgri-green hover:bg-gray-100 font-medium rounded-lg transition-colors duration-200 text-sm"
            >
              Daftar Sebagai Anggota
            </a>
            <a
              href="/pengurus"
              className="inline-flex items-center justify-center px-6 py-2 border border-white text-white hover:bg-white hover:text-pgri-green font-medium rounded-lg transition-colors duration-200 text-sm"
            >
              Lihat Pengurus
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}