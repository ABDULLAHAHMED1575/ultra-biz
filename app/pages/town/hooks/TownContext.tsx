"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { getTown } from '@/app/pages/town/actions/getTown';
import { getTownsCount } from '@/app/pages/town/actions/getTownCounts';
import { createTown } from '@/app/pages/town/actions/createTown';
import { updateTown } from '@/app/pages/town/actions/updateTown';
import { deleteTown } from '@/app/pages/town/actions/deleteTown';

interface Sector {
    id: string;
    name: string;
    townId: string;
    createdAt: Date;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    townId: string;
    sectorId: string;
    createdAt: Date;
}

interface Town {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date;
    sectors: Sector[];
    customers: Customer[];
}

interface TownContextType {
    getTowns: () => Promise<Town[]>;
    getTownCount: () => Promise<number>;
    addTown: (name: string) => Promise<{ success: boolean; error?: string }>;
    editTown: (id: string, name: string) => Promise<{ success: boolean; error?: string }>;
    removeTown: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const TownContext = createContext<TownContextType | undefined>(undefined);

export const TownProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const getTowns = async (): Promise<Town[]> => {
        try {
            const result = await getTown();
            if (result.success && result.data) {
                return result.data as Town[];
            }
            return [];
        } catch (err) {
            console.error('Error fetching towns:', err);
            return [];
        }
    };

    const getTownCount = async (): Promise<number> => {
        try {
            const result = await getTownsCount();
            if (result.success && result.data !== undefined) {
                return result.data;
            }
            return 0;
        } catch (err) {
            console.error('Error fetching town count:', err);
            return 0;
        }
    };

    const addTown = async (name: string) => {
        try {
            const result = await createTown({ name });
            if (result.success) {
                return { success: true };
            } else {
                return { success: false, error: result.error || 'Failed to create town' };
            }
        } catch (err) {
            return { success: false, error: 'An error occurred while creating town' };
        }
    };

    const editTown = async (id: string, name: string) => {
        try {
            const result = await updateTown(id, { name });
            if (result.success) {
                return { success: true };
            } else {
                return { success: false, error: result.error || 'Failed to update town' };
            }
        } catch (err) {
            return { success: false, error: 'An error occurred while updating town' };
        }
    };

    const removeTown = async (id: string) => {
        try {
            const result = await deleteTown(id);
            if (result.success) {
                return { success: true };
            } else {
                return { success: false, error: result.error || 'Failed to delete town' };
            }
        } catch (err) {
            return { success: false, error: 'An error occurred while deleting town' };
        }
    };

    const value: TownContextType = {
        getTowns,
        getTownCount,
        addTown,
        editTown,
        removeTown,
    };

    return <TownContext.Provider value={value}>{children}</TownContext.Provider>;
};

export const useTownContext = () => {
    const context = useContext(TownContext);
    if (context === undefined) {
        throw new Error('useTownContext must be used within a TownProvider');
    }
    return context;
};