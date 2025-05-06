import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilterStatus, setSortBy, toggleSortDirection } from '@/store/slices/invoiceSlice';
import { Button } from '@/components/ui/button';
import { SortAsc, SortDesc, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const InvoiceFilters = () => {
  const dispatch = useAppDispatch();
  const { filterStatus, sortBy, sortDirection } = useAppSelector(state => state.invoices);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
  return (
    <div className="bg-white p-4 mb-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <p className="w-full sm:w-auto text-xs font-medium text-slate-500 mb-2 sm:mb-0 sm:mr-2 sm:self-center">Status:</p>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filterStatus === 'ALL' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => dispatch(setFilterStatus('ALL'))}
              className={filterStatus === 'ALL' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-200'}
            >
              All
            </Button>
            <Button 
              variant={filterStatus === 'PAID' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => dispatch(setFilterStatus('PAID'))}
              className={filterStatus === 'PAID' ? 'bg-green-600 hover:bg-green-700' : 'border-slate-200'}
            >
              Paid
            </Button>
            <Button 
              variant={filterStatus === 'PENDING' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => dispatch(setFilterStatus('PENDING'))}
              className={filterStatus === 'PENDING' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-200'}
            >
              Pending
            </Button>
            <Button 
              variant={filterStatus === 'OVERDUE' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => dispatch(setFilterStatus('OVERDUE'))}
              className={filterStatus === 'OVERDUE' ? 'bg-red-600 hover:bg-red-700' : 'border-slate-200'}
            >
              Overdue
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center relative">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 text-slate-700 flex items-center gap-1.5"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
              <Filter size={14} />
              <span>Sort by: <span className="font-medium capitalize">{sortBy}</span></span>
              <ChevronDown size={14} />
            </Button>
            
            {isSortDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-10">
                <button 
                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${sortBy === 'date' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  onClick={() => {
                    dispatch(setSortBy('date'));
                    setIsSortDropdownOpen(false);
                  }}
                >
                  Issue Date
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${sortBy === 'dueDate' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  onClick={() => {
                    dispatch(setSortBy('dueDate'));
                    setIsSortDropdownOpen(false);
                  }}
                >
                  Due Date
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${sortBy === 'amount' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  onClick={() => {
                    dispatch(setSortBy('amount'));
                    setIsSortDropdownOpen(false);
                  }}
                >
                  Amount
                </button>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="border-slate-200 text-slate-700 h-9 w-9"
            onClick={() => dispatch(toggleSortDirection())}
            title={sortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
          >
            {sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFilters; 