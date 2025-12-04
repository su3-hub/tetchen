import axios from 'axios';
import { useAtom } from "jotai";
import { userAtom } from "../context/jotai.js";

export const filteringData = (conditions, data) => {
    const filteredData = [];
    
    return filteredData;
}

export const createUniqueId = () => {
    return Date.now() + Math.floor(10000*Math.random()).toString(16);
}

export const applyFiltersAndSort = (dataToProcess, condition) => {
    let filteredData = dataToProcess;
    if (condition.draft) {
        filteredData =  dataToProcess.filter(d => d.isDraft === true)
    };

    let sortedData = [...filteredData];        
    const sortFn = (a, b) => new Date(a.updatedAt).valueOf() - new Date(b.updatedAt).valueOf();
    if (condition.ascending) {
        sortedData.sort(sortFn);
    } else {
        sortedData.sort((a, b) => sortFn(b, a));
    };
    return sortedData;
};

