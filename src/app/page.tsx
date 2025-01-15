import Filters from '@/components/Filters'
import Sidebar from '@/components/Sidebar'
import ProductGrid from '@/components/ProductGrid'

export default function Home() {
  return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1">
            <Filters />
            <ProductGrid />
          </div>
        </div>
      </div>
  )
}