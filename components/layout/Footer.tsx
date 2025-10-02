'use client'

import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter,
  Heart
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-pgri-red">
              PGRI Kabupaten OKU Timur
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Berkomitmen wujudkan guru sejahtera dan pendidikan bermutu untuk OKU Timur Maju Lebih Mulia.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-pgri-red transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-pgri-red transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-pgri-red transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Menu Utama</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-200 hover:text-pgri-green transition-colors duration-200 text-sm"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link 
                  href="/berita" 
                  className="text-gray-200 hover:text-pgri-green transition-colors duration-200 text-sm"
                >
                  Berita
                </Link>
              </li>
              <li>
                <Link 
                  href="/pengurus" 
                  className="text-gray-200 hover:text-pgri-green transition-colors duration-200 text-sm"
                >
                  Pengurus
                </Link>
              </li>
              <li>
                <Link 
                  href="/cari-anggota" 
                  className="text-gray-200 hover:text-pgri-green transition-colors duration-200 text-sm"
                >
                  Cari Anggota
                </Link>
              </li>
              <li>
                <Link 
                  href="/statistik" 
                  className="text-gray-200 hover:text-pgri-green transition-colors duration-200 text-sm"
                >
                  Statistik
                </Link>
              </li>

            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Layanan</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/daftar" 
                  className="text-gray-200 hover:text-pgri-green transition-colors duration-200 text-sm"
                >
                  Pendaftaran Anggota
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="text-gray-200 hover:text-pgri-green transition-colors duration-200 text-sm"
                >
                  Login Anggota
                </Link>
              </li>
              <li>
                <span className="text-gray-200 text-sm">Cetak Kartu Anggota</span>
              </li>
              <li>
                <span className="text-gray-200 text-sm">Verifikasi Keanggotaan</span>
              </li>
              <li>
                <span className="text-gray-200 text-sm">Laporan Data</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-pgri-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-200 text-sm">
                    Sekretariat: Jalan Pertanian Km. 3,5<br />
                    Desa Kromongan Kecamatan Martapura<br />
                    Kode Pos 32181
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-pgri-green flex-shrink-0" />
                <p className="text-gray-200 text-sm">+6282262213900</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-pgri-green flex-shrink-0" />
                <p className="text-gray-200 text-sm">ogankomeringulutimur@ktadigitalpgri.org</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                © 2025 Tim IT PGRI Kabupaten OKU Timur. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}