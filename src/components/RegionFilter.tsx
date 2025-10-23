import { Region } from '../App';
import { Button } from './ui/button';
import { Compass, Mountain, Palmtree, Waves, Sun } from 'lucide-react';

type RegionFilterProps = {
  selectedRegion: Region | 'All';
  onRegionChange: (region: Region | 'All') => void;
};

const regionIcons = {
  All: Compass,
  North: Mountain,
  South: Palmtree,
  East: Sun,
  West: Waves
};

const regionColors = {
  All: 'bg-red-400 text-white hover:bg-red-500',
  North: 'bg-blue-400 text-white hover:bg-blue-500',
  South: 'bg-green-400 text-white hover:bg-green-500',
  East: 'bg-orange-400 text-white hover:bg-orange-500',
  West: 'bg-cyan-400 text-white hover:bg-cyan-500'
};

const regionColorsInactive = {
  All: 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200',
  North: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200',
  South: 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200',
  East: 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200',
  West: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border border-cyan-200'
};

export function RegionFilter({ selectedRegion, onRegionChange }: RegionFilterProps) {
  const regions: Array<Region | 'All'> = ['All', 'North', 'South', 'East', 'West'];

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white rounded-lg border shadow-sm">
      {regions.map((region) => {
        const Icon = regionIcons[region];
        const isActive = selectedRegion === region;
        const colorClass = isActive ? regionColors[region] : regionColorsInactive[region];

        return (
          <Button
            key={region}
            onClick={() => onRegionChange(region)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${colorClass}`}
          >
            <Icon className="w-4 h-4" />
            {region} India
          </Button>
        );
      })}
    </div>
  );
}
