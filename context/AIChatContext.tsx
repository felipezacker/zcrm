/**
 * @deprecated AIChatContext has zero consumers and should be removed.
 * AI chat navigation context was planned but never integrated.
 * Use AIContext (useAI) for AI-related state instead.
 *
 * Kept as stub for backward compatibility.
 */
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface AIChatContext {
    boardId?: string;
    dealId?: string;
    contactId?: string;
}

interface AIChatContextProviderState {
    context: AIChatContext;
    setContext: (ctx: Partial<AIChatContext>) => void;
    clearContext: () => void;
    setBoardId: (id: string | undefined) => void;
    setDealId: (id: string | undefined) => void;
    setContactId: (id: string | undefined) => void;
}

const AIChatContextValue = createContext<AIChatContextProviderState | null>(null);

export function AIChatContextProvider({ children }: { children: ReactNode }) {
    const [context, setContextState] = useState<AIChatContext>({});

    const setContext = useCallback((partial: Partial<AIChatContext>) => {
        setContextState(prev => ({ ...prev, ...partial }));
    }, []);

    const clearContext = useCallback(() => setContextState({}), []);
    const setBoardId = useCallback((id: string | undefined) => setContextState(prev => ({ ...prev, boardId: id })), []);
    const setDealId = useCallback((id: string | undefined) => setContextState(prev => ({ ...prev, dealId: id })), []);
    const setContactId = useCallback((id: string | undefined) => setContextState(prev => ({ ...prev, contactId: id })), []);

    return (
        <AIChatContextValue.Provider value={{ context, setContext, clearContext, setBoardId, setDealId, setContactId }}>
            {children}
        </AIChatContextValue.Provider>
    );
}

export function useAIChatContext() {
    const ctx = useContext(AIChatContextValue);
    if (!ctx) throw new Error('useAIChatContext must be used within AIChatContextProvider');
    return ctx;
}

export function useAIChatContextOptional() {
    return useContext(AIChatContextValue);
}
