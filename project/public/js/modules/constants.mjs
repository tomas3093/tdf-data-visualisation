export const MAX_VAL_STR = "_maxValue";

// Codes for distinction between type of visualisation (GC / Stages) 
export const DATA_GC_CODE = 1;
export const DATA_STAGES_CODE = 2;
export const DATA_MOUNTAIN_CODE = 3;
export const DATA_HILLY_CODE = 4;
export const DATA_FLAT_CODE = 5;
export const DATA_ITT_CODE = 6;
export const DATA_MTT_CODE = 7;

// Default value
export const DATA_DEFAULT_CODE = DATA_GC_CODE;

export const ALL_CODES = [
    DATA_GC_CODE, 
    DATA_STAGES_CODE, 
    DATA_MOUNTAIN_CODE, 
    DATA_HILLY_CODE, 
    DATA_FLAT_CODE, 
    DATA_ITT_CODE, 
    DATA_MTT_CODE
];

// Converts numeric code of the stage type to character mark
export function dataCodeToMark(dataCode) {
    switch (dataCode) {
        case DATA_MOUNTAIN_CODE:
            return 'M';

        case DATA_HILLY_CODE:
            return 'H';
    
        case DATA_FLAT_CODE:
            return 'F';
        
        case DATA_ITT_CODE:
            return 'ITT';

        case DATA_MTT_CODE:
            return 'MTT';

        default:
            return '';
    }
}

// ----------------------------------------------

export const SIDE_PANEL_SIZE = 10;

export const SIDE_PANEL_MAX_ITEMS = 10;