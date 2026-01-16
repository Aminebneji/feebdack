"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CreateModalContextType {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (open: boolean) => void;
}

const CreateModalContext = createContext<CreateModalContextType | undefined>(undefined);

export function CreateModalProvider({ children }: { children: ReactNode }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <CreateModalContext.Provider value={{ isCreateModalOpen, setIsCreateModalOpen }}>
            {children}
        </CreateModalContext.Provider>
    );
}

export function useCreateModal() {
    const context = useContext(CreateModalContext);
    if (!context) {
        throw new Error("useCreateModal must be used within a CreateModalProvider");
    }
    return context;
}
