
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Company } from '@/types/types';
import CompanySection from './CompanySection';

interface CompanyListProps {
  companies: Company[];
  onUpdateCompanies: (companies: Company[]) => void;
  onUpdateCompany: (updatedCompany: Company) => void;
  onRemoveCompany: (companyId: string) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ 
  companies, 
  onUpdateCompanies, 
  onUpdateCompany, 
  onRemoveCompany 
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(companies);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onUpdateCompanies(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="companies">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-6"
          >
            {companies.map((company, index) => (
              <Draggable key={company.id} draggableId={company.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <CompanySection
                      company={company}
                      onUpdateCompany={onUpdateCompany}
                      onRemoveCompany={onRemoveCompany}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CompanyList;
