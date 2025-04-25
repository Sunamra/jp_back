import React, { useEffect, useState } from 'react';
import { CheckboxGroup, CheckboxGroupItem } from './ui/checkbox-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { filterData } from '@/utils/filterData'

// filterData was here & is moved to '@/src/utils/filterData.js'

const FilterCard = () => {
    const [selectedValues, setSelectedValues] = useState([]);
    const dispatch = useDispatch();

    const toggleValue = (item) => {
        setSelectedValues((prev) => {
            if (prev.includes(item)) {
                return prev.filter((selectedItem) => selectedItem !== item);
            } else {
                return [...prev, item];
            }
        });
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValues));
    }, [selectedValues, dispatch]);

    return (
        <div className='w-full min-w-[222px] p-3 rounded-md shadow-[rgba(0,0,0,0.56)_-10px_20px_60px_5px] border border-black'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            {filterData.map((data, index) => (
                <div key={index}>
                    <h1 className='font-bold text-lg'>{data.filterType}</h1>
                    {
                        data.array.map((item, idx) => {
                            const itemId = `id${index}-${idx}`;
                            return (
                                <div className='flex items-center space-x-2 my-2' key={itemId}>
                                    <CheckboxGroupItem
                                        checked={selectedValues.includes(item)}
                                        onCheckedChange={() => toggleValue(item)}
                                        id={itemId}
                                    />
                                    <Label htmlFor={itemId}>{item}</Label>
                                </div>
                            );
                        })
                    }
                </div>
            ))}
        </div>
    );
};

export default FilterCard;
