"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
    towns: Town[];
    townsCount: number;
    loading: boolean;
    error: string | null;
    addTown: (name: string) => Promise<{ success: boolean; error?: string }>;
    editTown: (id: string, name: string) => Promise<{ success: boolean; error?: string }>;
    removeTown: (id: string) => Promise<{ success: boolean; error?: string }>;
    refetch: () => Promise<void>;
}

const TownContext = createContext<TownContextType | undefined>(undefined);

export const TownProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [towns, setTowns] = useState<Town[]>([]);
    const [townsCount, setTownsCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTowns = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getTown();
            if (result.success && result.data) {
                setTowns(result.data as Town[]);
            } else {
                setError(result.message || 'Failed to fetch towns');
                setTowns([]);
            }
        } catch (err) {
            setError('An error occurred while fetching towns');
            setTowns([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTownsCount = async () => {
        try {
            const result = await getTownsCount();
            if (result.success && result.data !== undefined) {
                setTownsCount(result.data);
            }
        } catch (err) {
            console.error('Failed to fetch towns count');
        }
    };

    const addTown = async (name: string) => {
        try {
            const result = await createTown({ name });
            if (result.success) {
                await fetchTowns();
                await fetchTownsCount();
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
                await fetchTowns();
                await fetchTownsCount();
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
                await fetchTowns();
                await fetchTownsCount();
                return { success: true };
            } else {
                return { success: false, error: result.error || 'Failed to delete town' };
            }
        } catch (err) {
            return { success: false, error: 'An error occurred while deleting town' };
        }
    };

    useEffect(() => {
        fetchTowns();
        fetchTownsCount();
    }, []);

    const value: TownContextType = {
        towns,
        townsCount,
        loading,
        error,
        addTown,
        editTown,
        removeTown,
        refetch: fetchTowns,
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