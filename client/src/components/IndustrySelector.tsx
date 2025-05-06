import { useState } from 'react';
import { Industry, industries } from '@/lib/industries';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Sparkles, 
  Laptop, 
  Heart, 
  Banknote, 
  GraduationCap, 
  ShoppingBag,
  Factory,
  Home,
  Utensils,
  BarChart,
  Scale,
  Zap,
  CircleDot
} from 'lucide-react';

interface IndustrySelectorProps {
  onSelect: (industry: Industry) => void;
  selectedIndustryId: string | null;
}

export function IndustrySelector({ onSelect, selectedIndustryId }: IndustrySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('grid');

  // Filter industries based on search term
  const filteredIndustries = industries.filter(industry => 
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    industry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get the appropriate icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="h-5 w-5" />;
      case 'Heart': return <Heart className="h-5 w-5" />;
      case 'Banknote': return <Banknote className="h-5 w-5" />;
      case 'GraduationCap': return <GraduationCap className="h-5 w-5" />;
      case 'ShoppingBag': return <ShoppingBag className="h-5 w-5" />;
      case 'Factory': return <Factory className="h-5 w-5" />;
      case 'Home': return <Home className="h-5 w-5" />;
      case 'Utensils': return <Utensils className="h-5 w-5" />;
      case 'BarChart': return <BarChart className="h-5 w-5" />;
      case 'Scale': return <Scale className="h-5 w-5" />;
      case 'Zap': return <Zap className="h-5 w-5" />;
      default: return <CircleDot className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Select Industry</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search industries..."
            className="pl-10 bg-[#111] border-gray-800 text-gray-300 w-[200px] h-9 focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea]"
          />
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-black border border-gray-800 mb-2">
          <TabsTrigger 
            value="grid" 
            className="data-[state=active]:bg-[#0e131f] data-[state=active]:text-[#74d1ea] data-[state=active]:shadow-none focus:ring-0"
          >
            Grid View
          </TabsTrigger>
          <TabsTrigger 
            value="list" 
            className="data-[state=active]:bg-[#0e131f] data-[state=active]:text-[#74d1ea] data-[state=active]:shadow-none focus:ring-0"
          >
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredIndustries.map((industry) => (
              <Card 
                key={industry.id} 
                className={`cursor-pointer border border-gray-800/60 bg-black hover:bg-[#0e131f] transition-all duration-200 
                  ${selectedIndustryId === industry.id ? 'border-[#74d1ea] bg-[#0e131f] shadow-[0_0_15px_rgba(116,209,234,0.15)]' : ''}
                `}
                onClick={() => onSelect(industry)}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className={`${selectedIndustryId === industry.id ? 'bg-[#74d1ea]/20' : 'bg-[#0e131f]'} rounded-lg p-2.5`}>
                    {getIcon(industry.icon)}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{industry.name}</h4>
                    <p className="text-xs text-gray-400 line-clamp-1">{industry.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="space-y-2">
            {filteredIndustries.map((industry) => (
              <div 
                key={industry.id} 
                className={`cursor-pointer flex items-center p-3 rounded-lg border border-gray-800/60 bg-black hover:bg-[#0e131f] transition-all duration-200
                  ${selectedIndustryId === industry.id ? 'border-[#74d1ea] bg-[#0e131f] shadow-[0_0_15px_rgba(116,209,234,0.15)]' : ''}
                `}
                onClick={() => onSelect(industry)}
              >
                <div className={`${selectedIndustryId === industry.id ? 'bg-[#74d1ea]/20' : 'bg-[#0e131f]'} rounded-lg p-2.5 mr-3`}>
                  {getIcon(industry.icon)}
                </div>
                <div>
                  <h4 className="font-medium text-white">{industry.name}</h4>
                  <p className="text-sm text-gray-400">{industry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredIndustries.length === 0 && (
        <div className="text-center p-8 border border-gray-800/60 rounded-lg bg-black/40">
          <Sparkles className="h-8 w-8 text-[#74d1ea]/50 mx-auto mb-2" />
          <p className="text-gray-400">No industries match your search criteria</p>
          <Button 
            variant="ghost" 
            className="mt-2 text-[#74d1ea] hover:text-[#74d1ea]/80 hover:bg-[#0e131f]"
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}