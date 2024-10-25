export interface Product {
    id: number;
    name: string;
    categoryId: number;
    sellerId: number;
    shortDescription: string;
    longDescription: string;
    hasClassification: boolean;
    slug: string;
    status: string;
    attributeValues?: AttributeValue[];
    classificationGroups?: ClassificationGroup[];
    productClassifications?: ProductClassification[];
}

export interface AttributeValue {
    categoryAttributeValueId: number;
    value: {
        name: string;
    };
}

export interface ClassificationGroup {
    id?: number;
    name: string;
    options: string[];
}

export interface ProductClassification {
    id?: number;
    [key: string]: any;  // Cho phép các trường động như option1, option2, etc.
    price: number;
    stock: number;
}

export interface ProductFilterQuery {
    search?: string;
    categoryId?: number;
    sellerId?: number;
    minPrice?: number;
    maxPrice?: number;
    attributes?: Array<{
        attributeId: number;
        values: any[];
    }>;
    status?: string;
    sortBy?: 'price' | 'createdAt' | 'name';
    sortOrder?: 'asc' | 'desc';
}