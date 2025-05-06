import React, { useState } from 'react';

// Timeline component that properly shows timeline items with flexible lengths
function TimelineSection({ contents, toggleContentExpansion, contentTypeIcons }) {
  return (
    <div className="mt-6">
      <h3 className="text-white font-medium mb-4 flex items-center">
        <span className="inline-block w-2 h-2 rounded-full bg-[#74d1ea] mr-2"></span>
        Content Timeline
      </h3>
      
      <div className="relative">
        {/* Timeline vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#74d1ea] to-transparent"></div>
        
        {/* Timeline Items */}
        {contents.sort((a, b) => new Date(a.deliveryDate || '').getTime() - new Date(b.deliveryDate || '').getTime())
          .map((content, index) => (
            <div key={index} className="pl-12 pb-8 relative">
              {/* Date and node */}
              <div className="absolute left-0 top-0">
                <div className="absolute left-4 top-2 w-4 h-4 rounded-full border-2 border-[#74d1ea] bg-black z-10 -translate-x-1/2"></div>
                <div className="absolute left-0 top-2 text-xs text-gray-400 w-[40px] text-right pr-6 -translate-y-1/2">
                  {content.deliveryDate ? new Date(content.deliveryDate).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'numeric'
                  }) : '-'}
                </div>
              </div>
              
              {/* Content card */}
              <div className="bg-black border border-gray-800 rounded-lg p-4 hover:border-[#74d1ea]/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="h-5 w-5 rounded-md bg-[#0e131f] border border-gray-800 flex items-center justify-center mr-2">
                        {contentTypeIcons[content.type] || <MessageSquare className="h-3 w-3" />}
                      </div>
                      <h4 className="text-white text-sm font-medium">{content.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{content.persona}</p>
                  </div>
                  <Badge variant="outline" className="bg-[#0e131f] text-[#74d1ea] border-[#74d1ea]/30 text-xs">
                    {content.type}
                  </Badge>
                </div>
                <div className="mt-2 overflow-hidden">
                  <div className="cursor-pointer" onClick={() => toggleContentExpansion(index)}>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {content.content?.substring(0, 100)}...
                    </p>
                    <p className="text-[#74d1ea] text-xs mt-1">Click to view full content</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default TimelineSection;