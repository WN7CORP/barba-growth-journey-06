
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, Home, Gamepad2, Shirt, Smartphone } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { supabase } from "@/integrations/supabase/client";

interface CategoryStats {
  categoria: string;
  count: number;
}

const Categorias = () => {
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('categoria')
        .not('categoria', 'is', null);

      if (error) throw error;

      // Count products per category
      const categoryCount = (data || []).reduce((acc: Record<string, number>, item) => {
        const cat = item.categoria;
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      const categoryStats = Object.entries(categoryCount).map(([categoria, count]) => ({
        categoria,
        count: count as number
      }));

      setCategories(categoryStats);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/categoria-lista?categoria=${encodeURIComponent(category)}&tipo=categoria`);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Beleza e Cuidados Pessoais': Sparkles,
      'Casa e Decoração': Home,
      'Diversão e Familia': Gamepad2,
      'Estilo e Moda': Shirt,
      'Tecnologia e Acessórios': Smartphone
    };
    return iconMap[category] || ShoppingBag;
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-pink-500 to-rose-500', 
      'from-blue-500 to-cyan-500', 
      'from-green-500 to-emerald-500', 
      'from-yellow-500 to-orange-500', 
      'from-purple-500 to-violet-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-blue-500',
      'from-teal-500 to-green-500'
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-white/20 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
      <Header />
      
      {/* Hero Section */}
      <section className="md:px-6 md:py-16 px-[15px] py-[26px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-2xl backdrop-blur-sm">
              <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Explore por <span className="text-yellow-300">Categorias</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Descubra produtos incríveis organizados por categoria
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid - Layout dinâmico 2 por linha no mobile */}
      <section className="px-4 md:px-6 py-0">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {categories.map((category, index) => {
              const IconComponent = getCategoryIcon(category.categoria);
              return (
                <Card 
                  key={category.categoria} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white border-0 shadow-lg group cursor-pointer animate-fade-in hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleCategoryClick(category.categoria)}
                >
                  <div className={`bg-gradient-to-br ${getCategoryGradient(index)} p-4 md:p-6 text-white relative overflow-hidden`}>
                    <div className="absolute -top-4 -right-4 w-16 md:w-24 h-16 md:h-24 bg-white/20 rounded-full transition-transform duration-500 group-hover:scale-110"></div>
                    <div className="absolute -bottom-4 -left-4 w-12 md:w-16 h-12 md:h-16 bg-white/10 rounded-full transition-transform duration-500 group-hover:scale-125"></div>
                    
                    <div className="relative z-10">
                      <div className="mb-3 md:mb-4 transform transition-transform duration-300 group-hover:scale-110">
                        <IconComponent className="w-8 h-8 md:w-12 md:h-12 text-white drop-shadow-lg" />
                      </div>
                      <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 line-clamp-2">
                        {category.categoria}
                      </h3>
                      <p className="text-white/80 text-xs md:text-sm">
                        {category.count} produtos
                      </p>
                    </div>
                  </div>
                  
                  <CardContent className="p-3 md:p-6">
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold transition-all duration-300 hover:scale-105 text-xs md:text-sm py-2 md:py-3 shadow-lg hover:shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.categoria);
                      }}
                    >
                      Ver Produtos
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categorias;
